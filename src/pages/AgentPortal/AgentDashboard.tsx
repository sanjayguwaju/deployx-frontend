import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

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
      // In a full implementation, we'd have a specific /dashboard endpoint for agents.
      // For now, we fetch candidates and commissions to aggregate the data on the client.
      const [candidatesRes, commissionsRes] = await Promise.all([
        axios.get(`${API_URL}/portals/agent/candidates?pageSize=100`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`${API_URL}/portals/agent/commissions`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);

      const candidates = candidatesRes.data.data;
      const commissions = commissionsRes.data.data;

      const deployed = candidates.filter((c: any) => c.status === "completed" || c.status === "deployed").length;
      
      const pendingComm = commissions
        .filter((c: any) => c.status === "pending")
        .reduce((sum: number, c: any) => sum + c.amount, 0);
        
      const paidComm = commissions
        .filter((c: any) => c.status === "paid")
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      setMetrics({
        totalReferrals: candidates.length,
        activeReferrals: candidates.length - deployed,
        deployedCandidates: deployed,
        pendingCommission: pendingComm,
        paidCommission: paidComm,
      });

    } catch (error) {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h2>
        <p className="text-gray-500 mt-1">Here is the latest overview of your referrals and commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-sm border border-gray-100 dark:border-strokedark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Referrals</h3>
            <span className="text-brand-500 bg-brand-50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalReferrals}</p>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-sm border border-gray-100 dark:border-strokedark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Deployed</h3>
            <span className="text-green-500 bg-green-50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.deployedCandidates}</p>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-sm border border-gray-100 dark:border-strokedark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Comm.</h3>
            <span className="text-orange-500 bg-orange-50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${metrics.pendingCommission.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-sm border border-gray-100 dark:border-strokedark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Paid Comm.</h3>
            <span className="text-brand-500 bg-brand-50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-brand-600">${metrics.paidCommission.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-gray-100 dark:border-strokedark p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => window.location.href = '/agent/candidates'} className="bg-brand-600 text-white px-6 py-2 rounded font-medium hover:bg-brand-700 transition">
            Submit New Candidate
          </button>
          <button onClick={() => window.location.href = '/agent/commissions'} className="bg-gray-100 text-gray-800 dark:bg-meta-4 dark:text-white px-6 py-2 rounded font-medium hover:bg-gray-200 dark:hover:bg-strokedark transition">
            View Commission Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
