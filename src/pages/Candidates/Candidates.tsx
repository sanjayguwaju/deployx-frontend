import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CandidatesTable from "../../components/candidates/CandidatesTable";

export default function Candidates() {
  return (
    <>
      <PageMeta
        title={`Candidates | DeployX`}
        description="Manage candidates for DeployX"
      />
      <PageBreadcrumb pageTitle="Candidates" />
      <div className="space-y-6">
        <CandidatesTable />
      </div>
    </>
  );
}
