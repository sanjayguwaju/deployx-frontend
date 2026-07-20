import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Loader from "../../components/common/Loader";

interface DepartmentDashboardProps {
  department: "overview" | "finance" | "infrastructure" | "health" | "education" | "agriculture" | "disaster-management";
}

export default function DepartmentDashboard({ department }: DepartmentDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/dashboard/${department}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("You do not have permission to view this department's dashboard.");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [department]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Failed to load {department} dashboard</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // ─── Chart Options Generators ───
  const getDonutOptions = (labels: string[]): ApexOptions => ({
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels: labels.map(l => (l || "Unknown").replace(/_/g, " ")),
    legend: { position: "bottom", labels: { colors: "#6b7280" } },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "70%" } } },
  });

  const getBarOptions = (categories: string[]): ApexOptions => ({
    chart: { type: "bar", fontFamily: "Inter, sans-serif", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    xaxis: { categories: categories.map(l => (l || "Unknown").replace(/_/g, " ")), labels: { style: { colors: "#9ca3af" } } },
    yaxis: { labels: { style: { colors: "#9ca3af" } } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f3f4f6" },
  });

  // ─── Render by Department ───

  if (department === "finance") {
    const budgetLabels = (data.budgetBySection || []).map((b: any) => b._id);
    const allocatedData = (data.budgetBySection || []).map((b: any) => b.allocated);
    const spentData = (data.budgetBySection || []).map((b: any) => b.spent);
    
    const revenueLabels = (data.revenueByType || []).map((r: any) => r._id);
    const revenueValues = (data.revenueByType || []).map((r: any) => r.total);

    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Budget Allocation vs Spent</h3>
          {budgetLabels.length > 0 ? (
            <Chart
              options={getBarOptions(budgetLabels)}
              series={[
                { name: "Allocated", data: allocatedData },
                { name: "Spent", data: spentData }
              ]}
              type="bar" height={300}
            />
          ) : <p className="text-sm text-gray-500">No budget data.</p>}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Revenue by Type</h3>
          {revenueLabels.length > 0 ? (
            <Chart options={getDonutOptions(revenueLabels)} series={revenueValues} type="donut" height={300} />
          ) : <p className="text-sm text-gray-500">No revenue data.</p>}
        </div>
      </div>
    );
  }

  if (department === "infrastructure") {
    const statusLabels = (data.projectStatus || []).map((p: any) => p._id);
    const statusValues = (data.projectStatus || []).map((p: any) => p.count);

    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 flex flex-col justify-center items-center">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Average Completion</h3>
          <p className="text-4xl font-bold text-brand-500">{(data.avgCompletion || 0).toFixed(1)}%</p>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Projects by Status</h3>
          {statusLabels.length > 0 ? (
            <Chart options={getDonutOptions(statusLabels)} series={statusValues} type="donut" height={300} />
          ) : <p className="text-sm text-gray-500">No project data.</p>}
        </div>
      </div>
    );
  }

  if (department === "education") {
    const typeLabels = (data.schoolsByType || []).map((s: any) => s._id);
    const typeValues = (data.schoolsByType || []).map((s: any) => s.count);

    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Schools by Type</h3>
          {typeLabels.length > 0 ? (
            <Chart options={getBarOptions(typeLabels)} series={[{ name: "Schools", data: typeValues }]} type="bar" height={300} />
          ) : <p className="text-sm text-gray-500">No school data.</p>}
        </div>
      </div>
    );
  }

  if (department === "agriculture") {
    const animalLabels = (data.livestockByType || []).map((s: any) => s._id);
    const animalValues = (data.livestockByType || []).map((s: any) => s.totalCount);

    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Livestock Distribution</h3>
          {animalLabels.length > 0 ? (
            <Chart options={getDonutOptions(animalLabels)} series={animalValues} type="donut" height={300} />
          ) : <p className="text-sm text-gray-500">No livestock data.</p>}
        </div>
      </div>
    );
  }

  if (department === "disaster-management") {
    const severityLabels = (data.incidentsBySeverity || []).map((s: any) => s._id);
    const severityValues = (data.incidentsBySeverity || []).map((s: any) => s.count);
    
    const reliefLabels = (data.reliefStatus || []).map((s: any) => s._id);
    const reliefValues = (data.reliefStatus || []).map((s: any) => s.totalAmount);

    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Incidents by Severity</h3>
          {severityLabels.length > 0 ? (
            <Chart options={getDonutOptions(severityLabels)} series={severityValues} type="donut" height={300} />
          ) : <p className="text-sm text-gray-500">No incident data.</p>}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Relief Funds Requested by Status</h3>
          {reliefLabels.length > 0 ? (
            <Chart options={getBarOptions(reliefLabels)} series={[{ name: "Amount (NPR)", data: reliefValues }]} type="bar" height={300} />
          ) : <p className="text-sm text-gray-500">No relief data.</p>}
        </div>
      </div>
    );
  }

  if (department === "health") {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 flex flex-col justify-center items-center">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Total Health Posts</h3>
          <p className="text-4xl font-bold text-brand-500">{data.totalPosts}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-gray-500 text-sm">Dashboard view for {department} is not fully configured yet.</div>
  );
}
