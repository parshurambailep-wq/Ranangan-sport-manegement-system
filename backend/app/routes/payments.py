from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Payment
from app.utils.decorators import role_required

payments_bp = Blueprint("payments", __name__)


@payments_bp.post("/")
def create_payment():
    data = request.get_json() or {}
    payment = Payment(
        user_id=data["user_id"],
        event_id=data.get("event_id"),
        vendor_id=data.get("vendor_id"),
        amount=data["amount"],
        purpose=data["purpose"],
        upi_txn_id=data["upi_txn_id"],
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify({"id": payment.id, "status": payment.status}), 201


@payments_bp.get("/pending")
@role_required(["Admin"])
def pending_payments():
    payments = Payment.query.filter_by(status="pending").all()
    return jsonify(
        [
            {
                "id": p.id,
                "user_id": p.user_id,
                "amount": float(p.amount),
                "purpose": p.purpose,
                "upi_txn_id": p.upi_txn_id,
            }
            for p in payments
        ]
    )


@payments_bp.post("/verify/<int:payment_id>")
@role_required(["Admin"])
def verify_payment(payment_id: int):
    data = request.get_json() or {}
    action = data.get("action", "verify")

    payment = Payment.query.get_or_404(payment_id)
    if action == "reject":
        payment.status = "rejected"
    else:
        payment.status = "verified"
        payment.verified_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({"message": "updated", "status": payment.status}), 200

