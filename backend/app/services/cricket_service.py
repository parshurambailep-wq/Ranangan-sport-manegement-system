from sqlalchemy import func

from app.extensions import db
from app.models import CricketScore, Match, Player


def record_ball(
    match_id: int,
    over_number: int,
    ball_number: int,
    runs: int,
    is_wicket: bool,
    extras_type: str | None,
    batsman_id: int | None,
    bowler_id: int | None,
) -> CricketScore:
    score = CricketScore(
        match_id=match_id,
        over_number=over_number,
        ball_number=ball_number,
        runs=runs,
        is_wicket=is_wicket,
        extras_type=extras_type,
        batsman_id=batsman_id,
        bowler_id=bowler_id,
    )
    db.session.add(score)
    db.session.commit()
    return score


def get_match_summary(match_id: int) -> dict:
    qs = CricketScore.query.filter_by(match_id=match_id)

    total_runs = db.session.query(func.coalesce(func.sum(CricketScore.runs), 0)).filter_by(match_id=match_id).scalar()
    total_wickets = qs.filter_by(is_wicket=True).count()

    balls = qs.order_by(CricketScore.over_number, CricketScore.ball_number).all()
    overs = {}
    for b in balls:
        key = b.over_number
        overs.setdefault(key, []).append(
            {
                "ball": b.ball_number,
                "runs": b.runs,
                "is_wicket": b.is_wicket,
                "extras_type": b.extras_type,
            }
        )

    return {
        "match_id": match_id,
        "total_runs": int(total_runs),
        "total_wickets": total_wickets,
        "overs": overs,
    }

