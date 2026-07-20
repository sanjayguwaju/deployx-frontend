# PalikaOS Deployment Guide: VPS + Caddy + PM2 + Cloudflare

This guide outlines the steps to deploy the PalikaOS (Frontend and Backend) on a Linux Virtual Private Server (VPS) using **Caddy** as the reverse proxy, **PM2** as the process manager for the Node.js backend, and **Cloudflare** for DNS and security.

## Architecture Overview
- **DNS & Security:** Cloudflare (Proxy Mode)
- **Reverse Proxy:** Caddy (Handles SSL and routes traffic to frontend/backend)
- **Backend:** Node.js API managed by PM2
- **Frontend:** React (Vite) built statically and served by Caddy
- **Database:** MongoDB (Can be managed like MongoDB Atlas, or run locally)
- **Caching/Queues:** Redis (Run locally or managed)

---

## 1. Cloudflare Setup (DNS)

1. Add your domain (e.g., `palikaos.com`) to Cloudflare.
2. Go to **DNS > Records**.
3. Create the following `A` records pointing to your VPS IP Address:
   - `A` record for `@` (palikaos.com)
   - `A` record for `api` (api.palikaos.com) - *For Backend*
   - `A` record for `*` (Wildcard for multi-tenant subdomains, e.g., `demo.palikaos.com`)
4. Ensure the **Proxy status** (orange cloud) is turned **ON**.
5. Go to **SSL/TLS > Overview** and set the encryption mode to **Full (strict)**.

> [!WARNING]
> Cloudflare proxying for wildcard subdomains (`*`) is only available on Enterprise plans. If you are on the Free/Pro plan, you will need to add an `A` record for each tenant manually (e.g., `demo`, `kathmandu`), or use Cloudflare without proxying for the wildcard.

---

## 2. Server Preparation

SSH into your VPS (Ubuntu 22.04/24.04 recommended) and update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js, PM2, and Redis
```bash
# Install Node.js (v18 or v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs redis-server

# Install PM2 globally
sudo npm install -g pm2
```

### Install Caddy
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

---

## 3. Backend Deployment (PM2)

### Clone and Build
```bash
mkdir -p /var/www/palikaos && cd /var/www/palikaos
git clone https://github.com/your-org/palata-mms-backend.git backend
cd backend

# Install dependencies and build
npm ci
npm run build
```

### Environment Variables
Create a `.env` file in `/var/www/palikaos/backend`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key
FRONTEND_URL=https://palikaos.com
# Add other required variables
```

### Start with PM2
```bash
# Start the API
pm2 start dist/server.js --name "palikaos-api"

# Save PM2 state to restart on server reboot
pm2 save
pm2 startup
```

---

## 4. Frontend Deployment (Static Build)

### Clone and Build
```bash
cd /var/www/palikaos
git clone https://github.com/your-org/palata-mms-frontend.git frontend
cd frontend

# Install dependencies
npm ci
```

### Environment Variables
Create a `.env.production` file in `/var/www/palikaos/frontend`:
```env
VITE_API_URL=https://api.palikaos.com/api/v1
```

### Build the App
```bash
npm run build
# The compiled static files are now in the `dist/` folder.
```

---

## 5. Caddy Configuration

Caddy makes it incredibly simple to serve static files and reverse-proxy APIs while automatically handling SSL certificates. However, since Cloudflare is fronting the traffic in "Full (strict)" mode, Caddy needs to generate Cloudflare Origin Certificates, or we can use Cloudflare's standard SSL.

Open the Caddyfile:
```bash
sudo nano /etc/caddy/Caddyfile
```

Add the following configuration:

```caddyfile
# Backend API Reverse Proxy
api.palikaos.com {
    reverse_proxy localhost:5000
}

# Frontend Static File Server (Supports wildcard subdomains)
*.palikaos.com, palikaos.com {
    root * /var/www/palikaos/frontend/dist
    file_server
    
    # React Router fallback
    try_files {path} /index.html
}
```

Restart Caddy to apply changes:
```bash
sudo systemctl restart caddy
```

> [!TIP]
> **Zero-Downtime Updates (Backend)**
> When you pull new code for the backend, run:
> `npm ci && npm run build && pm2 reload palikaos-api`
> PM2's `reload` achieves a 0-second-downtime reload.

> [!TIP]
> **Updates (Frontend)**
> When you pull new code for the frontend, simply run:
> `npm ci && npm run build`
> Caddy will instantly serve the new files.
