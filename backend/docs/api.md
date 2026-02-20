# Sports Management System – API Documentation

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/google/login`
- `GET /api/auth/google/callback`

## Users & Roles

- `GET /api/users/`
- `POST /api/users/roles`
- `GET /api/users/pending-approvals`
- `POST /api/users/approve`

## Games & Matches

- `GET /api/games/`

## Cricket

- `POST /api/cricket/ball`
- `GET /api/cricket/summary/{match_id}`

## Timers

- `POST /api/timers/`
- `POST /api/timers/stop/{timer_id}`
- `GET /api/timers/status/{timer_id}`

## Payments

- `POST /api/payments/`
- `GET /api/payments/pending`
- `POST /api/payments/verify/{payment_id}`

## Dashboards

- `GET /api/dashboard/admin`
- `GET /api/dashboard/coach`
- `GET /api/dashboard/vendor`

## Notifications

- `GET /api/notifications/`

