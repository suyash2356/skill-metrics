import numpy as np
import pandas as pd
from pathlib import Path

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

# =========================
# LOAD DATA
# =========================
df = pd.read_parquet(DATA / "resources.parquet")

# Load users safely
try:
    users = pd.read_parquet(DATA / "user_preferences.parquet")
except:
    try:
        users = pd.read_parquet(DATA / "users.parquet")
    except:
        print("⚠️ No user preferences file found. Domain personalization disabled.")
        users = None

# Load interactions
interactions = pd.read_parquet(DATA / "interactions.parquet")

# =========================
# DETECT COLUMN NAMES
# =========================
def get_col(df, possible_names):
    for name in possible_names:
        if name in df.columns:
            return name
    return None

user_col = get_col(interactions, ["user_id", "user"])
item_col = get_col(interactions, ["item_id", "resource_id", "item"])

# =========================
# PRECOMPUTE POPULARITY
# =========================
if item_col:
    popularity_counts = interactions[item_col].value_counts()
else:
    popularity_counts = {}

# =========================
# RECOMMEND FUNCTION
# =========================
def recommend(user_id, top_k=10):
    # ALS score
    user_vec = user_factors[user_id]
    als_scores = item_factors @ user_vec

    # Content score (aligned)
    content_subset = content_emb[:len(als_scores)]
    content_scores = content_subset @ content_emb.mean(axis=0)

    # Hybrid score (more content weight)
    scores = 0.4 * als_scores + 0.6 * content_scores

    df_subset = df.iloc[:len(scores)].copy()

    # =========================
    # DOMAIN BOOST
    # =========================
    if users is not None:
        if "primary_domain" in users.columns and "domain" in df.columns:
            user_domain = users.iloc[user_id]["primary_domain"]
            domain_bonus = (df_subset["domain"] == user_domain).astype(int) * 5.0
            scores += domain_bonus.values

    # =========================
    # POPULARITY PENALTY
    # =========================
    if item_col:
        pop_score = np.array([
            popularity_counts.get(df_subset.index[i], 1)
            for i in range(len(df_subset))
        ])
        scores -= 0.01 * pop_score

    # =========================
    # DIVERSITY BOOST
    # =========================
    diversity = df_subset["title"].apply(lambda x: len(str(x))).values
    scores += 0.05 * diversity

    # =========================
    # REMOVE SEEN ITEMS
    # =========================
    if user_col and item_col:
        seen = interactions[interactions[user_col] == user_id][item_col].values

    # Convert to numeric safely
    seen = pd.to_numeric(seen, errors="coerce")

    # Remove invalid values (NaN + out of bounds)
    seen = seen[~np.isnan(seen)].astype(int)
    seen = seen[seen < len(scores)]

    scores[seen] = -np.inf

    # =========================
    # TOP K
    # =========================
    top_idx = np.argsort(scores)[::-1][:top_k]

    result = df_subset.iloc[top_idx][["title", "domain"]].copy()
    result["score"] = scores[top_idx]

    return result


# =========================
# TEST
# =========================
print("\nTop Recommendations for User 0:\n")
print(recommend(0))