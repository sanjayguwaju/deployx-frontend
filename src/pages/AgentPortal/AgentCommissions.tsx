import { useEffect, useState } from "react";
import { DollarSign, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import Loader from "../../components/common/Loader";

interface Commission {
  _id: string;
  candidateId: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

export default function AgentCommissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/portals/agent/commissions");
      if (response.data?.success) {
        setCommissions(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load commissions ledger");
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const totalPending = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <>
      <PageMeta
        title="Commission Ledger | DeployX"
        description="Overseas sourcing agent commission ledger and disbursement vouchers."
      />
      <PageBreadcrumb pageTitle="Commission Ledger" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Paid Out</span>
            <span className="p-1.5 rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            ${totalPaid.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Settled and disbursed to account</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Pending Approval / Payout</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
            ${totalPending.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">Awaiting candidate deployment or voucher processing</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Transaction History
            </h3>
          </div>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            {commissions.length} Records
          </span>
        </div>

        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : commissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            No commission transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Settlement Date</th>
                  <th className="px-4 py-2.5">Reference / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {commissions.map((comm) => (
                  <tr
                    key={comm._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-white/90">
                      ${comm.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        color={
                          comm.status === "paid"
                            ? "success"
                            : comm.status === "pending"
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {comm.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                      {comm.paidAt ? new Date(comm.paidAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {comm.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
