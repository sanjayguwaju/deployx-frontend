import { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Loader from "../../components/common/Loader";

interface DashboardMetrics {
  totalReferrals: number;
  activeReferrals: number;
  deployedCandidates: number;
  pendingCommission: number;
  paidCommission: number;
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalReferrals: 0,
    activeReferrals: 0,
    deployedCandidates: 0,
    pendingCommission: 0,
    paidCommission: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [candidatesRes, commissionsRes] = await Promise.all([
        api.get("/portals/agent/candidates?pageSize=100"),
        api.get("/portals/agent/commissions"),
      ]);

      const candidates = candidatesRes.data?.data || [];
      const commissions = commissionsRes.data?.data || [];

      const deployed = candidates.filter((c: any) => c.status === "completed" || c.status === "deployed").length;
      
      const pendingComm = commissions
        .filter((c: any) => c.status === "pending")
        .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
        
      const paidComm = commissions
        .filter((c: any) => c.status === "paid")
        .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

      setMetrics({
        totalReferrals: candidates.length,
        activeReferrals: candidates.length - deployed,
        deployedCandidates: deployed,
        pendingCommission: pendingComm,
        paidCommission: paidComm,
      });
    } catch (error) {
      console.error("Failed to load agent dashboard metrics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <PageMeta
        title="Agent Portal Dashboard | DeployX"
        description="Overseas sourcing agent candidate referrals and commission overview."
      />
      <PageBreadcrumb pageTitle="Agent Portal Dashboard" />

      {/* Welcome Banner */}
      <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50/40 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          Welcome, {user?.name || "Agent Partner"}
        </h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Track your candidate pipeline, status milestones, and commission disbursements in real time.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Sourced</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            {metrics.totalReferrals}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Candidates registered</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">In Pipeline</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            {metrics.activeReferrals}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Interview/Medical/Visa</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Deployed</span>
            <span className="p-1.5 rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            {metrics.deployedCandidates}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Successfully placed abroad</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Commissions Paid</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            ${metrics.paidCommission.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Pending: ${metrics.pendingCommission.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <Link
          to="/agent/candidates"
          className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 dark:border-white/5 dark:bg-white/3 dark:hover:border-brand-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Referred Candidates
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Submit new candidate referrals or review vetting and medical statuses.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/agent/commissions"
          className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 dark:border-white/5 dark:bg-white/3 dark:hover:border-brand-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Commissions Ledger
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  View payment vouchers, release dates, and payout breakdowns.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
          </div>
        </Link>
      </div>
    </>
  );
}
