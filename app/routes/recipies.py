from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from tools.recipes import RECIPES, get_recipe, suggest_pairing

router = APIRouter()


@router.get("/recipes")
def list_all_recipes():
    """Return all recipes for the React app to display."""
    return {"recipes": RECIPES}


@router.get("/recipes/{recipe_id}")
def get_single_recipe(recipe_id: str):
    """Return a single recipe by ID."""
    recipe = RECIPES.get(recipe_id.lower())
    if not recipe:
        raise HTTPException(status_code=404, detail=f"Recipe '{recipe_id}' not found.")
    return recipe


class PairingRequest(BaseModel):
    ordered: list[str]


@router.post("/recipes/pairing")
def get_pairing(req: PairingRequest):
    """Suggest drink pairings based on what was already ordered."""
    result = suggest_pairing({"ordered": req.ordered})
    return {"suggestion": result["content"][0]["text"]}
