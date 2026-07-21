import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface Commission {
  _id: string;
  candidateId: string; // Ideally populated
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
      const response = await axios.get(`${API_URL}/portals/agent/commissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCommissions(response.data.data);
    } catch (error) {
      toast.error("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Commission Ledger</h2>
        <p className="text-sm text-gray-500">Track your pending and paid commissions for successful deployments.</p>
      </div>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-gray-100 dark:border-strokedark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>
        ) : commissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No commissions recorded yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-meta-4 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-strokedark">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Paid Date</th>
                <th className="p-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(commission => (
                <tr key={commission._id} className="border-b border-gray-100 dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition">
                  <td className="p-4 text-gray-900 dark:text-white font-medium">{new Date(commission.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">${commission.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      commission.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {commission.paidAt ? new Date(commission.paidAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
                    {commission.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
