# A Good Time Daiquiri — Party in a Box App

> Built at [Hackathon Name] · June 2026

## What it is

A companion app for **A Good Time Daiquiri Lounge** — an OKC-based brand that ships couples' experience boxes. Each box contains daiquiri recipes, conversation prompts, and games designed to help couples connect.

The app unlocks the full experience digitally.

---

## The problem it solves

The physical box is great, but the experience is limited to the cards inside it. There's no way to:
- Share the experience with friends who scan a QR code at the table
- Get AI-generated conversation starters based on the specific drinks you ordered
- Access the full recipe library on your phone

---

## What we built

A mobile-first web app powered by a Python AI agent backend.

**Three tabs:**
- **Recipes** — full drink menu with ingredients, steps, and garnish. Search and filter by category
- **Connect** — sliding conversation starter cards, fun challenges, and a conflict navigation framework for couples
- **My Table** — scan the QR code on your box to unlock a shared table session. Pick your drinks and the AI generates personalized conversation starters based on exactly what you ordered

---

## How it works

```
Flask frontend (port 5000)
    ↓ serves HTML/CSS/JS
    ↓ proxies API calls to →

FastAPI backend (port 8000)
    ↓ handles routes
    ↓ runs Claude AI agent →

Claude Sonnet (Anthropic API)
    ↓ uses tools to look up recipes
    ↓ generates conversation starters
```

The AI agent doesn't just call Claude with drink names — it uses tool use to look up the actual recipe data (flavor profiles, ingredients) and generates starters based on the real flavor context. A strawberry daiquiri gets different starters than a honeyed rum daiquiri.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Flask + vanilla HTML/CSS/JS |
| Backend | Python FastAPI |
| AI Agent | Anthropic Claude Sonnet (tool use) |
| Data | Recipe data in `tools/recipes.py` |
| Sessions | In-memory (Supabase next) |

---

## Running locally

```bash
# 1. Start the backend
cd app
pip install -r requirements.txt
set ANTHROPIC_API_KEY=your-key-here   # Windows
uvicorn main:app --reload

# 2. Start the frontend (new terminal)
pip install flask requests
python flask_app.py

# 3. Open in browser
http://localhost:5000

# 4. Test the table unlock flow
# Use box code: DEMO42
```

---

## What's next

- **Supabase** — replace in-memory sessions with a real database so table sessions persist across devices
- **QR code generation** — auto-generate unique codes per box at print time
- **Deploy** — Railway for the backend, custom domain for the frontend
- **Native app** — Expo React Native build for App Store / Google Play
- **More recipes** — full menu from the booklet including mocktails and exclusives

---

## The team

Built by Julie Keosourinha & LaBrika Chaffer

**A Good Time Daiquiri Lounge** · agoodtimedaiquiri.com