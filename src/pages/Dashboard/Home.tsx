import { useEffect, useState } from "react";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";
import DepartmentDashboard from "./DepartmentDashboard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import PieChartOne from "../../components/charts/pie/PieChartOne";
import { GroupIcon, FileIcon, DollarLineIcon, BoxCubeIcon } from "../../icons";
import Loader from "../../components/common/Loader";

interface OverviewData {
  citizens: { total: number };
  serviceRequests: { pending: number; byStatus: Record<string, number>; monthly: number[] };
  complaints: { open: number; monthly: number[] };
  registrations: { totalLast30Days: number };
  budget: { totalAllocated: number; totalSpent: number };
  revenue: { totalCollected: number; monthly: number[] };
  totalProjects: number;
  infra: { byStatus: Record<string, number> };
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function KpiCard({ label, value, icon, color, sublabel }: { label: string; value: number | string; icon: React.ReactNode; color: string; sublabel?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white">{value}</p>
          {sublabel && <p className="mt-0.5 text-[11px] text-gray-400">{sublabel}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const DEPARTMENTS = [
  { id: "overview", label: "Overview" },
  { id: "pipeline", label: "Deployment Pipeline" },
  { id: "finance", label: "Finance & Commissions" },
  { id: "compliance", label: "Compliance & Documents" },
];

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (activeTab !== "overview") return;
    
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await api.get("/dashboard/overview");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("You do not have permission to view the overview dashboard.");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to load overview");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [activeTab]);

  const renderOverview = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">Failed to load dashboard</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      );
    }

    const srByStatus = data?.serviceRequests.byStatus || {};
    const srStatusLabels = Object.keys(srByStatus).map((s) => s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
    const srStatusValues = Object.keys(srByStatus).map((k) => srByStatus[k]);

    const infraByStatus = data?.infra.byStatus || {};
    const infraStatusLabels = Object.keys(infraByStatus).map((s) => s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
    const infraStatusValues = Object.keys(infraByStatus).map((k) => infraByStatus[k]);

    const trendSeries = [
      { name: "Candidate Registrations", data: data?.serviceRequests.monthly || Array(12).fill(0) },
      { name: "Deployments", data: data?.complaints.monthly || Array(12).fill(0) },
    ];
    
    const revenueSeries = [
      { name: "Revenue Collection ($)", data: data?.revenue.monthly || Array(12).fill(0) }
    ];

    return (
      <>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <KpiCard label="Total Candidates" value={data?.citizens.total ?? "—"} icon={<GroupIcon />} color="bg-blue-50 dark:bg-blue-500/10 text-blue-500" sublabel="Registered in system" />
          <KpiCard label="Active Demands" value={data?.serviceRequests.pending ?? "—"} icon={<FileIcon />} color="bg-amber-50 dark:bg-amber-500/10 text-amber-500" sublabel="Awaiting matching" />
          <KpiCard label="Revenue Collected" value={`$ ${(data?.budget.totalAllocated || 0).toLocaleString()}`} icon={<DollarLineIcon />} color="bg-green-50 dark:bg-green-500/10 text-green-500" sublabel={`Invoiced: $ ${(data?.budget.totalSpent || 0).toLocaleString()}`} />
          <KpiCard label="Candidates in Pipeline" value={data?.totalProjects ?? "—"} icon={<BoxCubeIcon />} color="bg-purple-50 dark:bg-purple-500/10 text-purple-500" sublabel="Active recruitment pipeline" />
        </div>

        {/* Top Charts Row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 mb-4">
          <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Monthly Trends</h3>
            <LineChartOne series={trendSeries} categories={EN_MONTHS} colors={["#465fff", "#f05252"]} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Pipeline Status</h3>
            {srStatusValues.length > 0 ? (
              <PieChartOne series={srStatusValues} labels={srStatusLabels} />
            ) : <div className="flex h-64 items-center justify-center text-gray-400 text-xs">No data available</div>}
          </div>
        </div>

        {/* Bottom Charts Row */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 mb-4">
          <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Revenue Collection</h3>
            <BarChartOne series={revenueSeries} categories={EN_MONTHS} colors={["#10b981"]} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
            <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">Visa Approvals</h3>
            {infraStatusValues.length > 0 ? (
              <PieChartOne series={infraStatusValues} labels={infraStatusLabels} colors={["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"]} />
            ) : <div className="flex h-64 items-center justify-center text-gray-400 text-xs">No data available</div>}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <PageMeta title="Dashboard | DeployX" description="Recruitment CRM Dashboard" />
      
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 hide-scrollbar">
        {DEPARTMENTS.map((dept) => (
          <button
            type="button"
            key={dept.id}
            onClick={() => setActiveTab(dept.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === dept.id 
                ? "border-brand-500 text-brand-500" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" ? renderOverview() : <DepartmentDashboard department={activeTab as any} />}
    </>
  );
}
