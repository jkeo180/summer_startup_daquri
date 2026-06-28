from typing import Any

# ── Recipe database ──────────────────────────────────────────────────────────
# This is the single source of truth. The React app and the agent both pull
# from here via the /api/recipes endpoint, so they always stay in sync.

RECIPES: dict[str, dict] = {
    "classic": {
        "name": "Classic Daiquiri",
        "category": "All-time favorite",
        "description": "Timeless, simple, and refreshing.",
        "flavor_profile": ["citrus", "light", "balanced"],
        "ingredients": ["2 oz white rum", "1 oz fresh lime juice", "¾ oz simple syrup"],
        "steps": [
            "Fill a shaker with ice.",
            "Add rum, lime juice, and simple syrup.",
            "Shake well and strain into a chilled coupe or martini glass.",
            "Garnish with a lime wheel or twist.",
        ],
        "garnish": "Lime wheel or twist",
        "abv": "medium",
    },
    "strawberry": {
        "name": "Strawberry Daiquiri",
        "category": "All-time favorite",
        "description": "A fruity twist perfect for summer.",
        "flavor_profile": ["fruity", "sweet", "tropical"],
        "ingredients": ["2 oz white rum", "1 oz lime juice", "1 oz simple syrup", "4–5 fresh strawberries"],
        "steps": [
            "Add all ingredients to a blender.",
            "Blend until smooth and pour into a hurricane glass.",
            "Garnish with a fresh strawberry or lime wedge.",
        ],
        "garnish": "Fresh strawberry or lime wedge",
        "abv": "medium",
    },
    "pineapple": {
        "name": "Pineapple Daiquiri",
        "category": "New favorite",
        "description": "A tropical escape in a glass.",
        "flavor_profile": ["tropical", "coconut", "sweet"],
        "ingredients": ["2 oz coconut rum", "1 oz pineapple juice", "1 oz lime juice", "1 oz cream of coconut"],
        "steps": [
            "Combine all ingredients in a blender.",
            "Blend until smooth and pour into a tall glass.",
            "Garnish with a pineapple wedge or shredded coconut.",
        ],
        "garnish": "Pineapple wedge or shredded coconut",
        "abv": "medium",
    },
    "honeyed": {
        "name": "Honeyed Rum Daiquiri",
        "category": "New favorite",
        "description": "Sophisticated with a touch of honey.",
        "flavor_profile": ["honey", "aged", "citrus", "smooth"],
        "ingredients": ["2 oz aged rum", "½ oz honey syrup", "¾ oz lime juice"],
        "steps": [
            "Add rum, honey syrup, and lime juice to a mixing glass filled with ice.",
            "Stir gently for about 20 seconds.",
            "Strain into a chilled coupe glass.",
            "Garnish with a lime peel or small honey drizzle on the rim.",
        ],
        "garnish": "Lime peel or honey drizzle",
        "abv": "medium",
    },
    "knee_buckler": {
        "name": "The Knee Buckler",
        "category": "Exclusive",
        "description": "Layered strawberry and piña colada.",
        "flavor_profile": ["bold", "tropical", "fruity", "layered"],
        "ingredients": [
            "Strawberry layer: 2 oz light rum, 1 oz lime juice, 1 oz simple syrup, 3 oz strawberry puree",
            "Piña colada layer: 2 oz coconut rum, 2 oz pineapple juice, 1 oz cream of coconut",
        ],
        "steps": [
            "Blend strawberry layer with ice until smooth. Pour into glass and freeze briefly.",
            "Blend piña colada layer with ice until smooth.",
            "Slowly pour piña colada over the back of a spoon on top of strawberry layer.",
            "Garnish and serve.",
        ],
        "garnish": "Pineapple wedge, strawberry slice, tropical umbrella",
        "abv": "high",
    },
    "watermelon": {
        "name": "I Been Drinkin' Watermelon",
        "category": "Mocktail",
        "description": "Cooling and fruity with coconut water.",
        "flavor_profile": ["watermelon", "refreshing", "light", "tropical"],
        "ingredients": [
            "½ cup fresh watermelon juice",
            "¼ cup lime juice",
            "½ cup coconut water",
            "1 scoop coconut or lime ice cream",
        ],
        "steps": [
            "Fill a glass with ice cubes.",
            "Pour in watermelon juice, lime juice, and coconut water.",
            "Add a scoop of ice cream and stir gently.",
            "Garnish with fresh mint leaves.",
        ],
        "garnish": "Fresh mint leaves",
        "abv": "none",
    },
}


# ── Tool functions ─────────────────────────────────────────────────────────
# These are called by the Claude agent. Each returns the dict format
# Claude expects: {"content": [{"type": "text", "text": "..."}]}

def get_recipe(args: dict[str, Any]) -> dict[str, Any]:
    """Look up a single recipe by ID."""
    recipe_id = args.get("recipe_id", "").lower().strip()
    recipe = RECIPES.get(recipe_id)

    if not recipe:
        available = ", ".join(RECIPES.keys())
        return {
            "content": [{
                "type": "text",
                "text": f"Recipe '{recipe_id}' not found. Available: {available}",
            }]
        }

    text = (
        f"**{recipe['name']}** ({recipe['category']})\n"
        f"{recipe['description']}\n\n"
        f"Flavor profile: {', '.join(recipe['flavor_profile'])}\n\n"
        f"Ingredients:\n" + "\n".join(f"- {i}" for i in recipe["ingredients"]) + "\n\n"
        f"Steps:\n" + "\n".join(f"{n+1}. {s}" for n, s in enumerate(recipe["steps"])) + "\n\n"
        f"Garnish: {recipe['garnish']}\n"
        f"ABV: {recipe['abv']}"
    )
    return {"content": [{"type": "text", "text": text}]}


def list_recipes(args: dict[str, Any]) -> dict[str, Any]:
    """List all recipes, optionally filtered by flavor profile or category."""
    flavor_filter = args.get("flavor", "").lower()
    category_filter = args.get("category", "").lower()

    results = []
    for rid, r in RECIPES.items():
        if flavor_filter and flavor_filter not in r["flavor_profile"]:
            continue
        if category_filter and category_filter not in r["category"].lower():
            continue
        results.append(f"- {rid}: {r['name']} ({r['category']}) — {r['description']}")

    if not results:
        return {"content": [{"type": "text", "text": "No recipes matched your filters."}]}

    return {"content": [{"type": "text", "text": "\n".join(results)}]}


def suggest_pairing(args: dict[str, Any]) -> dict[str, Any]:
    """Suggest a complementary drink pairing based on what was ordered."""
    ordered_ids = args.get("ordered", [])
    ordered = [RECIPES[rid] for rid in ordered_ids if rid in RECIPES]

    if not ordered:
        return {"content": [{"type": "text", "text": "No valid recipes provided for pairing."}]}

    # Collect flavor profiles already represented
    existing_flavors = {f for r in ordered for f in r["flavor_profile"]}

    # Find drinks that add something new
    suggestions = []
    for rid, r in RECIPES.items():
        if rid in ordered_ids:
            continue
        new_flavors = set(r["flavor_profile"]) - existing_flavors
        if new_flavors:
            suggestions.append(
                f"- {r['name']}: adds {', '.join(new_flavors)}"
            )

    if not suggestions:
        return {"content": [{"type": "text", "text": "Great selection — you've covered all the flavor bases!"}]}

    text = "Based on what you've ordered, these would complement the spread nicely:\n" + "\n".join(suggestions[:3])
    return {"content": [{"type": "text", "text": text}]}
