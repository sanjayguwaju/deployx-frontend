import { ReactNode } from "react";
import { useFeatureFlags } from "../context/FeatureFlagContext";
import { useAuth } from "../context/AuthContext";

interface FeatureFlagProps {
  flagKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureFlag = ({ flagKey, children, fallback = null }: FeatureFlagProps) => {
  const { checkFlag, isLoading } = useFeatureFlags();
  const { user } = useAuth(); // To get wardId if they belong to a ward

  if (isLoading) {
    return null; // Or a small skeleton
  }

  const isEnabled = checkFlag(flagKey, user?.wardId);

  return isEnabled ? <>{children}</> : <>{fallback}</>;
};
