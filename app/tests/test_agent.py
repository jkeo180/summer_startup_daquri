"""
Quick smoke tests — run with: python tests/test_agent.py
Make sure the server is running first: uvicorn app.main:app --reload
"""
import os
import json
import requests

BASE = "http://localhost:8000"


def test_health():
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 200
    print("✓ health")


def test_list_recipes():
    r = requests.get(f"{BASE}/api/recipes")
    assert r.status_code == 200
    data = r.json()
    assert "recipes" in data
    print(f"✓ list_recipes — {len(data['recipes'])} recipes")


def test_get_recipe():
    r = requests.get(f"{BASE}/api/recipes/classic")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Classic Daiquiri"
    print(f"✓ get_recipe — {data['name']}")


def test_pairing():
    r = requests.post(f"{BASE}/api/recipes/pairing", json={"ordered": ["classic", "strawberry"]})
    assert r.status_code == 200
    print(f"✓ pairing — {r.json()['suggestion'][:60]}...")


def test_unlock_table():
    r = requests.post(f"{BASE}/api/table/unlock", json={
        "box_code": "DEMO42",
        "nickname": "Julie"
    })
    assert r.status_code == 200
    data = r.json()
    table_code = data["table_code"]
    print(f"✓ unlock_table — code: {table_code}")
    return table_code


def test_join_table(table_code: str):
    r = requests.post(f"{BASE}/api/table/join", json={
        "table_code": table_code,
        "nickname": "Marcus"
    })
    assert r.status_code == 200
    data = r.json()
    assert "Marcus" in data["members"]
    print(f"✓ join_table — members: {data['members']}")


def test_starters(table_code: str):
    # Place an order first
    requests.post(f"{BASE}/api/table/order", json={
        "table_code": table_code,
        "nickname": "Julie",
        "drink_ids": ["classic", "strawberry"]
    })

    r = requests.post(f"{BASE}/api/starters", json={
        "drink_ids": ["classic", "strawberry"],
        "table_code": table_code,
    })
    assert r.status_code == 200
    data = r.json()
    starters = data.get("starters", [])
    print(f"✓ starters — {len(starters)} generated")
    for s in starters:
        print(f"   [{s['category']}] {s['text'][:60]}...")


def test_chat():
    r = requests.post(f"{BASE}/api/chat", json={
        "message": "What's something sweet but not too strong for someone who doesn't usually drink?",
        "history": []
    })
    assert r.status_code == 200
    print(f"✓ chat — {r.json()['reply'][:80]}...")


if __name__ == "__main__":
    print("\nRunning smoke tests against http://localhost:8000\n")
    test_health()
    test_list_recipes()
    test_get_recipe()
    test_pairing()
    table_code = test_unlock_table()
    test_join_table(table_code)
    test_starters(table_code)
    test_chat()
    print("\nAll tests passed.")