import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ServiceRequestsTable from "../../components/services/ServiceRequestsTable";

export default function ServiceRequests() {
  return (
    <>
      <PageMeta
        title="Service Requests | DeployX"
        description="Manage and track citizen service requests"
      />
      <PageBreadcrumb pageTitle="Service Requests" />
      <div className="space-y-6">
        <ServiceRequestsTable />
      </div>
    </>
  );
}
