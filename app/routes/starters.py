import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agent import run_agent, generate_starters

router = APIRouter()


class StarterRequest(BaseModel):
    drink_ids: list[str]   # e.g. ["classic", "strawberry"]
    table_code: str        # e.g. "DRNK42"


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []   # [{role: "user"|"assistant", content: "..."}]


@router.post("/starters")
def get_starters(req: StarterRequest):
    """
    Generate AI conversation starters based on what the table ordered.
    The agent looks up the actual recipes first, then crafts starters
    based on those specific flavors.
    """
    try:
        raw = generate_starters(req.drink_ids, req.table_code)
        # Strip markdown fences if Claude wrapped it
        clean = raw.replace("```json", "").replace("```", "").strip()
        starters = json.loads(clean)
        return starters
    except json.JSONDecodeError:
        # Claude returned prose instead of JSON — wrap it
        return {"starters": [{"category": "From your bartender", "text": raw}]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
def chat(req: ChatRequest):
    """
    Multi-turn chat with the AI bartender.
    Pass the full conversation history each time so the agent
    remembers context across turns.
    """
    try:
        reply = run_agent(req.message, req.history)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
