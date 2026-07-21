import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { useTenant } from "../../context/TenantContext";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

export default function CitizenTrack() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { branding } = useTenant();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return toast.error("Please enter a Tracking ID");

    setLoading(true);
    try {
      const response = await api.get(`/citizen/track?trackingId=${trackingId}`);
      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setResults({ complaints: [], serviceRequests: [], vitalEvents: [] });
        toast.error("No records found.");
      } else {
        toast.error("An error occurred while tracking.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {branding?.logoUrl ? (
                <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded" />
              ) : (
                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 font-bold">
                  {branding?.name ? branding.name.charAt(0).toUpperCase() : "P"}
                </div>
              )}
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                {branding?.name || "DeployX"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {branding?.name || "DeployX"} Citizen Portal
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Track your complaints, service requests, and vital events.
          </p>
        </div>

        <div className="mt-10">
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto overflow-hidden bg-white border border-gray-200 rounded-full shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter your Tracking ID"
              className="w-full px-6 py-4 text-gray-800 bg-transparent border-none focus:outline-hidden dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-8 text-white transition-colors bg-brand-500 hover:bg-brand-600 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {results && (
          <div className="mt-12 space-y-8">
            {results.complaints?.length === 0 && results.serviceRequests?.length === 0 && results.vitalEvents?.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No active records found for this ID.</p>
              </div>
            )}

            {results.vitalEvents?.length > 0 && (
              <div className="p-6 bg-white shadow-xs rounded-2xl dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">Vital Events Registration</h3>
                <ul className="space-y-3">
                  {results.vitalEvents.map((ve: any) => (
                    <li key={ve._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl dark:bg-gray-700/50">
                      <div>
                        <p className="font-medium text-gray-800 uppercase dark:text-white">{ve.eventType}</p>
                        <p className="text-sm text-gray-500">{new Date(ve.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        ve.status === 'approved' ? 'bg-green-100 text-green-800' :
                        ve.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ve.status.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Can similarly map complaints and serviceRequests if needed */}
          </div>
        )}
      </div>
    </div>
  );
}
