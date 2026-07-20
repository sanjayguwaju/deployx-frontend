# API Integration & State Management

PalikaOS communicates with a centralized backend API. 

## Environment Configuration

The base URL for the API is configured via environment variables.

In your `.env` file:
```env
VITE_API_URL=http://localhost:5001/api/v1
```

## Axios Configuration (`src/services/api.ts` or similar)

We use Axios for making HTTP requests. A centralized Axios instance should be used for all API calls to ensure authentication headers are automatically attached.

### Authentication Interceptors

When a user logs in, their JWT is typically saved to `localStorage` (or handled via HttpOnly cookies). The Axios interceptor automatically attaches this token to the `Authorization: Bearer <token>` header of every outgoing request.

If the token expires and the backend returns a `401 Unauthorized`, the interceptor should automatically attempt to refresh the token using the refresh endpoint or redirect the user to the `/signin` page if the session is fully expired.

## Fetching Data & State

Currently, PalikaOS uses standard React component state (`useState`, `useEffect`) to fetch data:

```tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Pass data to table...
}
```

### Future Recommendation: React Query
As the application grows, moving to `@tanstack/react-query` is highly recommended. It handles caching, background refetching, and complex loading states far better than raw `useEffect` blocks.

## Error Handling

We use `react-hot-toast` for all user-facing notifications. If an API request fails (e.g., creating a new citizen), wrap the error in a try/catch block and trigger `toast.error(error.response?.data?.message || 'An error occurred')`.
