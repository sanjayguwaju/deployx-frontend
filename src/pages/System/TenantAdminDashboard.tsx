import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Users, Sparkles, Building } from "lucide-react";

export default function TenantAdminDashboard() {
  return (
    <>
      <PageMeta title="Agency Administration | DeployX" description="Agency Tenant Administrator Dashboard" />
      <PageBreadcrumb pageTitle="Agency Administration" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Management Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Staff & User Management</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Manage your recruitment agency staff, branch officers, and control role-based permissions.
          </p>
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Manage Staff
          </Link>
        </div>

        {/* Feature Flags Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Agency Feature Flags</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Toggle modules (e.g., AI Document Parser, Sourcing Agent Portal, WhatsApp Gateway) for your tenant.
          </p>
          <Link
            to="/feature-flags"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Manage Features
          </Link>
        </div>

        {/* Branding Settings Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">White-Label Branding</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Customize agency agency logo, color palette, legal disclaimers, and recruitment portal theme.
          </p>
          <Link
            to="/settings/branding"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Branding Settings
          </Link>
        </div>
      </div>
    </>
  );
}
