import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For receiving and sending cookies if configured
});

// Add a request interceptor to inject the token and subdomain
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Extract subdomain
    const hostname = window.location.hostname;
    // e.g., kathmandu.demo.com -> ['kathmandu', 'demo', 'com']
    // e.g., kathmandu.localhost -> ['kathmandu', 'localhost']
    const parts = hostname.split('.');
    
    // Check if there is a subdomain (more than 2 parts for .com, more than 1 for localhost)
    let subdomain = "";
    if (hostname.includes("localhost") && parts.length > 1) {
      subdomain = parts[0];
    } else if (parts.length > 2) {
      subdomain = parts[0];
    }

    // Ignore 'app' or 'www' subdomains as they might be used for the naked/landing page
    if (subdomain && subdomain !== "app" && subdomain !== "www") {
      config.headers["X-Tenant-Subdomain"] = subdomain;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a response interceptor to handle errors globally (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Do not attempt to refresh token if the request was to auth routes that don't need it
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/signup")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = "Bearer " + token;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          (api.defaults.baseURL || "http://localhost:8081/api/v1") + "/auth/refresh",
          {},
          { withCredentials: true }
        );

        if (data && data.data && data.data.accessToken) {
          const newAccessToken = data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          }
          
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error("No token returned");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Dispatch event or clear local storage if refresh fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
