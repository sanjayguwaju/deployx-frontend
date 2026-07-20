# Routing & Role-Based Access Control (RBAC)

PalikaOS secures pages and restricts access based on the user's role using a custom `ProtectedRoute` wrapper component and React Router.

## 1. Authentication Check

When a user visits a protected route, the application first checks if they have a valid JWT token stored. If not, they are immediately redirected to `/signin`.

## 2. Role-Based Access (Authorization)

Different municipalities have users with different roles (e.g., `Platform Admin`, `Chief Administrative Officer (CAO)`, `Ward Officer`, `Citizen`). 

To restrict a specific page to certain roles, wrap the route inside a `<ProtectedRoute>` in `src/router/App.tsx`.

### Example: Protecting a Route

```tsx
// src/router/App.tsx
import ProtectedRoute from "../components/auth/ProtectedRoute";

// ...

<Route
  path="/system/settings"
  element={
    <ProtectedRoute allowedRoles={["Platform Admin"]}>
      <SystemSettings />
    </ProtectedRoute>
  }
/>
```

In the example above, if a `Ward Officer` tries to navigate to `/system/settings`, they will see an "Access Denied" or "Unauthorized" view, and the `SystemSettings` component will never render.

## 3. Component-Level RBAC

Sometimes you don't want to block an entire page, but just hide a specific button (like a "Delete" button) if the user isn't an admin. You can do this by checking the user's roles from the `AuthContext`:

```tsx
import { useAuth } from "../context/AuthContext";

export function CitizenDetails() {
  const { user } = useAuth();
  
  // Check if the user's roles array includes "Platform Admin"
  const isAdmin = user?.roles?.includes("Platform Admin");

  return (
    <div>
      <h1>Citizen Name</h1>
      {/* Conditionally render the delete button */}
      {isAdmin && (
        <button className="bg-red-500">Delete Record</button>
      )}
    </div>
  )
}
```

## 4. Sidebar Navigation 

The Sidebar (`src/components/sidebar/`) dynamically renders navigation links based on the user's roles. Always ensure that the routes listed in the sidebar match the `allowedRoles` configured in `App.tsx` so users don't see links they cannot click.
