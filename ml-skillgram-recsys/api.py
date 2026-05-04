from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from pathlib import Path

app = FastAPI()

# Allow frontend (Vite dev server) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
ART = ROOT / "artifacts"

# =========================
# LOAD MODELS
# =========================
als = np.load(ART / "als.npz", allow_pickle=True)
user_factors = als["user_factors"]
item_factors = als["item_factors"]

content = np.load(ART / "content.npz", allow_pickle=True)
content_emb = content["embeddings"]

df = pd.read_parquet(DATA / "resources.parquet")
interactions = pd.read_parquet(DATA / "interactions.parquet")

# Load users safely
try:
    users = pd.read_parquet(DATA / "user_preferences.parquet")
except:
    try:
        users = pd.read_parquet(DATA / "users.parquet")
    except:
        print("⚠️ No user preferences found. Domain logic disabled.")
        users = None

# =========================
# PRECOMPUTE POPULARITY
# =========================
if "item_id" in interactions.columns:
    popularity_counts = interactions["item_id"].value_counts()
else:
    popularity_counts = {}

# =========================
# RECOMMEND FUNCTION
# =========================
def recommend(user_id, top_k=10):
    user_vec = user_factors[user_id]
    als_scores = item_factors @ user_vec

    content_subset = content_emb[:len(als_scores)]
    content_scores = content_subset @ content_emb.mean(axis=0)

    # ✅ Hybrid (content slightly stronger)
    scores = 0.4 * als_scores + 0.6 * content_scores

    df_subset = df.iloc[:len(scores)].copy()

    # =========================
    # DOMAIN PRIORITIZATION (KEY FIX)
    # =========================
    if users is not None and "primary_domain" in users.columns:
        user_domain = users.iloc[user_id]["primary_domain"]

        if "domain" in df_subset.columns:
            domain_mask = (df_subset["domain"] == user_domain).astype(int)

            # Strong boost
            scores += domain_mask.values * 10

    # =========================
    # POPULARITY PENALTY (reduced)
    # =========================
    if len(popularity_counts) > 0:
        pop_score = np.array([
            popularity_counts.get(i, 1) for i in range(len(df_subset))
        ])
        scores -= 0.005 * pop_score

    # =========================
    # DIVERSITY BOOST (reduced)
    # =========================
    diversity = df_subset["title"].apply(lambda x: len(str(x))).values
    scores += 0.01 * diversity

    # =========================
    # REMOVE SEEN ITEMS
    # =========================
    if "user_id" in interactions.columns and "item_id" in interactions.columns:
        seen = interactions[interactions["user_id"] == user_id]["item_id"].values
        seen = pd.to_numeric(seen, errors="coerce")
        seen = seen[~np.isnan(seen)].astype(int)
        seen = seen[seen < len(scores)]
        scores[seen] = -np.inf

    # =========================
    # TOP K
    # =========================
    top_idx = np.argsort(scores)[::-1][:top_k]

    result = df_subset.iloc[top_idx][["title", "domain"]]

    return result.to_dict(orient="records")


# =========================
# API ROUTE
# =========================
@app.get("/recommend")
def get_recommendations(user_id: int, top_k: int = 10):
    return {
        "user_id": user_id,
        "recommendations": recommend(user_id, top_k)
    }