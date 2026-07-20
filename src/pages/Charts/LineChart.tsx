import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function LineChart() {
  return (
    <div>
      <PageMeta
        title="Line Chart | PalikaOS"
        description="Line Chart preview page for PalikaOS"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart Overview">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
