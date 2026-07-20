import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link, Navigate } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
  const { branding } = useTenant();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-md text-center px-4">
              <Link to="/" className="block mb-4">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-24 h-24 mx-auto object-contain mb-4" />
                ) : null}
                <h2 className="text-3xl font-bold text-white sm:text-4xl">{branding?.name || "PalikaOS"}</h2>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Welcome to the official Municipality Management System of {branding?.name || "PalikaOS"}.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
