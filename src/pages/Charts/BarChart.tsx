import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function BarChart() {
  return (
    <div>
      <PageMeta
        title="Bar Chart | PalikaOS"
        description="Bar Chart preview page for PalikaOS"
      />
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Overview">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
