# PalikaOS Deployment Guide: VPS + Coolify + Cloudflare

[Coolify](https://coolify.io/) is an open-source, self-hostable Heroku/Vercel alternative. It allows you to deploy full-stack apps from GitHub repositories with automatic CI/CD, SSL, and Docker management—all visually from a dashboard.

This guide outlines deploying PalikaOS using Coolify.

## Architecture Overview
- **DNS & Security:** Cloudflare (DNS Only or Proxy mode)
- **Deployment Platform:** Coolify (Runs on your VPS)
- **Database:** MongoDB (Managed by Coolify, or external)
- **Caching/Queues:** Redis (Managed by Coolify)
- **Reverse Proxy:** Traefik or Caddy (Built into Coolify automatically)

---

## 1. Cloudflare Setup (DNS)

1. Add your domain (e.g., `palikaos.com`) to Cloudflare.
2. Create the following `A` records pointing to your VPS IP Address:
   - `A` record for `coolify` (coolify.palikaos.com) - *For the Dashboard*
   - `A` record for `@` (palikaos.com)
   - `A` record for `api` (api.palikaos.com) - *For Backend*
   - `A` record for `*` (Wildcard for multi-tenant subdomains, e.g., `demo.palikaos.com`)
3. **Important:** For Coolify's built-in Let's Encrypt SSL generation to work automatically, set Cloudflare's proxy status (orange cloud) to **DNS Only (grey cloud)** initially. 
4. *Optional:* Once Coolify provisions the SSL, you can turn the proxy status back to **Proxied (orange cloud)** and set SSL/TLS to **Full (strict)**.

---

## 2. Install Coolify on your VPS

SSH into a fresh Ubuntu 22.04/24.04 VPS (minimum 2GB RAM, 4GB recommended):

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Once installed, navigate to `http://<YOUR_VPS_IP>:8000` in your browser. Follow the onboarding steps to secure the dashboard and bind it to your domain (e.g., `https://coolify.palikaos.com`).

---

## 3. Provision Databases

Inside the Coolify Dashboard:
1. Click **+ New Resource** -> **Databases**.
2. Select **MongoDB** and provision it. Note the internal connection URI.
3. Select **Redis** and provision it. Note the internal connection URI.

---

## 4. Deploy the Backend (Node.js/Express)

1. Click **+ New Resource** -> **Public Repository** (or Private via GitHub App integration).
2. Enter the backend repository URL (e.g., `https://github.com/your-org/palata-mms-backend`).
3. Set the build pack to **Nixpacks** (Coolify will automatically detect Node.js and TypeScript).
4. **Configuration:**
   - **Domains:** `https://api.palikaos.com`
   - **Install Command:** `npm ci`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
5. **Environment Variables:**
   - Add your variables (e.g., `PORT=3000`). Coolify manages the internal routing, so your app should listen on port `3000` inside the container.
   - Set `MONGODB_URI` and `REDIS_URL` using the internal URIs from step 3.
6. Click **Deploy**. Coolify will pull the code, build a Docker image, spin it up, and attach an SSL certificate.

---

## 5. Deploy the Frontend (React/Vite)

1. Click **+ New Resource** -> **Public Repository**.
2. Enter the frontend repository URL (e.g., `https://github.com/your-org/palata-mms-frontend`).
3. Set the build pack to **Static (Nixpacks)**. Nixpacks knows how to build Vite apps and serve them using a lightweight static server.
4. **Configuration:**
   - **Domains:** `https://palikaos.com, https://www.palikaos.com`
   - **Install Command:** `npm ci`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. **Environment Variables:**
   - Set `VITE_API_URL=https://api.palikaos.com/api/v1`
6. Click **Deploy**. Coolify will build the static assets and serve them globally.

### Handling Wildcard Subdomains in Coolify
To allow multi-tenancy (e.g., `demo.palikaos.com`), you must configure the domain routing for the frontend resource.
In the frontend's **Domains** setting, add the wildcard:
`https://palikaos.com, https://*.palikaos.com`

*Note: Coolify handles wildcard SSL automatically if you use Cloudflare DNS integration within Coolify's settings (requires a Cloudflare API token).*

---

## 6. Continuous Deployment (CI/CD)

Coolify automatically exposes Webhook URLs for every resource.
If you connected via the GitHub App (recommended), every time you push to the `main` branch, Coolify will automatically detect the push, rebuild the container without downtime, and swap it into production. 

You do not need to configure GitHub Actions manually for deployment!
