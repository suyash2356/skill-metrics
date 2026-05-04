"""
Content-based encoder using sentence-transformers/all-MiniLM-L6-v2.

Encodes resource text (title + description + outcomes) into 384-d vectors
and writes artifacts/content.npz + a FAISS index for fast nearest-neighbor.
"""
from __future__ import annotations
import numpy as np
import pandas as pd
import faiss
from pathlib import Path
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ART = ROOT / "artifacts"; ART.mkdir(exist_ok=True)

MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def safe_list(x):
    """Convert various formats into a clean Python list"""
    if x is None:
        return []
    if isinstance(x, float):  # handles NaN
        return []
    if isinstance(x, (list, tuple)):
        return list(x)
    if hasattr(x, "tolist"):  # numpy array / pandas
        return x.tolist()
    return [str(x)]


def make_text(row: pd.Series) -> str:
    parts = [
        str(row.get("title", "")),
        str(row.get("description", ""))
    ]

    # ✅ FIXED learning_outcomes
    outs = safe_list(row.get("learning_outcomes"))
    parts.extend([str(o) for o in outs if o])

    # ✅ FIXED related_skills
    skills = safe_list(row.get("related_skills"))
    if skills:
        parts.append(" ".join(map(str, skills)))

    return " ".join(p for p in parts if p)


def encode():
    df = pd.read_parquet(DATA / "resources.parquet")

    texts = df.apply(make_text, axis=1).tolist()

    model = SentenceTransformer(MODEL)
    emb = model.encode(
        texts,
        batch_size=64,
        show_progress_bar=True,
        normalize_embeddings=True
    ).astype(np.float32)

    index = faiss.IndexFlatIP(emb.shape[1])
    index.add(emb)

    faiss.write_index(index, str(ART / "content.faiss"))

    np.savez(
        ART / "content.npz",
        item_ids=df["id"].values.astype(object),
        embeddings=emb
    )

    print(f"encoded {len(df)} resources → {ART/'content.npz'}")


if __name__ == "__main__":
    encode()