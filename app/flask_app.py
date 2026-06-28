from flask import Flask, render_template, jsonify, request
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from tools.recipes import RECIPES

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/recipes")
def recipes():
    return jsonify({"recipes": RECIPES})

@app.route("/connect")
def connect():
    return render_template("connect.html")

@app.route("/starters", methods=["POST"])
def starters():
    return jsonify({"starters": [{"category": "Tip", "text": "Start uvicorn to get AI starters!"}]})

@app.route("/table/unlock", methods=["POST"])
def unlock():
    data = request.json
    return jsonify({"table_code": "DEMO42", "members": [data.get("nickname","Guest")], "orders": {}})

@app.route("/table/order", methods=["POST"])
def order():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
