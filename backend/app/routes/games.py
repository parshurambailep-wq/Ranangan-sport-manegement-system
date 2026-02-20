from flask import Blueprint, jsonify

from app.models import Game

games_bp = Blueprint("games", __name__)


@games_bp.get("/")
def list_games():
    games = Game.query.all()
    return jsonify([{"id": g.id, "name": g.name} for g in games])

