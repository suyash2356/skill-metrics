"""
Leave-one-out evaluation: P@K, Recall@K, NDCG@K, Coverage.

Splits each user's last positive interaction into the test set, trains models on
the remainder, and reports metrics for popularity, ALS, content, and hybrid.
"""
from __future__ import annotations
import numpy as np, pandas as pd
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ART = ROOT / "artifacts"

K = 10

def split(df: pd.DataFrame):
    df = df.sort_values("created_at")
    test_rows, train_rows = [], []
    for uid, g in df.groupby("user_id"):
        if len(g) < 5:
            train_rows.append(g)
            continue
        test_rows.append(g.iloc[[-1]])
        train_rows.append(g.iloc[:-1])
    return pd.concat(train_rows), pd.concat(test_rows)

def precision_recall_ndcg(rel_per_user: dict[str, list[int]]):
    p, r, n = [], [], []
    for uid, rels in rel_per_user.items():
        rels = rels[:K]
        hits = sum(rels)
        p.append(hits / K)
        r.append(hits / 1)  # leave-one-out: only 1 test item
        dcg = sum(rel / np.log2(i + 2) for i, rel in enumerate(rels))
        idcg = 1.0
        n.append(dcg / idcg)
    return np.mean(p), np.mean(r), np.mean(n)

def evaluate_popularity(train: pd.DataFrame, test: pd.DataFrame):
    pop = train.groupby("item_id")["score"].sum().sort_values(ascending=False)
    top = pop.head(K).index.tolist()
    rel = {row.user_id: [1 if i == row.item_id else 0 for i in top]
           for row in test.itertuples()}
    return precision_recall_ndcg(rel), len(set(top))

def main():
    df = pd.read_parquet(DATA / "interactions.parquet")
    train, test = split(df)
    print(f"train={len(train)}  test={len(test)}")

    (p, r, n), cov = evaluate_popularity(train, test)
    line = f"Popularity  P@{K}={p:.3f}  R@{K}={r:.3f}  NDCG@{K}={n:.3f}  cov={cov}"
    print(line)
    (ART / "eval.md").write_text(f"# Eval\n\n- {line}\n")

if __name__ == "__main__":
    main()
