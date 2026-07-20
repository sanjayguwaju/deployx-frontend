import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { buildAbilityFor } from "../utils/ability";
import { AbilityProvider } from "@casl/react";
import api from "../api/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  municipalityId: string;
  roles: string[];
  wardId?: string;
  image?: string;
  phone?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  taxId?: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  permissions?: { module: string; action: string; conditions?: Record<string, any> }[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Attempt to restore session on mount
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        // 1. Instantly load stale data from localStorage for a fast UI render
        setUser(JSON.parse(storedUser));
        
        // 2. Silently fetch the absolute latest user data/permissions from the backend
        api.get("/auth/me")
          .then((response) => {
            if (response.data?.success && response.data?.data) {
              const freshUser = response.data.data;
              // Update state and localStorage with the fresh data (which includes any new permissions)
              setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));
            }
          })
          .catch((err) => {
            console.error("Background sync failed:", err);
            // If the token is dead/expired, forcefully log them out
            if (err.response?.status === 401) {
              logout();
            }
          });
      } catch (err) {
        console.error("Failed to parse stored user", err);
        logout();
      }
    }
  }, []);

  const login = (accessToken: string, userData: User) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    // Optional: Call the backend logout API here
    // api.post("/auth/logout").catch(console.error);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const isAuthenticated = !!user;
  const ability = useMemo(() => buildAbilityFor(user), [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      <AbilityProvider value={ability}>
        {children}
      </AbilityProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
