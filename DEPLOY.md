# First Choice Connect - Deployment Guide

## Architecture

```
┌──────────────────────────────────────────────┐
│                Docker Compose                │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │   Node.js App     │  │   PostgreSQL     │  │
│  │   (port 3001)     │  │   (port 5432)    │  │
│  │                   │  │                  │  │
│  │  Express API      │  │  nexus_rpo DB    │  │
│  │  + Static SPA     │  │  All app data    │  │
│  │  + JWT Auth       │  │                  │  │
│  │  + Helmet/CORS    │  │                  │  │
│  └──────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- Ports 3001 and 5432 available (configurable)

### Deploy in three commands
```bash
# 1. Build and start the app + database
./scripts/deploy.sh

# 2. Initialize the database (migrations + seed data)
./scripts/deploy.sh db:setup

# 3. Open in browser
open http://localhost:3001
```

### Default Login Credentials
All seeded users have password: `password123`

| Role | Email | Name |
|------|-------|------|
| Admin | r.obi@nexusrpo.co.uk | Rachel Obi |
| Care Home | k.hughes@sunrise.co.uk | Karen Hughes |
| Client Admin | m.cole@sunrisehealthcare.co.uk | Margaret Cole |
| Agency | laura@firstchoice.co.uk | Laura Bennett |
| Bank Staff | d.foster@internal.co.uk | Diane Foster |

---

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and start app + PostgreSQL
docker compose up -d --build

# Wait for DB, then set up schema and seed data
docker compose exec app node server/migrations/run.js
docker compose exec app node server/seeds/run.js

# Verify
curl http://localhost:3001/api/health
```

### Option 2: Manual (Separate DB)

```bash
# 1. Set up PostgreSQL (local or cloud)
createdb nexus_rpo

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Install dependencies
npm ci

# 4. Build frontend
npm run build

# 5. Set up database
npm run db:migrate
npm run db:seed

# 6. Start production server
npm start
```

### Option 3: Development Mode

```bash
# 1. Start PostgreSQL (via Docker or local install)
docker run -d --name fcc-db -e POSTGRES_DB=nexus_rpo -e POSTGRES_USER=nexus -e POSTGRES_PASSWORD=nexus_dev -p 5432:5432 postgres:16-alpine

# 2. Configure environment
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Set up database
npm run db:migrate
npm run db:seed

# 5. Start both frontend and backend in dev mode
npm run dev:full
```

This starts Vite dev server (port 5173) with API proxy to Express (port 3001).

---

## Deploy Script Commands

```bash
./scripts/deploy.sh              # Build and start everything
./scripts/deploy.sh build        # Build only
./scripts/deploy.sh start        # Start existing build
./scripts/deploy.sh stop         # Stop containers
./scripts/deploy.sh restart      # Restart containers
./scripts/deploy.sh logs         # Tail logs
./scripts/deploy.sh status       # Health & container status
./scripts/deploy.sh db:setup     # Run migrations + seeds
./scripts/deploy.sh clean        # Remove everything (including DB data)
```

---

## Configuration

Copy `.env.example` to `.env` and adjust:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Application port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `nexus_rpo` | Database name |
| `DB_USER` | `nexus` | Database user |
| `DB_PASSWORD` | `nexus_dev` | Database password |
| `JWT_SECRET` | (dev default) | **Change in production!** |
| `JWT_EXPIRY` | `24h` | Access token lifetime |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Get current user |
| `GET/POST/PUT/DELETE` | `/api/shifts` | Shift management |
| `GET/POST/PUT/DELETE` | `/api/agencies` | Agency management |
| `GET/POST/PUT/DELETE` | `/api/workers` | Worker management |
| `GET/POST/PUT` | `/api/timesheets` | Timesheet management |
| `GET/POST/PUT` | `/api/invoices` | Invoice management |
| `GET/POST/PUT` | `/api/clients/groups` | Client group management |
| `GET/POST/PUT` | `/api/clients/locations` | Location management |
| `GET/PUT` | `/api/clients/pricing` | Client pricing |
| `GET/POST/PUT/DELETE` | `/api/compliance` | Compliance requirements |
| `GET/PUT` | `/api/budgets` | Budget management |
| `GET/POST/PUT/DELETE` | `/api/rate-cards` | Rate card management |
| `GET/POST/PUT` | `/api/bank-staff` | Bank staff management |
| `GET/POST/PUT/DELETE` | `/api/bank-rates` | Bank rates |
| `GET/POST/PUT/DELETE` | `/api/users` | User management |
| `GET/PUT` | `/api/notifications` | Notifications |
| `GET/POST` | `/api/documents` | Document vault |
| `GET/POST/PUT` | `/api/credit-notes` | Credit notes |
| `GET/POST/PUT` | `/api/rate-uplifts` | Rate uplift requests |
| `GET` | `/api/health` | Health check |

All endpoints (except auth) require `Authorization: Bearer <token>` header.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push:

1. **Build & Validate** — Installs deps, builds production bundle
2. **Docker Build** — Builds container and tests health check
3. **Deploy** — (on `main` only) Pushes to container registry

---

## Production Checklist

- [ ] Set strong `JWT_SECRET` in environment
- [ ] Set strong `DB_PASSWORD`
- [ ] Run `./scripts/deploy.sh` then `./scripts/deploy.sh db:setup`
- [ ] Verify `curl http://localhost:3001/api/health`
- [ ] Configure reverse proxy / load balancer with SSL
- [ ] Set up database backups
- [ ] Configure monitoring on `/api/health`
- [ ] Change default user passwords
