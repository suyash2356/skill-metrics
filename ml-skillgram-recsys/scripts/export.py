"""
Export training data from Supabase to local parquet files.

Reads via the PostgREST API using the anon key (RLS-aware) for resources, and via
the service-role key (set SUPABASE_SERVICE_ROLE_KEY env var) for interactions_ml
since that table has restricted SELECT.

Outputs:
  data/interactions.parquet   user_id, item_id, interaction_type, score, ts
  data/resources.parquet      id, title, description, domain, category,
                              difficulty, weighted_rating, total_ratings,
                              learning_outcomes, related_skills
  data/users.parquet          user_id, primary_domain, interests
"""
from __future__ import annotations
import os, sys, time, requests
import pandas as pd
from pathlib import Path

URL = os.environ["SUPABASE_URL"].rstrip("/")
ANON = os.environ.get("SUPABASE_ANON_KEY")
SERVICE = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
DATA = Path(__file__).resolve().parent.parent / "data"
DATA.mkdir(exist_ok=True)

def fetch(table: str, select: str, key: str, page: int = 1000) -> list[dict]:
    rows: list[dict] = []
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    offset = 0
    while True:
        r = requests.get(
            f"{URL}/rest/v1/{table}",
            params={"select": select, "limit": page, "offset": offset},
            headers=headers,
            timeout=60,
        )
        r.raise_for_status()
        chunk = r.json()
        if not chunk:
            break
        rows.extend(chunk)
        if len(chunk) < page:
            break
        offset += page
        time.sleep(0.05)
    return rows

def main() -> None:
    if not SERVICE:
        sys.exit("SUPABASE_SERVICE_ROLE_KEY is required to read interactions_ml.")

    print("→ resources")
    res = fetch(
        "resources",
        "id,title,description,domain,category,difficulty,weighted_rating,"
        "total_ratings,learning_outcomes,related_skills,is_active",
        ANON or SERVICE,
    )
    df_res = pd.DataFrame(res)
    df_res = df_res[df_res["is_active"] == True].drop(columns=["is_active"])
    df_res.to_parquet(DATA / "resources.parquet", index=False)
    print(f"  saved {len(df_res)} resources")

    print("→ interactions_ml")
    inter = fetch(
        "interactions_ml",
        "user_id,item_id,interaction_type,score,created_at",
        SERVICE,
    )
    df_int = pd.DataFrame(inter)
    df_int = df_int[df_int["interaction_type"] != "skip"].copy()
    df_int.to_parquet(DATA / "interactions.parquet", index=False)
    print(f"  saved {len(df_int)} interactions (skips dropped)")

    print("→ user_preferences")
    up = fetch("user_preferences", "user_id,primary_domain,interests", SERVICE)
    pd.DataFrame(up).to_parquet(DATA / "users.parquet", index=False)
    print(f"  saved {len(up)} user rows")

if __name__ == "__main__":
    main()
