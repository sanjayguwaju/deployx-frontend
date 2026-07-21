import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { GroupIcon, BoxCubeIcon } from "../../icons";

export default function TenantAdminDashboard() {
  return (
    <>
      <PageMeta title="Administrator Dashboard | DeployX" description="Tenant Administrator Dashboard" />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white/90">
          Administrator Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* User Management Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <GroupIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">User Management</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Manage your municipality's users, assign roles, and control access permissions.
          </p>
          <Link
            to="/users"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Manage Users
          </Link>
        </div>

        {/* Feature Flags Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <BoxCubeIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Feature Flags</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Toggle specific system features (e.g., Tax Engine, Citizen Portal) on or off for your municipality.
          </p>
          <Link
            to="/feature-flags"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-2.5 text-center font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Manage Features
          </Link>
        </div>
      </div>
    </>
  );
}
