import PageMeta from "../../components/common/PageMeta";
import TenantsAdmin from "./TenantsAdmin";

export default function SuperAdminDashboard() {
  return (
    <>
      <PageMeta title="Super Admin Dashboard | DeployX" description="Global platform administration dashboard" />
      
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white/90">
          Super Admin Dashboard
        </h2>
      </div>


      {/* Render the core tenants management table */}
      <TenantsAdmin />
    </>
  );
}
