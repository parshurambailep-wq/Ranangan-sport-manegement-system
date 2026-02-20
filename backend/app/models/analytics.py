from datetime import datetime
from app.extensions import db


class AnalyticsRecord(db.Model):
    __tablename__ = "analytics"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), nullable=False, index=True)
    value = db.Column(db.Numeric(18, 2), nullable=False)
    metadata = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

