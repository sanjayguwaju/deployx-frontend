import { useState } from "react";
import { Link } from "react-router";
import { Server, ArrowRight, CheckCircle, Building } from "lucide-react";
import api from "../../api/axios";

export default function RegisterAgency() {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    plan: "pro", // Default selected plan
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate subdomain from agency name if subdomain hasn't been touched
    if (name === "name" && !formData.subdomain) {
      const generated = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Remove spaces and special chars
        .substring(0, 20);
      setFormData({ ...formData, name: value, subdomain: generated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/registration/tenant", formData);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `http://${formData.subdomain}.deployx.io/signin`;
        }, 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register agency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Left Column - Branding */}
      <div className="hidden md:flex w-full md:w-1/2 bg-brand-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-800/40 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 mb-16">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Deploy<span className="text-brand-500">X</span></span>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            The intelligent operating system for overseas recruitment.
          </h1>
          
          <p className="text-brand-100 text-lg mb-12 max-w-md">
            Join forward-thinking manpower agencies using DeployX to automate pipelines, manage compliance, and scale operations globally.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-white font-medium">Candidate CRM & Employer Profiles</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-white font-medium">Automated Medical & Visa Pipelines</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-white font-medium">Invoicing & Agent Commissions</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-brand-200 text-sm">
          &copy; {new Date().getFullYear()} DeployX Technologies.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Registration Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your agency workspace has been created successfully. We are redirecting you to your new dedicated dashboard...
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                http://{formData.subdomain}.deployx.io/signin
              </div>
              <div className="mt-8">
                <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Workspace</h2>
                <p className="text-gray-500 dark:text-gray-400">Create a dedicated SaaS environment for your recruitment agency.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Agency Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agency Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500 transition-colors"
                        placeholder="Global Manpower Pvt. Ltd."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workspace URL</label>
                    <div className="flex shadow-sm rounded-xl overflow-hidden">
                      <input
                        type="text"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        required
                        className="flex-1 min-w-0 block w-full px-4 py-3 border border-r-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500"
                        placeholder="globalmanpower"
                      />
                      <span className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm font-medium">
                        .deployx.io
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Administrator Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500"
                        placeholder="admin@agency.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="adminPhone"
                        value={formData.adminPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500"
                        placeholder="+977 9800000000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Plan</label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-brand-500"
                  >
                    <option value="starter">Starter - $49/month</option>
                    <option value="pro">Professional - $149/month</option>
                    <option value="enterprise">Enterprise - Custom</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Workspace...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Register & Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  )}
                </button>
                
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                  By registering, you agree to our <Link to="/terms" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
