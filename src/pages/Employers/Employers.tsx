import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import EmployersTable from "../../components/employers/EmployersTable";

export default function Employers() {
  return (
    <>
      <PageMeta
        title={`Employers | DeployX`}
        description="Manage employers and client companies for DeployX"
      />
      <PageBreadcrumb pageTitle="Employers" />
      <div className="space-y-6">
        <EmployersTable />
      </div>
    </>
  );
}
