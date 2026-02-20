from app import create_app
from app.extensions import db


def setup_app():
  app = create_app("development")
  app.config["TESTING"] = True
  app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"
  with app.app_context():
    db.create_all()
  return app


def test_register_and_login():
  app = setup_app()
  client = app.test_client()

  res = client.post("/api/auth/register", json={
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  })
  assert res.status_code == 201

  res = client.post("/api/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
  })
  assert res.status_code == 200
  data = res.get_json()
  assert "access_token" in data

