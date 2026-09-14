import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Loader from "../../components/common/Loader";
import { 
  Users, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plane, 
  Building2, 
  ShieldCheck, 
  FileCheck2,
  HeartPulse,
  Stamp,
  TrendingUp,
  Receipt,
  Award
} from "lucide-react";

interface DepartmentDashboardProps {
  department: "pipeline" | "finance" | "compliance" | "overview" | string;
}

function StatCard({
  title,
  value,
  subvalue,
  icon,
  colorClass,
}: {
  title: string;
  value: string | number;
  subvalue?: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{value}</h4>
          {subvalue && <p className="mt-0.5 text-[11px] text-gray-400">{subvalue}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
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
          setError("You do not have permission to view this tab's analytics.");
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-400">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load {department} dashboard</span>
        </div>
        <p className="mt-1 text-xs text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // Chart generators
  const getDonutOptions = (labels: string[], colors?: string[]): ApexOptions => ({
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels: labels.map((l) => (l || "Unknown").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
    legend: { position: "bottom", fontSize: "11px", labels: { colors: "#6b7280" } },
    dataLabels: { enabled: false },
    colors: colors || ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
    plotOptions: { pie: { donut: { size: "70%" } } },
  });

  const getBarOptions = (categories: string[], horizontal = false): ApexOptions => ({
    chart: { type: "bar", fontFamily: "Inter, sans-serif", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal, columnWidth: "50%" } },
    xaxis: {
      categories: categories.map((l) => (l || "Unknown").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: { labels: { style: { colors: "#9ca3af", fontSize: "11px" } } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f3f4f6" },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 1. PIPELINE TAB
  // ───────────────────────────────────────────────────────────────────────────
  if (department === "pipeline") {
    const stages = data.stages || {};
    const stageLabels = Object.keys(stages);
    const stageValues = Object.values(stages) as number[];

    const countries = (data.countryDistribution || []).map((c: any) => c.country);
    const countryQuotas = (data.countryDistribution || []).map((c: any) => c.quota || c.demands);

    const medicalStats = data.medicalStats || {};
    const medicalLabels = Object.keys(medicalStats);
    const medicalValues = Object.values(medicalStats) as number[];

    const visaStats = data.visaStats || {};
    const visaLabels = Object.keys(visaStats);
    const visaValues = Object.values(visaStats) as number[];

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total in Pipeline"
            value={data.totalInPipeline || 0}
            subvalue="Active candidates"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            colorClass="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            title="Medicals Cleared"
            value={medicalStats.passed || 0}
            subvalue="Fit for travel"
            icon={<HeartPulse className="w-5 h-5 text-emerald-600" />}
            colorClass="bg-emerald-50 dark:bg-emerald-950/40"
          />
          <StatCard
            title="Visas Approved"
            value={visaStats.approved || 0}
            subvalue="Ready for ticketing"
            icon={<Stamp className="w-5 h-5 text-amber-600" />}
            colorClass="bg-amber-50 dark:bg-amber-950/40"
          />
          <StatCard
            title="Tickets Booked"
            value={stages.ticket || 0}
            subvalue="Awaiting departure"
            icon={<Plane className="w-5 h-5 text-purple-600" />}
            colorClass="bg-purple-50 dark:bg-purple-950/40"
          />
          <StatCard
            title="Completed Deployments"
            value={data.completedCount || 0}
            subvalue="Landed & on-job"
            icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
            colorClass="bg-green-50 dark:bg-green-950/40"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Funnel: Candidates Across Stages */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Candidates by Pipeline Stage
            </h3>
            {stageLabels.length > 0 ? (
              <Chart
                options={getBarOptions(stageLabels, false)}
                series={[{ name: "Candidates", data: stageValues }]}
                type="bar"
                height={290}
              />
            ) : (
              <p className="text-xs text-gray-400">No active candidates in pipeline.</p>
            )}
          </div>

          {/* Hiring Countries Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Demand Quota by Destination
            </h3>
            {countries.length > 0 ? (
              <Chart
                options={getDonutOptions(countries)}
                series={countryQuotas}
                type="donut"
                height={290}
              />
            ) : (
              <p className="text-xs text-gray-400">No demand destination data available.</p>
            )}
          </div>
        </div>

        {/* Second Row: Medical vs Visa Breakdowns & Recent Candidates */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Medical Examination Status
            </h3>
            {medicalLabels.length > 0 ? (
              <Chart
                options={getDonutOptions(medicalLabels, ["#10b981", "#f59e0b", "#ef4444"])}
                series={medicalValues}
                type="donut"
                height={240}
              />
            ) : (
              <p className="text-xs text-gray-400">No medical data.</p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Visa Processing Status
            </h3>
            {visaLabels.length > 0 ? (
              <Chart
                options={getDonutOptions(visaLabels, ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"])}
                series={visaValues}
                type="donut"
                height={240}
              />
            ) : (
              <p className="text-xs text-gray-400">No visa data.</p>
            )}
          </div>

          {/* Recent Candidates */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Recent Candidate Movements
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-strokedark/60 text-xs">
              {(data.recentCandidates || []).slice(0, 5).map((cand: any) => (
                <div key={cand.id} className="py-2.5 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {cand.candidateName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {cand.profession} • {cand.destination}
                    </p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
                    {cand.stage}
                  </span>
                </div>
              ))}
              {(!data.recentCandidates || data.recentCandidates.length === 0) && (
                <p className="py-4 text-center text-xs text-gray-400">No candidate movements yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. FINANCE TAB
  // ───────────────────────────────────────────────────────────────────────────
  if (department === "finance") {
    const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const invoiceStatusMap = data.invoicesByStatus || {};
    const invoiceStatusLabels = Object.keys(invoiceStatusMap);
    const invoiceStatusValues = invoiceStatusLabels.map((k) => invoiceStatusMap[k]?.total || 0);

    const commissionMap = data.commissionsByStatus || {};
    const commissionLabels = Object.keys(commissionMap);
    const commissionValues = commissionLabels.map((k) => commissionMap[k]?.total || 0);

    return (
      <div className="space-y-6">
        {/* Finance KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Invoiced"
            value={`$ ${(data.totalInvoiced || 0).toLocaleString()}`}
            subvalue="All client billings"
            icon={<Receipt className="w-5 h-5 text-blue-600" />}
            colorClass="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            title="Revenue Collected"
            value={`$ ${(data.totalCollected || 0).toLocaleString()}`}
            subvalue="Paid in full"
            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
            colorClass="bg-emerald-50 dark:bg-emerald-950/40"
          />
          <StatCard
            title="Outstanding Balance"
            value={`$ ${(data.totalOutstanding || 0).toLocaleString()}`}
            subvalue="Sent & overdue"
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            colorClass="bg-amber-50 dark:bg-amber-950/40"
          />
          <StatCard
            title="Commissions Paid"
            value={`$ ${(data.commissionsPaid || 0).toLocaleString()}`}
            subvalue={`Pending: $ ${(data.commissionsPending || 0).toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
            colorClass="bg-purple-50 dark:bg-purple-950/40"
          />
        </div>

        {/* Monthly Invoiced vs Collected */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Monthly Invoiced vs Collected ($)
            </h3>
            <Chart
              options={getBarOptions(EN_MONTHS)}
              series={[
                { name: "Invoiced", data: data.monthlyInvoiced || Array(12).fill(0) },
                { name: "Collected", data: data.monthlyCollected || Array(12).fill(0) },
              ]}
              type="bar"
              height={290}
            />
          </div>

          {/* Invoice Status Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Invoice Distribution ($)
            </h3>
            {invoiceStatusLabels.length > 0 ? (
              <Chart
                options={getDonutOptions(invoiceStatusLabels)}
                series={invoiceStatusValues}
                type="donut"
                height={290}
              />
            ) : (
              <p className="text-xs text-gray-400">No invoice records.</p>
            )}
          </div>
        </div>

        {/* Top Billing Employers & Commissions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Employers */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Top Billing Foreign Employers
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-strokedark/60 text-xs">
              {(data.topEmployers || []).map((emp: any) => (
                <div key={emp.employerId} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {emp.companyName}
                      </p>
                      <p className="text-[11px] text-gray-500">{emp.country} • {emp.invoicesCount} Invoices</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    $ {emp.total.toLocaleString()}
                  </span>
                </div>
              ))}
              {(!data.topEmployers || data.topEmployers.length === 0) && (
                <p className="py-4 text-center text-xs text-gray-400">No employer billing data yet.</p>
              )}
            </div>
          </div>

          {/* Commissions Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Agent Commission Status ($)
            </h3>
            {commissionLabels.length > 0 ? (
              <Chart
                options={getDonutOptions(commissionLabels, ["#10b981", "#3b82f6", "#f59e0b"])}
                series={commissionValues}
                type="donut"
                height={260}
              />
            ) : (
              <p className="text-xs text-gray-400">No commission records.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. COMPLIANCE TAB
  // ───────────────────────────────────────────────────────────────────────────
  if (department === "compliance") {
    const licenseStats = data.licenseStats || {};
    const expiringCount = data.upcomingExpiriesCount || {};
    const complianceChecks = data.complianceChecks || {};
    const complianceLabels = Object.keys(complianceChecks);
    const complianceValues = Object.values(complianceChecks) as number[];

    return (
      <div className="space-y-6">
        {/* Compliance KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Agency Licenses"
            value={licenseStats.active || 0}
            subvalue={`Expiring soon: ${licenseStats.expiring || 0}`}
            icon={<Award className="w-5 h-5 text-blue-600" />}
            colorClass="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            title="Expiring Medicals"
            value={expiringCount.medicals || 0}
            subvalue="Next 30 days"
            icon={<HeartPulse className="w-5 h-5 text-amber-600" />}
            colorClass="bg-amber-50 dark:bg-amber-950/40"
          />
          <StatCard
            title="Expiring Visas"
            value={expiringCount.visas || 0}
            subvalue="Next 30 days"
            icon={<Stamp className="w-5 h-5 text-rose-600" />}
            colorClass="bg-rose-50 dark:bg-rose-950/40"
          />
          <StatCard
            title="Compliance Checks Passed"
            value={complianceChecks.passed || 0}
            subvalue={`Pending: ${complianceChecks.pending || 0}`}
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            colorClass="bg-emerald-50 dark:bg-emerald-950/40"
          />
        </div>

        {/* Charts & Watchlist */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Compliance Checks Donut */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Government Labor Clearances
            </h3>
            {complianceLabels.length > 0 ? (
              <Chart
                options={getDonutOptions(complianceLabels, ["#10b981", "#f59e0b", "#ef4444"])}
                series={complianceValues}
                type="donut"
                height={270}
              />
            ) : (
              <p className="text-xs text-gray-400">No compliance audits recorded.</p>
            )}
          </div>

          {/* Urgent Expirations Watchlist Table */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Urgent Expirations Watchlist (30 Days)
              </h3>
              <span className="text-[11px] text-gray-400">
                {(data.expiringItems || []).length} items require attention
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-strokedark text-[11px] text-gray-400 uppercase">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Subject / Details</th>
                    <th className="pb-2 font-medium">Issuing Authority</th>
                    <th className="pb-2 font-medium">Expiry Date</th>
                    <th className="pb-2 font-medium text-right">Days Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-strokedark/60">
                  {(data.expiringItems || []).map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-meta-4/30">
                      <td className="py-2.5 font-medium text-gray-800 dark:text-white">
                        <span className="inline-flex items-center gap-1">
                          <FileCheck2 className="w-3 h-3 text-brand-500" />
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                        {item.title}
                      </td>
                      <td className="py-2.5 text-gray-500 dark:text-gray-400">
                        {item.issuingAuthority || "—"}
                      </td>
                      <td className="py-2.5 font-mono text-gray-700 dark:text-gray-300">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.urgency === "critical"
                              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {item.daysLeft} days left
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!data.expiringItems || data.expiringItems.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-gray-400">
                        No upcoming expirations in the next 30 days. All licenses & documents in good standing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-gray-500 text-xs">
      Dashboard view for {department} is not fully configured yet.
    </div>
  );
}

