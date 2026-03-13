#!/usr/bin/env bash
set -euo pipefail

# ============================================
# First Choice Connect - Deployment Script
# ============================================
# Usage:
#   ./scripts/deploy.sh              # Build and start
#   ./scripts/deploy.sh build        # Build only
#   ./scripts/deploy.sh start        # Start existing build
#   ./scripts/deploy.sh stop         # Stop running containers
#   ./scripts/deploy.sh restart      # Restart containers
#   ./scripts/deploy.sh logs         # Tail container logs
#   ./scripts/deploy.sh status       # Check container status
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

# Change to project root
cd "$(dirname "$0")/.."

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
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" build --no-cache
    else
        docker compose -f "$COMPOSE_FILE" build --no-cache
    fi
    log_info "Build complete"
}

do_start() {
    log_info "Starting ${APP_NAME}..."
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" up -d
    else
        docker compose -f "$COMPOSE_FILE" up -d
    fi
    log_info "Application started on port ${PORT:-8080}"
    log_info "Health check: http://localhost:${PORT:-8080}/health.json"
}

do_stop() {
    log_info "Stopping ${APP_NAME}..."
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" down
    else
        docker compose -f "$COMPOSE_FILE" down
    fi
    log_info "Application stopped"
}

do_logs() {
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        docker compose -f "$COMPOSE_FILE" logs -f
    fi
}

do_status() {
    echo ""
    log_info "Container status:"
    docker ps --filter "name=${APP_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    log_info "Health check:"
    if curl -sf "http://localhost:${PORT:-8080}/health.json" 2>/dev/null; then
        echo ""
        log_info "Application is healthy"
    else
        log_warn "Application is not responding"
    fi
}

do_clean() {
    log_warn "This will remove all containers and images for ${APP_NAME}"
    do_stop
    docker rmi "${APP_NAME}" 2>/dev/null || true
    log_info "Cleanup complete"
}

# ── Main ──
check_deps

case "${1:-}" in
    build)   do_build ;;
    start)   do_start ;;
    stop)    do_stop ;;
    restart) do_stop; do_start ;;
    logs)    do_logs ;;
    status)  do_status ;;
    clean)   do_clean ;;
    *)
        do_build
        do_start
        ;;
esac
