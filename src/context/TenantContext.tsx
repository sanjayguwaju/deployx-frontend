import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export interface TenantBranding {
  name: string;
  logoUrl: string | null;
  faviconUrl?: string | null;
  licenseNumber?: string | null;
  tagline?: string | null;
  customDomain?: string | null;
  emailSenderName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  hidePoweredBy?: boolean;
  primaryColor: string;
  secondaryColor?: string;
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

      if (["app", "www", "deployx", "deployxos", "depolyx"].includes(subdomain)) {
        subdomain = "demo";
      }

      const res = await api.get(`/system/tenant/${subdomain}/branding`);
      if (res.data?.success && res.data.data) {
        setBranding(res.data.data);
        
        // Inject primary color as CSS variable for Tailwind
        if (res.data.data.primaryColor) {
          const hex = res.data.data.primaryColor;
          document.documentElement.style.setProperty("--color-brand-500", hex);
        }

        // Dynamically inject favicon if customized
        if (res.data.data.faviconUrl) {
          let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = res.data.data.faviconUrl;
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
