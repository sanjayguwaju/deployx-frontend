# Architecture & Multi-Tenancy

PalikaOS is built as a Multi-Tenant SaaS platform. This means a single instance of the application (one codebase, one deployment) serves multiple municipalities (tenants). Each tenant gets their own customized experience, including branding, logos, and isolated data.

## Folder Structure

The frontend application follows a standard React/Vite structure, organized by feature and technical concern:

```
src/
├── components/       # Reusable UI components (buttons, modals, forms)
│   ├── auth/         # Authentication related components
│   ├── common/       # General layout components (GridShape, etc.)
│   ├── form/         # Form inputs, MultiSelect, DatePicker
│   ├── header/       # Top navigation, User dropdown, Notifications
│   ├── sidebar/      # Navigation sidebar (conditionally rendered by role)
│   ├── tables/       # Legacy table components
│   └── ui/           # Radix UI primitives and complex headless components
├── context/          # React Contexts (Auth, Tenant, Theme, Socket)
├── hooks/            # Custom React hooks
├── icons/            # Reusable SVG icon components
├── layout/           # Page wrappers (AppLayout, AuthLayout)
├── pages/            # View-level components corresponding to routes
├── router/           # Application routing configuration (App.tsx)
└── services/         # API integration layers (Axios configuration)
```

## Multi-Tenancy & TenantContext

The core of the multi-tenant architecture is the `TenantContext` (`src/context/TenantContext.tsx`).

### How Subdomain Routing Works
1. When a user visits `https://kathmandu.palikaos.com`, the frontend extracts the subdomain (`kathmandu`) from `window.location.hostname`.
2. The `TenantProvider` takes this subdomain and makes an initial API request to the backend: `GET /api/v1/public/tenant-config?subdomain=kathmandu`.
3. The backend responds with the tenant's configuration, including their Name, Logo URL, and Primary Brand Color (e.g., `#0A438F`).
4. If the subdomain is invalid, the user is redirected to a 404/Not Found page.

### Dynamic Theming
Once the `TenantContext` receives the brand color, it dynamically injects CSS variables into the `:root` HTML element.

```typescript
// Inside TenantContext
document.documentElement.style.setProperty('--color-brand-500', tenant.primaryColor);
document.documentElement.style.setProperty('--color-brand-600', darkerColor);
```

Because Tailwind CSS is configured (in `index.css`) to use these CSS variables for the `brand` color palette, the entire application instantly updates to match the municipality's specific branding without requiring a page reload or separate CSS files.

## State Management

We use React Context for global state that rarely changes and is needed across many components:
- **`AuthContext`**: Manages the logged-in user's JWT token, profile data, and roles.
- **`TenantContext`**: Manages the current municipality's branding and settings.
- **`ThemeContext`**: Manages the Light/Dark mode toggle (persisted in `localStorage`).
- **`SocketContext`**: Manages real-time WebSocket connections for live notifications.

For server state (data fetched from APIs like tables or forms), we rely on local component state (`useState`, `useEffect`) and standard prop drilling, though adopting tools like React Query is recommended for future scalability.
