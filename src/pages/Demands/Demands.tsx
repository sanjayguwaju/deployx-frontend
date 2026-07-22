import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DemandsTable from "../../components/demands/DemandsTable";

export default function Demands() {
  return (
    <>
      <PageMeta
        title={`Job Demands | DeployX`}
        description="Manage job demands and client quotas for DeployX"
      />
      <PageBreadcrumb pageTitle="Job Demands" />
      <div className="space-y-6">
        <DemandsTable />
      </div>
    </>
  );
}
