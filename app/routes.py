from flask import Blueprint, render_template, jsonify, request
main = Blueprint("main", __name__)

@main.route("/")
def home():
    return render_template("index.html")

from flask import jsonify

@main.route("/recipes")
def recipes():
    return jsonify({
        "recipes": {
            "mojito": {
                "name": "Classic Mojito",
                "description": "Minty, fresh, dangerously easy to drink",
                "category": "Cocktail",
                "ingredients": ["Rum", "Mint", "Lime", "Sugar", "Soda"],
                "steps": [
                    "Muddle mint and lime",
                    "Add sugar and rum",
                    "Top with soda",
                    "Stir gently"
                ],
                "garnish": "Mint sprig"
            },
            "sunset": {
                "name": "Sunset Spritz",
                "description": "Light, fruity, sunset in a glass",
                "category": "Mocktail",
                "ingredients": ["Orange juice", "Grenadine", "Sparkling water"],
                "steps": [
                    "Add juice",
                    "Slow pour grenadine",
                    "Top with bubbles"
                ],
                "garnish": "Orange slice"
            }
        }
    })

@main.route("/table/unlock", methods=["POST"])
def unlock():
    data = request.json

    return jsonify({
        "table_code": data.get("box_code"),
        "members": [data.get("nickname")]
    })
@main.route("/table/order", methods=["POST"])
def order():
    return jsonify({"ok": True})
@main.route("/starters", methods=["POST"])
def starters():
    return jsonify({
        "starters": [
            {"category": "Connection", "text": "What made you smile today that you didn’t expect?"},
            {"category": "Fun", "text": "If our relationship had a theme song, what would it be?"},
            {"category": "Growth", "text": "What’s something you want us to get better at together?"}
        ]
    })