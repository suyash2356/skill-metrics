"""
Implicit ALS collaborative filter.

Trains on the user-item matrix from data/interactions.parquet and saves
artifacts/als.npz with item factors, user factors, and id mappings.
"""
from __future__ import annotations
import numpy as np, pandas as pd
from pathlib import Path
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares
from implicit.nearest_neighbours import bm25_weight

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ART = ROOT / "artifacts"; ART.mkdir(exist_ok=True)

def build_matrix(df: pd.DataFrame):
    user_ids = df["user_id"].astype("category")
    item_ids = df["item_id"].astype("category")
    weights = df["score"].clip(lower=0).astype(np.float32).values
    mat = csr_matrix(
        (weights, (user_ids.cat.codes, item_ids.cat.codes)),
        shape=(len(user_ids.cat.categories), len(item_ids.cat.categories)),
    )
    return mat, list(user_ids.cat.categories), list(item_ids.cat.categories)

def train(factors=64, reg=0.05, iters=30):
    df = pd.read_parquet(DATA / "interactions.parquet")
    mat, users, items = build_matrix(df)
    print(f"matrix: {mat.shape}, nnz={mat.nnz}")

    weighted = bm25_weight(mat, K1=1.2, B=0.5).tocsr()
    model = AlternatingLeastSquares(factors=factors, regularization=reg,
                                    iterations=iters, use_gpu=False)
    model.fit(weighted)

    np.savez(
        ART / "als.npz",
        user_factors=model.user_factors,
        item_factors=model.item_factors,
        users=np.array(users, dtype=object),
        items=np.array(items, dtype=object),
    )
    print(f"saved {ART/'als.npz'}")

if __name__ == "__main__":
    train()
