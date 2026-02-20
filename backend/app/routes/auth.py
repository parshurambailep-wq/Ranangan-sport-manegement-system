from datetime import datetime, timedelta
import os

import requests
from flask import Blueprint, jsonify, request, url_for
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models import Role, User
from app.utils.security import generate_jwt_for_user, hash_password, verify_password

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")

    if not all([email, password, full_name]):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    user = User(email=email, full_name=full_name, password_hash=hash_password(password))

    default_role = Role.query.filter_by(name="Student").first()
    if default_role:
        user.roles.append(default_role)

    db.session.add(user)
    db.session.commit()

    token = generate_jwt_for_user(user)
    return jsonify({"access_token": token}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"message": "Missing credentials"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash or not verify_password(password, user.password_hash):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_jwt_for_user(user)
    return jsonify({"access_token": token}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    # Identity is fully contained in JWT; frontend can store needed fields
    return jsonify({"message": "OK"}), 200


@auth_bp.get("/google/login")
def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    scope = "openid email profile"
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
    )
    return jsonify({"auth_url": auth_url})


@auth_bp.get("/google/callback")
def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"message": "Missing code"}), 400

    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    if not token_resp.ok:
        return jsonify({"message": "Failed to exchange token"}), 400

    tokens = token_resp.json()
    id_token = tokens.get("id_token")
    userinfo_resp = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {tokens.get('access_token')}"},
        timeout=10,
    )
    if not userinfo_resp.ok:
        return jsonify({"message": "Failed to fetch user info"}), 400

    profile = userinfo_resp.json()
    email = profile.get("email")
    google_id = profile.get("sub")
    full_name = profile.get("name")

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, google_id=google_id, full_name=full_name)
        default_role = Role.query.filter_by(name="Student").first()
        if default_role:
            user.roles.append(default_role)
        db.session.add(user)
        db.session.commit()

    token = generate_jwt_for_user(user)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return jsonify({"redirect": f"{frontend_url}/auth/callback?token={token}&id_token={id_token}"}), 200

