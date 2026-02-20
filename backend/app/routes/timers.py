from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Timer
from app.utils.decorators import role_required

timers_bp = Blueprint("timers", __name__)


@timers_bp.post("/")
@role_required(["Coach", "Admin"])
def create_timer():
    data = request.get_json() or {}
    timer = Timer(
        match_id=data.get("match_id"),
        type=data.get("type"),
        duration_seconds=data.get("duration_seconds", 0),
        start_time=datetime.now(timezone.utc),
        is_running=True,
    )
    db.session.add(timer)
    db.session.commit()
    return jsonify({"id": timer.id}), 201


@timers_bp.post("/stop/<int:timer_id>")
@role_required(["Coach", "Admin"])
def stop_timer(timer_id: int):
    timer = Timer.query.get_or_404(timer_id)
    timer.is_running = False
    db.session.commit()
    return jsonify({"message": "stopped"}), 200


@timers_bp.get("/status/<int:timer_id>")
def timer_status(timer_id: int):
    timer = Timer.query.get_or_404(timer_id)
    if not timer.start_time:
        remaining = timer.duration_seconds
    else:
        now = datetime.now(timezone.utc)
        elapsed = int((now - timer.start_time).total_seconds())
        remaining = max(0, timer.duration_seconds - elapsed)
    return jsonify(
        {
            "id": timer.id,
            "type": timer.type,
            "duration_seconds": timer.duration_seconds,
            "is_running": timer.is_running,
            "remaining_seconds": remaining,
        }
    )

