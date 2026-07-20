import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface TenantBranding {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
}

interface TenantContextType {
  branding: TenantBranding | null;
  isLoading: boolean;
  refreshBranding: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      let subdomain = "demo"; // Default fallback
      
      if ((hostname.includes("localhost") && parts.length > 1) || parts.length > 2) {
        subdomain = parts[0];
      }

      if (subdomain === "app" || subdomain === "www") {
        subdomain = "demo";
      }

      const res = await api.get(`/system/tenant/${subdomain}/branding`);
      if (res.data?.success && res.data.data) {
        setBranding(res.data.data);
        
        // Inject primary color as CSS variable for Tailwind
        if (res.data.data.primaryColor) {
          const hex = res.data.data.primaryColor;
          document.documentElement.style.setProperty("--color-brand-500", hex);
          // Optional: approximate a darker variant for hover states (e.g. brand-600)
          // We can just rely on opacity or a generic darker override if needed.
        }
      }
    } catch (error) {
      console.error("Failed to fetch tenant branding", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <TenantContext.Provider value={{ branding, isLoading, refreshBranding: fetchBranding }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
