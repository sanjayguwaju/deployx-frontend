import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AuditLogsTable from "../../components/audit/AuditLogsTable";

export default function AuditLogs() {
  return (
    <>
      <PageMeta
        title="Audit Logs | DeployX"
        description="System-wide activity trail for DeployX"
      />
      <PageBreadcrumb pageTitle="Audit Logs" />
      <div className="space-y-6">
        <AuditLogsTable />
      </div>
    </>
  );
}
