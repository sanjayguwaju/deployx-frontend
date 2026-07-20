import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useAbility } from '@casl/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  action?: string;
  subject?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, action, subject }) => {
  const { isAuthenticated } = useAuth();
  const ability = useAbility();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (action && subject && !ability.can(action, subject)) {
    // If not authorized for this specific route, redirect to home/dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
