import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CorrespondenceTable from "../../components/correspondence/CorrespondenceTable";

export default function Correspondence() {
  return (
    <>
      <PageMeta
        title="Correspondence | DeployX"
        description="Manage incoming and outgoing official correspondence (Darta/Chalani)"
      />
      <PageBreadcrumb pageTitle="Correspondence" />
      <div className="space-y-6">
        <CorrespondenceTable />
      </div>
    </>
  );
}
