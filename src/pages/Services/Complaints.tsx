import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComplaintsTable from "../../components/services/ComplaintsTable";

export default function Complaints() {
  return (
    <>
      <PageMeta
        title="Complaints | PalikaOS"
        description="Manage and track citizen complaints"
      />
      <PageBreadcrumb pageTitle="Complaints" />
      <div className="space-y-6">
        <ComplaintsTable />
      </div>
    </>
  );
}
