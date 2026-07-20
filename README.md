# PalikaOS Frontend (Web Portal) 🇳🇵

PalikaOS is a next-generation, Multi-Tenant SaaS platform designed specifically for Local Governments (Municipalities/Rural Municipalities) in Nepal. It digitizes all core administrative, financial, and citizen-facing operations.

## Core Features

- **Multi-Tenant SaaS UI**: The application dynamically adapts its UI (Logo, Name, Primary Brand Colors) based on the accessing tenant's subdomain (`subdomain.palikaos.com`) via Context APIs and CSS variable injection.
- **Role-Based Access Control (RBAC)**: Secure routes and UI components that conditionally render based on the logged-in user's role (Platform Admin, CAO, Ward Officer, Citizen).
- **White-Label Branding Settings**: Municipality administrators can upload custom logos and select brand colors to completely white-label their instance of the software.
- **Dynamic Tax Engine Interface**: Intuitive interfaces for defining custom Tax Rules (Flat/Percentage) and processing citizen tax payments.
- **Vital Events (Ghatana Darta)**: Complete digital forms and workflows for Birth, Death, Marriage, and Migration registrations.
- **Document Approvals & Sifaris**: Multi-stage digital document approval workflows with digital signatures.
- **SaaS Billing & eSewa Integration**: Automated municipality subscription management with direct integration into the eSewa digital wallet for frictionless payments.
- **Public Citizen Portal**: A dedicated public-facing portal where citizens can track the status of their complaints, service requests, and vital events securely using their tracking IDs.
- **Dark Mode & Responsive Design**: A beautiful, modern, Tailwind-powered UI that works flawlessly on desktops, tablets, and mobile devices.

## Technology Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with dynamic CSS variables for branding)
- **State Management**: React Context APIs & Custom Hooks
- **Routing**: React Router v7
- **Icons**: Lucide React & Custom SVGs
- **Charts**: ApexCharts (for Dashboard Analytics)

## Getting Started

### 1. Prerequisites
- Node.js (v18+)

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Documentation

We have comprehensive guides available in the `docs/` directory:

- [User Manual & Workflows](docs/user-manual.md) (For End-Users & Admins)
- [Architecture & Multi-Tenancy](docs/architecture.md)
- [Component Library & UI Guidelines](docs/components.md)
- [Routing & Role-Based Access Control (RBAC)](docs/routing-and-rbac.md)
- [API Integration & State Management](docs/api-integration.md)

### Deployment Guides
- [Coolify + Cloudflare Deployment](docs/deployment/coolify_deployment_guide.md)
- [VPS + Caddy + PM2 Deployment](docs/deployment/vps_caddy_pm2_deployment_guide.md)

### Business & Sales
- [SaaS Business Proposal Template](docs/business_proposal_template.md) (For pitching to Municipalities)

## Subdomain Development
To test multi-tenancy locally, you can map subdomains in your OS's `hosts` file (e.g., `/etc/hosts`):
```text
127.0.0.1 demo.localhost
127.0.0.1 kathmandu.localhost
```
Then access the app via `http://demo.localhost:5173`.
