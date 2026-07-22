import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "../api/axios";
import { useAuth } from "./AuthContext";

export interface FeatureFlag {
  _id: string;
  tenantId?: string;
  key: string;
  name: string;
  description: string;
  isActive: boolean;
  enabledWards: string[];
}

interface FeatureFlagContextType {
  flags: FeatureFlag[];
  isLoading: boolean;
  checkFlag: (key: string, wardId?: string) => boolean;
  fetchFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  const fetchFlags = async () => {
    try {
      const response = await axios.get("/feature-flags");
      if (response.data.success) {
        setFlags(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch feature flags", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFlags();
    } else {
      setFlags([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const checkFlag = (key: string, wardId?: string) => {
    const flag = flags.find((f) => f.key === key);
    if (!flag) return false;
    if (!flag.isActive) return false;
    
    if (flag.enabledWards && flag.enabledWards.length > 0 && wardId) {
      return flag.enabledWards.includes(wardId);
    }
    
    return true;
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoading, checkFlag, fetchFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  }
  return context;
};
