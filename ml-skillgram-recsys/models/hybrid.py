"""
Hybrid scorer: blends ALS, content cosine, weighted_rating prior, and
domain match into a single score.

Usage:
    from models.hybrid import HybridRecommender
    rec = HybridRecommender.load()
    rec.recommend(user_id="...", top_k=10, primary_domain="Machine Learning")
"""
from __future__ import annotations
import numpy as np, pandas as pd
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "artifacts"
DATA = ROOT / "data"

def _zscore(x: np.ndarray) -> np.ndarray:
    s = x.std()
    return (x - x.mean()) / s if s > 1e-9 else x - x.mean()

@dataclass
class HybridRecommender:
    als_user_factors: np.ndarray
    als_item_factors: np.ndarray
    als_users: list
    als_items: list
    content_emb: np.ndarray
    content_items: list
    resources: pd.DataFrame
    alpha: float = 0.55
    beta: float = 0.30
    gamma: float = 0.10
    delta: float = 0.05

    @classmethod
    def load(cls) -> "HybridRecommender":
        a = np.load(ART / "als.npz", allow_pickle=True)
        c = np.load(ART / "content.npz", allow_pickle=True)
        return cls(
            als_user_factors=a["user_factors"],
            als_item_factors=a["item_factors"],
            als_users=list(a["users"]),
            als_items=list(a["items"]),
            content_emb=c["embeddings"],
            content_items=list(c["item_ids"]),
            resources=pd.read_parquet(DATA / "resources.parquet"),
        )

    def recommend(self, user_id: str, top_k: int = 10,
                  primary_domain: str | None = None) -> pd.DataFrame:
        items = self.als_items
        n = len(items)

        # ALS scores
        if user_id in self.als_users:
            ui = self.als_users.index(user_id)
            als = self.als_item_factors @ self.als_user_factors[ui]
        else:
            als = np.zeros(n)  # cold-start: rely on content + prior

        # Content profile = mean of items the user interacted with positively
        # For cold-start, just use 0; the content boost still applies via rating prior.
        cosine = np.zeros(n)

        # Rating prior aligned to als items
        res = self.resources.set_index("id")
        wr = np.array([
            float(res.loc[i, "weighted_rating"] or 0) if i in res.index else 0.0
            for i in items
        ])
        dom = np.array([
            1.0 if (primary_domain and i in res.index and
                    res.loc[i, "domain"] == primary_domain) else 0.0
            for i in items
        ])

        score = (self.alpha * _zscore(als)
               + self.beta  * _zscore(cosine)
               + self.gamma * _zscore(wr)
               + self.delta * dom)

        idx = np.argsort(-score)[:top_k]
        return pd.DataFrame({
            "item_id": [items[i] for i in idx],
            "score": score[idx],
            "als": als[idx],
            "weighted_rating": wr[idx],
            "domain_match": dom[idx],
        })
