from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Match, Player
from app.services.cricket_service import get_match_summary, record_ball
from app.utils.decorators import role_required

cricket_bp = Blueprint("cricket", __name__)


@cricket_bp.post("/ball")
@role_required(["Coach"])
def add_ball():
    data = request.get_json() or {}
    match_id = data.get("match_id")
    over_number = data.get("over_number")
    ball_number = data.get("ball_number")
    runs = data.get("runs", 0)
    is_wicket = data.get("is_wicket", False)
    extras_type = data.get("extras_type")
    batsman_id = data.get("batsman_id")
    bowler_id = data.get("bowler_id")

    if not all([match_id, over_number, ball_number]):
        return jsonify({"message": "Missing required fields"}), 400

    match = Match.query.get_or_404(match_id)

    score = record_ball(
        match_id=match.id,
        over_number=over_number,
        ball_number=ball_number,
        runs=runs,
        is_wicket=is_wicket,
        extras_type=extras_type,
        batsman_id=batsman_id,
        bowler_id=bowler_id,
    )

    return jsonify({"id": score.id}), 201


@cricket_bp.get("/summary/<int:match_id>")
def summary(match_id: int):
    return jsonify(get_match_summary(match_id))

