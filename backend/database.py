import sqlite3
import os
import json
import uuid
from datetime import datetime, date
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

DB_PATH = os.environ.get("DB_PATH", str(ROOT_DIR / "portfolio.db"))


# ── datetime-safe JSON encoder ────────────────────────────────────────────
class _Encoder(json.JSONEncoder):
    """Converts datetime/date to ISO string so json.dumps never crashes."""
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

def _dumps(obj) -> str:
    return json.dumps(obj, cls=_Encoder)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


class UpdateResult:
    """Mimics Motor's UpdateResult so server.py checks still work."""
    def __init__(self, modified: int, upserted_id=None):
        self.modified_count = modified
        self.upserted_id = upserted_id


class DeleteResult:
    """Mimics Motor's DeleteResult."""
    def __init__(self, deleted: int):
        self.deleted_count = deleted


class InsertOneResult:
    """Mimics Motor's InsertOneResult."""
    def __init__(self, inserted_id: str):
        self.inserted_id = inserted_id


class SQLiteCollection:
    def __init__(self, table_name: str):
        self.table = table_name
        self._ensure_table()

    def _ensure_table(self):
        with get_connection() as conn:
            conn.execute(f"""
                CREATE TABLE IF NOT EXISTS {self.table} (
                    id   TEXT PRIMARY KEY,
                    data TEXT NOT NULL
                )
            """)
            conn.commit()

    def _to_doc(self, row) -> dict | None:
        if row is None:
            return None
        doc = json.loads(row["data"])
        doc["_id"] = row["id"]
        return doc

    def _get_id(self, document: dict) -> str:
        return str(
            document.get("id") or
            document.get("_id") or
            uuid.uuid4().hex
        )

    def _matches(self, doc: dict, query: dict) -> bool:
        for key, value in query.items():
            parts = key.split(".")
            cur = doc
            for part in parts:
                if not isinstance(cur, dict) or part not in cur:
                    return False
                cur = cur[part]
            if cur != value:
                return False
        return True

    # ── Cursor-like helper for chained .sort().to_list() ──────────────────

    class _Cursor:
        def __init__(self, docs: list):
            self._docs = docs

        def sort(self, field: str, direction: int = 1):
            reverse = direction == -1
            self._docs = sorted(
                self._docs,
                key=lambda d: d.get(field, 0),
                reverse=reverse
            )
            return self

        async def to_list(self, length: int = 100):
            return self._docs[:length]

    # ── CRUD ──────────────────────────────────────────────────────────────

    def find_one(self, query: dict = None) -> dict | None:
        with get_connection() as conn:
            if not query:
                row = conn.execute(
                    f"SELECT id, data FROM {self.table} LIMIT 1"
                ).fetchone()
                return self._to_doc(row)
            rows = conn.execute(
                f"SELECT id, data FROM {self.table}"
            ).fetchall()
        for row in rows:
            doc = self._to_doc(row)
            if self._matches(doc, query):
                return doc
        return None

    def find(self, query: dict = None):
        with get_connection() as conn:
            rows = conn.execute(
                f"SELECT id, data FROM {self.table}"
            ).fetchall()
        docs = [self._to_doc(r) for r in rows]
        if query:
            docs = [d for d in docs if self._matches(d, query)]
        return self._Cursor(docs)

    def insert_one(self, document: dict) -> InsertOneResult:
        doc = document.copy()
        doc_id = self._get_id(doc)
        doc.setdefault("id", doc_id)
        with get_connection() as conn:
            conn.execute(
                f"INSERT OR REPLACE INTO {self.table} (id, data) VALUES (?, ?)",
                (doc_id, _dumps(doc))
            )
            conn.commit()
        return InsertOneResult(doc_id)

    def insert_many(self, documents: list) -> list:
        inserted = []
        with get_connection() as conn:
            for document in documents:
                doc = document.copy()
                doc_id = self._get_id(doc)
                doc.setdefault("id", doc_id)
                conn.execute(
                    f"INSERT OR REPLACE INTO {self.table} (id, data) VALUES (?, ?)",
                    (doc_id, _dumps(doc))
                )
                inserted.append(doc_id)
            conn.commit()
        return inserted

    def update_one(self, query: dict, update: dict,
                   upsert: bool = False) -> UpdateResult:
        doc = self.find_one(query)
        if doc is None:
            if upsert:
                new_doc = update.get("$set", update).copy()
                res = self.insert_one(new_doc)
                return UpdateResult(0, upserted_id=res.inserted_id)
            return UpdateResult(0)

        if "$set" in update:
            doc.update(update["$set"])
        else:
            doc.update(update)

        doc_id = doc.get("_id") or doc.get("id")
        with get_connection() as conn:
            conn.execute(
                f"UPDATE {self.table} SET data = ? WHERE id = ?",
                (_dumps(doc), doc_id)
            )
            conn.commit()
        return UpdateResult(1)

    def delete_one(self, query: dict) -> DeleteResult:
        doc = self.find_one(query)
        if doc is None:
            return DeleteResult(0)
        doc_id = doc.get("_id") or doc.get("id")
        with get_connection() as conn:
            conn.execute(f"DELETE FROM {self.table} WHERE id = ?", (doc_id,))
            conn.commit()
        return DeleteResult(1)

    def delete_many(self, query: dict = None) -> DeleteResult:
        if not query:
            with get_connection() as conn:
                cur = conn.execute(f"DELETE FROM {self.table}")
                conn.commit()
                return DeleteResult(cur.rowcount)
        docs_cur = self.find(query)
        import asyncio
        docs = asyncio.get_event_loop().run_until_complete(docs_cur.to_list(9999)) \
            if False else []
        # sync fallback
        with get_connection() as conn:
            rows = conn.execute(
                f"SELECT id, data FROM {self.table}"
            ).fetchall()
        all_docs = [self._to_doc(r) for r in rows]
        matched = [d for d in all_docs if self._matches(d, query)]
        count = 0
        with get_connection() as conn:
            for doc in matched:
                doc_id = doc.get("_id") or doc.get("id")
                conn.execute(f"DELETE FROM {self.table} WHERE id = ?", (doc_id,))
                count += 1
            conn.commit()
        return DeleteResult(count)

    def count_documents(self, query: dict = None) -> int:
        import asyncio
        with get_connection() as conn:
            rows = conn.execute(
                f"SELECT id, data FROM {self.table}"
            ).fetchall()
        docs = [self._to_doc(r) for r in rows]
        if query:
            docs = [d for d in docs if self._matches(d, query)]
        return len(docs)


# ── Async wrapper ─────────────────────────────────────────────────────────

class AsyncCollection:
    """Makes every SQLiteCollection method awaitable."""
    def __init__(self, col: SQLiteCollection):
        self._col = col

    async def find_one(self, query=None):
        return self._col.find_one(query)

    def find(self, query=None):
        return self._col.find(query)          # returns cursor with .sort().to_list()

    async def insert_one(self, document):
        return self._col.insert_one(document)

    async def insert_many(self, documents):
        return self._col.insert_many(documents)

    async def update_one(self, query, update, upsert=False):
        return self._col.update_one(query, update, upsert=upsert)

    async def delete_one(self, query):
        return self._col.delete_one(query)

    async def delete_many(self, query=None):
        return self._col.delete_many(query)

    async def count_documents(self, query=None):
        return self._col.count_documents(query)


# ── Instantiate collections ───────────────────────────────────────────────

_profile_col      = SQLiteCollection("profile")
_skills_col       = SQLiteCollection("skills")
_education_col    = SQLiteCollection("education")
_certificates_col = SQLiteCollection("certificates")
_projects_col     = SQLiteCollection("projects")
_contact_col      = SQLiteCollection("contact")

profile_collection      = AsyncCollection(_profile_col)
skills_collection       = AsyncCollection(_skills_col)
education_collection    = AsyncCollection(_education_col)
certificates_collection = AsyncCollection(_certificates_col)
projects_collection     = AsyncCollection(_projects_col)
contact_collection      = AsyncCollection(_contact_col)


# ── Init / Close ──────────────────────────────────────────────────────────

async def init_db():
    if not _profile_col.find_one():
        _profile_col.insert_one({
            "id": "default",
            "name": "Your Name",
            "title": "Computer Engineer",
            "tagline": "Building innovative solutions through technology and engineering excellence",
            "bio": (
                "Passionate Computer Engineer with expertise in CAD design, "
                "software development, and hardware systems."
            ),
            "email": "your.email@example.com",
            "phone": "+1 234 567 8900",
            "location": "Your Location",
            "profileImage": (
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                "?w=400&h=400&fit=crop"
            ),
            "resumeUrl": "",
        })
        print("Default profile created")


async def close_db():
    pass