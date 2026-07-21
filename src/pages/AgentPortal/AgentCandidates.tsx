import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AgentCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    profession: "",
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/portals/agent/candidates`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCandidates(response.data.data);
    } catch (error) {
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/portals/agent/candidates`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Candidate referred successfully!");
      setIsModalOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", passportNumber: "", profession: "" });
      fetchCandidates();
    } catch (error) {
      toast.error("Failed to submit candidate");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Referrals</h2>
          <p className="text-sm text-gray-500">Track the candidates you have sourced for the agency.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded font-medium hover:bg-brand-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Submit Referral
        </button>
      </div>

      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-gray-100 dark:border-strokedark overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-brand-500"></div></div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No candidates referred yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-meta-4 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-strokedark">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Profession</th>
                <th className="p-4 font-semibold">Submitted On</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Verified</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate._id} className="border-b border-gray-100 dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{candidate.firstName} {candidate.lastName}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{candidate.profession}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(candidate.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                      candidate.status === 'deployed' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {candidate.isVerified ? (
                      <span className="text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span>
                    ) : (
                      <span className="text-orange-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-boxdark rounded-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Submit New Referral</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport Number *</label>
                <input required type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profession / Trade *</label>
                <input required type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded font-medium hover:bg-brand-700 transition">
                  Submit Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
