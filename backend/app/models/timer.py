from datetime import datetime
from app.extensions import db


class Timer(db.Model):
    __tablename__ = "timers"

    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey("matches.id"), nullable=True, index=True)
    type = db.Column(db.String(50), nullable=False)  # kabaddi_raid, cricket_over, match_countdown
    duration_seconds = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.DateTime, nullable=True)
    is_running = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

