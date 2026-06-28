from flask import Flask, render_template, jsonify, request
import requests
import os

app = Flask(__name__)

# Your FastAPI backend — same machine, different port
API = "http://127.0.0.1:8000/api"


@app.route("/")
def index():
    return render_template("index.html")


# ── Proxy routes — Flask forwards requests to FastAPI ─────────────────────
# This way the browser only talks to Flask (one origin, no CORS issues)

@app.route("/recipes")
def recipes():
    r = requests.get(f"{API}/recipes")
    return jsonify(r.json())


@app.route("/starters", methods=["POST"])
def starters():
    r = requests.post(f"{API}/starters", json=request.json)
    return jsonify(r.json())


@app.route("/table/unlock", methods=["POST"])
def unlock():
    r = requests.post(f"{API}/table/unlock", json=request.json)
    return jsonify(r.json()), r.status_code


@app.route("/table/order", methods=["POST"])
def order():
    r = requests.post(f"{API}/table/order", json=request.json)
    return jsonify(r.json())


@app.route("/table/<code>")
def get_table(code):
    r = requests.get(f"{API}/table/{code}")
    return jsonify(r.json())


if __name__ == "__main__":
    # Open on 0.0.0.0 so phones on same WiFi can reach it
    app.run(host="0.0.0.0", port=5000, debug=True)