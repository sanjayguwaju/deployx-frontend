import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PieChartOne from "../../components/charts/pie/PieChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function PieChart() {
  return (
    <div>
      <PageMeta
        title="Pie Chart | DeployX"
        description="Pie Chart preview page for DeployX"
      />
      <PageBreadcrumb pageTitle="Pie Chart" />
      <div className="space-y-6">
        <ComponentCard title="Pie Chart Overview">
          <PieChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
