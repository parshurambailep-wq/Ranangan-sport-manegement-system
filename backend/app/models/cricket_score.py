from datetime import datetime
from app.extensions import db


class CricketScore(db.Model):
    __tablename__ = "cricket_scores"

    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey("matches.id"), nullable=False, index=True)
    over_number = db.Column(db.Integer, nullable=False)
    ball_number = db.Column(db.Integer, nullable=False)

    runs = db.Column(db.Integer, default=0, nullable=False)
    is_wicket = db.Column(db.Boolean, default=False, nullable=False)
    extras_type = db.Column(db.String(20), nullable=True)  # wide, no-ball, bye, leg-bye
    batsman_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=True)
    bowler_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    match = db.relationship("Match", back_populates="cricket_scores")

    __table_args__ = (
        db.UniqueConstraint("match_id", "over_number", "ball_number", name="uq_cricket_ball"),
        db.Index("ix_cricket_match_over_ball", "match_id", "over_number", "ball_number"),
    )

