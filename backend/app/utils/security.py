import bcrypt
from flask_jwt_extended import create_access_token

from app.models import User


def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))


def generate_jwt_for_user(user: User) -> str:
    roles = [r.name for r in user.roles]
    return create_access_token(
        identity={"id": user.id, "email": user.email, "roles": roles},
        additional_claims={"roles": roles},
    )

