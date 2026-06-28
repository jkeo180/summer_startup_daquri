import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import starters, recipies as recipes, table

app = FastAPI(title="A Good Time Daiquiri API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this down to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(starters.router, prefix="/api")
app.include_router(recipes.router,  prefix="/api")
app.include_router(table.router,    prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
