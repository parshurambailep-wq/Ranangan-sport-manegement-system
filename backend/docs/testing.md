# Testing Guide

## Backend (Pytest)

1. Install dev dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Run all tests:

```bash
pytest
```

3. Add new tests under `backend/tests/` following `test_*.py` naming.

## Frontend (Jest + React Testing Library)

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run test suite:

```bash
npm test
```

3. Add new tests under `frontend/src/__tests__/` using `*.test.jsx` naming.

