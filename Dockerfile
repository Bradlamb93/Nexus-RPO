# ============================================
# Stage 1: Build the application
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build arguments for compile-time configuration
ARG VITE_APP_TITLE="First Choice Connect"
ARG VITE_API_URL=""

# Build the production bundle
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:1.27-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy health check page
COPY nginx/health.json /usr/share/nginx/html/health.json

# Create non-root user for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health.json || exit 1

# Run as non-root
USER nginx

CMD ["nginx", "-g", "daemon off;"]
