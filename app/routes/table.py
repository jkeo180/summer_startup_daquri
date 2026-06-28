import random
import string
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# In-memory store for demo purposes.
# Replace with Supabase calls in production:
#   from supabase import create_client
#   supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
SESSIONS: dict[str, dict] = {}

# Valid box codes (in production, these live in your Supabase DB,
# pre-generated when boxes are printed)
VALID_BOX_CODES = {"AGOOD1", "AGOOD2", "AGOOD3", "DEMO42"}


class UnlockRequest(BaseModel):
    box_code: str     # Code printed on the physical box
    nickname: str     # Person's name at the table


class JoinRequest(BaseModel):
    table_code: str
    nickname: str


class OrderRequest(BaseModel):
    table_code: str
    nickname: str
    drink_ids: list[str]


def _make_table_code() -> str:
    """Generate a short human-readable table code like DRNK42."""
    letters = "".join(random.choices("ABCDEFGHJKLMNPQRST", k=4))
    numbers = "".join(random.choices(string.digits, k=2))
    return letters + numbers


@router.post("/table/unlock")
def unlock_table(req: UnlockRequest):
    """
    Called when someone scans the QR code on their box.
    Validates the box code and creates (or returns) a shared table session.
    """
    if req.box_code.upper() not in VALID_BOX_CODES:
        raise HTTPException(status_code=403, detail="Invalid box code.")

    # Check if this box already has an active session
    existing = next(
        (s for s in SESSIONS.values() if s.get("box_code") == req.box_code.upper()),
        None,
    )
    if existing:
        existing["members"].add(req.nickname)
        return {
            "table_code": existing["table_code"],
            "members": list(existing["members"]),
            "orders": existing["orders"],
        }

    # Create a new session for this box
    table_code = _make_table_code()
    SESSIONS[table_code] = {
        "table_code": table_code,
        "box_code": req.box_code.upper(),
        "members": {req.nickname},
        "orders": {},       # {nickname: [drink_ids]}
    }
    return {
        "table_code": table_code,
        "members": [req.nickname],
        "orders": {},
    }


@router.post("/table/join")
def join_table(req: JoinRequest):
    """Join an existing table session by code (e.g. friends scanning same QR)."""
    session = SESSIONS.get(req.table_code)
    if not session:
        raise HTTPException(status_code=404, detail="Table not found.")
    session["members"].add(req.nickname)
    return {
        "table_code": req.table_code,
        "members": list(session["members"]),
        "orders": session["orders"],
    }


@router.post("/table/order")
def place_order(req: OrderRequest):
    """Record what someone at the table ordered."""
    session = SESSIONS.get(req.table_code)
    if not session:
        raise HTTPException(status_code=404, detail="Table not found.")
    session["orders"][req.nickname] = req.drink_ids
    return {
        "table_code": req.table_code,
        "orders": session["orders"],
        "all_drinks": list({d for drinks in session["orders"].values() for d in drinks}),
    }


@router.get("/table/{table_code}")
def get_table(table_code: str):
    """Get the current state of a table session."""
    session = SESSIONS.get(table_code)
    if not session:
        raise HTTPException(status_code=404, detail="Table not found.")
    return {
        "table_code": table_code,
        "members": list(session["members"]),
        "orders": session["orders"],
        "all_drinks": list({d for drinks in session["orders"].values() for d in drinks}),
    }
