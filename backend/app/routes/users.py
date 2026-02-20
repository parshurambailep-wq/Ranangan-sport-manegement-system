from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Coach, Player, Role, User, Vendor
from app.utils.decorators import role_required

users_bp = Blueprint("users", __name__)


@users_bp.get("/")
@role_required(["Admin"])
def list_users():
    users = User.query.all()
    data = [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "roles": [r.name for r in u.roles],
        }
        for u in users
    ]
    return jsonify(data)


@users_bp.post("/roles")
@role_required(["Admin"])
def assign_role():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    role_name = data.get("role")

    user = User.query.get_or_404(user_id)
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        role = Role(name=role_name)
        db.session.add(role)

    if role not in user.roles:
        user.roles.append(role)
        db.session.commit()

    return jsonify({"message": "Role assigned"}), 200


@users_bp.get("/pending-approvals")
@role_required(["Admin"])
def pending_approvals():
    players = Player.query.filter_by(is_approved=False).all()
    coaches = Coach.query.filter_by(is_approved=False).all()
    vendors = Vendor.query.filter_by(is_approved=False).all()

    return jsonify(
        {
            "players": [{"id": p.id, "user_id": p.user_id, "sport": p.sport} for p in players],
            "coaches": [{"id": c.id, "user_id": c.user_id, "sport": c.sport} for c in coaches],
            "vendors": [{"id": v.id, "user_id": v.user_id, "business_name": v.business_name} for v in vendors],
        }
    )


@users_bp.post("/approve")
@role_required(["Admin"])
def approve_entity():
    data = request.get_json() or {}
    entity_type = data.get("type")
    entity_id = data.get("id")

    model_map = {"player": Player, "coach": Coach, "vendor": Vendor}
    model = model_map.get(entity_type)
    if not model:
        return jsonify({"message": "Invalid type"}), 400

    entity = model.query.get_or_404(entity_id)
    entity.is_approved = True
    db.session.commit()
    return jsonify({"message": "Approved"}), 200

