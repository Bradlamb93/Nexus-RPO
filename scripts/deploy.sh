#!/usr/bin/env bash
set -euo pipefail

# ============================================
# First Choice Connect - Deployment Script
# ============================================
# Usage:
#   ./scripts/deploy.sh              # Build and start (with DB setup)
#   ./scripts/deploy.sh build        # Build only
#   ./scripts/deploy.sh start        # Start existing build
#   ./scripts/deploy.sh stop         # Stop running containers
#   ./scripts/deploy.sh restart      # Restart containers
#   ./scripts/deploy.sh logs         # Tail container logs
#   ./scripts/deploy.sh status       # Check container status
#   ./scripts/deploy.sh db:setup     # Run migrations and seeds
#   ./scripts/deploy.sh clean        # Remove containers and images

APP_NAME="first-choice-connect"
COMPOSE_FILE="docker-compose.yml"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cd "$(dirname "$0")/.."

compose() {
  if command -v docker-compose &> /dev/null; then
    docker-compose -f "$COMPOSE_FILE" "$@"
  else
    docker compose -f "$COMPOSE_FILE" "$@"
  fi
}

check_deps() {
  for cmd in docker; do
    if ! command -v "$cmd" &> /dev/null; then
      log_error "$cmd is not installed"
      exit 1
    fi
  done
}

do_build() {
  log_info "Building ${APP_NAME}..."
  compose build --no-cache
  log_info "Build complete"
}

do_start() {
  log_info "Starting ${APP_NAME} (app + database)..."
  compose up -d
  log_info "Waiting for database to be ready..."
  sleep 5
  log_info "Application started on port ${PORT:-3001}"
  log_info "Health: http://localhost:${PORT:-3001}/api/health"
  log_info "App:    http://localhost:${PORT:-3001}"
}

do_stop() {
  log_info "Stopping ${APP_NAME}..."
  compose down
  log_info "Application stopped"
}

do_logs() {
  compose logs -f
}

do_status() {
  echo ""
  log_info "Container status:"
  compose ps
  echo ""
  log_info "Health check:"
  if curl -sf "http://localhost:${PORT:-3001}/api/health" 2>/dev/null; then
    echo ""
    log_info "Application is healthy"
  else
    log_warn "Application is not responding"
  fi
}

do_db_setup() {
  log_info "Running database migrations..."
  compose exec app node server/migrations/run.js
  log_info "Running database seeds..."
  compose exec app node server/seeds/run.js
  log_info "Database setup complete"
}

do_clean() {
  log_warn "This will remove all containers, images, and database volumes"
  do_stop
  compose down -v
  docker rmi "${APP_NAME}" 2>/dev/null || true
  log_info "Cleanup complete"
}

# ── Main ──
check_deps

case "${1:-}" in
  build)    do_build ;;
  start)    do_start ;;
  stop)     do_stop ;;
  restart)  do_stop; do_start ;;
  logs)     do_logs ;;
  status)   do_status ;;
  db:setup) do_db_setup ;;
  clean)    do_clean ;;
  *)
    do_build
    do_start
    echo ""
    log_info "Run './scripts/deploy.sh db:setup' to initialize the database"
    ;;
esac
