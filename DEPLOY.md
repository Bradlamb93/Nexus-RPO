# First Choice Connect - Deployment Guide

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- Port 8080 available (configurable)

### Deploy in one command
```bash
./scripts/deploy.sh
```

This builds the Docker image and starts the container. The app will be available at **http://localhost:8080**.

---

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and start
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Option 2: Docker (Manual)

```bash
# Build the image
docker build -t first-choice-connect .

# Run the container
docker run -d \
  --name first-choice-connect \
  -p 8080:8080 \
  --restart unless-stopped \
  first-choice-connect

# Verify
curl http://localhost:8080/health.json
```

### Option 3: Static Hosting (Netlify, Vercel, S3, etc.)

```bash
# Install dependencies
npm ci

# Build production bundle
npm run build

# The 'dist/' folder contains the deployable static files
# Upload to any static hosting service
```

---

## Deploy Script Commands

```bash
./scripts/deploy.sh              # Build and start
./scripts/deploy.sh build        # Build only
./scripts/deploy.sh start        # Start existing build
./scripts/deploy.sh stop         # Stop containers
./scripts/deploy.sh restart      # Restart containers
./scripts/deploy.sh logs         # Tail logs
./scripts/deploy.sh status       # Health & container status
./scripts/deploy.sh clean        # Remove containers & images
```

---

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Host port mapping |
| `VITE_APP_TITLE` | `First Choice Connect` | Application title |
| `VITE_API_URL` | _(empty)_ | Backend API URL |
| `VITE_ENABLE_MOCK_DATA` | `true` | Use mock data |

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main` or `develop`:

1. **Build & Validate** - Installs deps, builds production bundle
2. **Docker Build** - Builds container and tests health check
3. **Deploy** - (on `main` only) Pushes to container registry

To enable auto-deploy, configure these repository secrets:
- `REGISTRY_URL` - Container registry URL
- `REGISTRY_USERNAME` - Registry credentials
- `REGISTRY_PASSWORD` - Registry credentials

---

## Architecture

```
┌──────────────────────────────────────────┐
│              Docker Container            │
│  ┌────────────────────────────────────┐  │
│  │         Nginx (port 8080)          │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │   Static SPA Assets (dist/)  │  │  │
│  │  │  - index.html (no-cache)     │  │  │
│  │  │  - JS/CSS (1yr cache)        │  │  │
│  │  │  - health.json               │  │  │
│  │  └──────────────────────────────┘  │  │
│  │  Features:                         │  │
│  │  - Gzip compression               │  │
│  │  - Security headers               │  │
│  │  - SPA route fallback             │  │
│  │  - Asset caching                  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Health Check

```bash
curl http://localhost:8080/health.json
# {"status":"healthy","service":"first-choice-connect","version":"1.0.0"}
```

---

## Production Checklist

- [ ] Copy `.env.example` to `.env` and configure
- [ ] Run `./scripts/deploy.sh`
- [ ] Verify health check responds
- [ ] Configure reverse proxy / load balancer (if applicable)
- [ ] Set up SSL/TLS termination
- [ ] Configure container registry secrets for CI/CD
- [ ] Set up monitoring/alerting on health endpoint
