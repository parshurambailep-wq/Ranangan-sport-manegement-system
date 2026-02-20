from datetime import datetime

from app.extensions import db

user_roles = db.Table(
    "user_roles",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey("roles.id"), primary_key=True),
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    google_id = db.Column(db.String(255), unique=True, nullable=True, index=True)
    full_name = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    roles = db.relationship("Role", secondary=user_roles, backref="users", lazy="joined")

    player_profile = db.relationship("Player", back_populates="user", uselist=False)
    coach_profile = db.relationship("Coach", back_populates="user", uselist=False)
    student_profile = db.relationship("Student", back_populates="user", uselist=False)
    vendor_profile = db.relationship("Vendor", back_populates="user", uselist=False)

    def has_role(self, role_name: str) -> bool:
        return any(r.name == role_name for r in self.roles)

    def __repr__(self) -> str:  # pragma: no cover - repr
        return f"<User {self.email}>"

