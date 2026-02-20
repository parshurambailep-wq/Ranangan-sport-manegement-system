from flask import Blueprint, jsonify
from sqlalchemy import func

from app.extensions import db
from app.models import Match, Payment, Ticket
from app.utils.decorators import role_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/admin")
@role_required(["Admin"])
def admin_dashboard():
    revenue_per_event = (
        db.session.query(Payment.event_id, func.sum(Payment.amount))
        .filter(Payment.status == "verified")
        .group_by(Payment.event_id)
        .all()
    )
    ticket_sales = (
        db.session.query(Ticket.event_id, func.count(Ticket.id)).group_by(Ticket.event_id).all()
    )

    return jsonify(
        {
            "revenue_per_event": [{"event_id": e, "revenue": float(r)} for e, r in revenue_per_event],
            "ticket_sales": [{"event_id": e, "tickets": t} for e, t in ticket_sales],
        }
    )


@dashboard_bp.get("/coach")
@role_required(["Coach"])
def coach_dashboard():
    matches = Match.query.all()
    return jsonify([{"id": m.id, "name": m.name} for m in matches])


@dashboard_bp.get("/vendor")
@role_required(["Vendor"])
def vendor_dashboard():
    vendor_revenue = (
        db.session.query(func.sum(Payment.amount))
        .filter(Payment.status == "verified", Payment.purpose == "vendor_purchase")
        .scalar()
        or 0
    )
    return jsonify({"vendor_revenue": float(vendor_revenue)})

