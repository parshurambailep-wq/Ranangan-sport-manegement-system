from flask import Flask
from .config import get_config
from .extensions import db, migrate, jwt, cors
from .routes.auth import auth_bp
from .routes.users import users_bp
from .routes.games import games_bp
from .routes.cricket import cricket_bp
from .routes.payments import payments_bp
from .routes.dashboard import dashboard_bp
from .routes.timers import timers_bp
from .routes.notifications import notifications_bp


def create_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)

    app.config.from_object(get_config(config_name))

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(games_bp, url_prefix="/api/games")
    app.register_blueprint(cricket_bp, url_prefix="/api/cricket")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(timers_bp, url_prefix="/api/timers")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

    @app.get("/api/health")
    def health() -> dict:
        return {"status": "ok"}

    return app

