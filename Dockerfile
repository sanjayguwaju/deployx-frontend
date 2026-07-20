# Build stage
FROM node:20-alpine AS builder

# Install pnpm v9 (compatible with Node 20)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy package files
# Deliberately exclude pnpm-workspace.yaml to avoid "packages field missing" error
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev included, needed for vite build)
# VITE_API_URL must be passed as a build arg so Vite can bake it into the bundle
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Accept the API URL as a build argument (passed by Coolify at build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite/React app — outputs to /app/dist
RUN pnpm run build

# Production stage — serve with nginx
FROM nginx:stable-alpine

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add a custom nginx config for SPA routing
# All routes fall back to index.html so React Router works correctly
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
