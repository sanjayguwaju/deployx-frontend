import React, { useState } from "react";
import { Link } from "react-router";
import api from "../../api/axios";

export default function RegisterMunicipality() {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/onboarding/register", formData);
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register municipality");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Register Workspace</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create a dedicated environment for your municipality.
          </p>
        </div>

        {success ? (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 flex flex-col gap-2" role="alert">
            <span className="font-bold text-lg">Registration Successful!</span>
            <span>Your workspace is currently pending verification by our administration team. You will be notified once it is approved and ready for use.</span>
            <Link to="/signin" className="mt-4 inline-block font-medium underline">Return to Login</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Municipality Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Kathmandu Metropolitan City"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subdomain</label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="subdomain"
                    required
                    value={formData.subdomain}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-l-md text-sm border-gray-300 bg-gray-50 text-gray-900 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="kathmandu"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 text-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400">
                    .demo.com
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin Name</label>
                <input
                  type="text"
                  name="adminName"
                  required
                  value={formData.adminName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  required
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin Password</label>
                <input
                  type="password"
                  name="adminPassword"
                  required
                  value={formData.adminPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:outline-none focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-600 dark:hover:bg-brand-700 dark:focus:ring-brand-800"
            >
              {loading ? "Registering..." : "Create Workspace"}
            </button>
            <div className="text-center mt-4">
              <Link to="/signin" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
                Already have a workspace? Log in.
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
