import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Send, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink,
  Search,
  Eye,
  Check
} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router";

interface Signature {
  signerType: "candidate" | "employer" | "agent" | "staff";
  signedAt?: string;
  signatureUrl?: string;
}

interface Contract {
  _id: string;
  templateId?: { _id: string; name: string; type?: string };
  candidateId?: { _id: string; firstName: string; lastName: string; passportNumber?: string; phone?: string };
  employerId?: { _id: string; companyName: string; country?: string };
  demandId?: { _id: string; trackingNumber: string; profession: string; country?: string };
  signatureStatus: "draft" | "sent" | "signed_candidate" | "signed_employer" | "fully_signed";
  signatures: Signature[];
  pdfUrl?: string;
  createdAt: string;
}

interface Template {
  _id: string;
  name: string;
  type?: string;
  description?: string;
  templateBody?: string;
}

interface CandidateOption {
  _id: string;
  firstName: string;
  lastName: string;
  passportNumber?: string;
}

interface DemandOption {
  _id: string;
  trackingNumber: string;
  profession: string;
  employerName?: string;
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [candidates, setCandidates] = useState<CandidateOption[]>([]);
  const [demands, setDemands] = useState<DemandOption[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"contracts" | "templates">("contracts");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    templateId: "",
    candidateId: "",
    demandId: "",
  });

  // Template Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchContracts();
    fetchTemplates();
    fetchDropdownOptions();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contracts");
      if (res.data?.success) {
        setContracts(res.data.data || []);
      }
    } catch (err: any) {
      console.error("Failed to load contracts:", err);
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/contracts/templates");
      if (res.data?.success) {
        setTemplates(res.data.data || []);
        if (res.data.data?.length > 0 && !formData.templateId) {
          setFormData((prev) => ({ ...prev, templateId: res.data.data[0]._id }));
        }
      }
    } catch (err: any) {
      console.error("Failed to load templates:", err);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const [candRes, demRes] = await Promise.all([
        api.get("/candidates?pageSize=50").catch(() => ({ data: { data: [] } })),
        api.get("/demands?pageSize=50").catch(() => ({ data: { data: [] } }))
      ]);
      if (candRes.data?.data) {
        setCandidates(Array.isArray(candRes.data.data) ? candRes.data.data : candRes.data.data.candidates || []);
      }
      if (demRes.data?.data) {
        setDemands(Array.isArray(demRes.data.data) ? demRes.data.data : demRes.data.data.demands || []);
      }
    } catch (err) {
      console.error("Failed to load dropdown options:", err);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.templateId || !formData.candidateId) {
      toast.error("Please select a template and candidate");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/contracts", formData);
      if (res.data?.success) {
        toast.success("Contract generated successfully!");
        setIsModalOpen(false);
        setFormData({ templateId: templates[0]?._id || "", candidateId: "", demandId: "" });
        fetchContracts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate contract");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendContract = async (id: string) => {
    try {
      const res = await api.post(`/contracts/${id}/send`);
      if (res.data?.success) {
        toast.success("Contract sent for signature!");
        fetchContracts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send contract");
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    try {
      const res = await api.delete(`/contracts/${id}`);
      if (res.data?.success) {
        toast.success("Contract deleted");
        fetchContracts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete contract");
    }
  };

  const copySignLink = (id: string) => {
    const link = `${window.location.origin}/sign/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Signing link copied to clipboard!");
  };

  // Filter contracts
  const filteredContracts = contracts.filter((c) => {
    const candidateName = `${c.candidateId?.firstName || ""} ${c.candidateId?.lastName || ""}`.toLowerCase();
    const employerName = (c.employerId?.companyName || "").toLowerCase();
    const profession = (c.demandId?.profession || "").toLowerCase();
    const matchesSearch = candidateName.includes(searchTerm.toLowerCase()) || 
                          employerName.includes(searchTerm.toLowerCase()) ||
                          profession.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.signatureStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = contracts.length;
  const draftCount = contracts.filter((c) => c.signatureStatus === "draft").length;
  const sentCount = contracts.filter((c) => c.signatureStatus === "sent").length;
  const signedCount = contracts.filter((c) => c.signatureStatus === "fully_signed").length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "fully_signed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3" /> Fully Signed
          </span>
        );
      case "signed_candidate":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <Clock className="w-3 h-3" /> Signed (Candidate)
          </span>
        );
      case "signed_employer":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Clock className="w-3 h-3" /> Signed (Employer)
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <Clock className="w-3 h-3" /> Sent for Signature
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <AlertCircle className="w-3 h-3" /> Draft
          </span>
        );
    }
  };

  return (
    <>
      <PageMeta title="Contracts & Agreements | DeployX" description="Manage deployment contracts and digital signatures" />
      <PageBreadcrumb pageTitle="Contracts & Agreements" />

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Contracts</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{totalCount}</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Drafts</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{draftCount}</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Awaiting Signatures</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">{sentCount}</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fully Signed</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-green-600 dark:text-green-400">{signedCount}</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header Bar */}
        <div className="flex flex-col gap-3 p-3.5 border-b border-gray-100 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("contracts")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "contracts"
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              All Contracts ({contracts.length})
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "templates"
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              Templates ({templates.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "contracts" && (
              <>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate, employer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500 w-44 sm:w-56"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 px-2.5 text-xs border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-hidden"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="signed_candidate">Signed (Candidate)</option>
                  <option value="signed_employer">Signed (Employer)</option>
                  <option value="fully_signed">Fully Signed</option>
                </select>
              </>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Issue Contract
            </button>
          </div>
        </div>

        {/* Tab 1: Contracts Table */}
        {activeTab === "contracts" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-white/3 dark:text-gray-400">
                  <th className="px-3.5 py-2">Contract / Candidate</th>
                  <th className="px-3.5 py-2">Employer & Job</th>
                  <th className="px-3.5 py-2">Template</th>
                  <th className="px-3.5 py-2">Status</th>
                  <th className="px-3.5 py-2">Signatures</th>
                  <th className="px-3.5 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">Loading contracts...</td>
                  </tr>
                ) : filteredContracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No contracts found. Click <strong>Issue Contract</strong> to generate your first agreement.
                    </td>
                  </tr>
                ) : (
                  filteredContracts.map((c) => {
                    const hasCandSign = c.signatures?.some((s) => s.signerType === "candidate");
                    const hasEmpSign = c.signatures?.some((s) => s.signerType === "employer");

                    return (
                      <tr key={c._id} className="hover:bg-gray-50/70 transition-colors dark:hover:bg-white/2">
                        {/* Candidate */}
                        <td className="px-3.5 py-2.5">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {c.candidateId ? `${c.candidateId.firstName} ${c.candidateId.lastName}` : "Unassigned Candidate"}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                            Passport: {c.candidateId?.passportNumber || "N/A"}
                          </div>
                        </td>

                        {/* Employer & Job */}
                        <td className="px-3.5 py-2.5">
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {c.employerId?.companyName || "Unknown Employer"}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {c.demandId?.profession || "General Deployment"}
                          </div>
                        </td>

                        {/* Template */}
                        <td className="px-3.5 py-2.5 text-gray-600 dark:text-gray-400">
                          {c.templateId?.name || "Standard Agreement"}
                        </td>

                        {/* Status */}
                        <td className="px-3.5 py-2.5">
                          {renderStatusBadge(c.signatureStatus)}
                        </td>

                        {/* Signatures Progress */}
                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2">
                            <span 
                              title={hasCandSign ? "Candidate has signed" : "Candidate signature pending"}
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                hasCandSign 
                                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                                  : "bg-gray-100 text-gray-400 dark:bg-white/5"
                              }`}
                            >
                              {hasCandSign && <Check className="w-2.5 h-2.5" />} Candidate
                            </span>
                            <span 
                              title={hasEmpSign ? "Employer has signed" : "Employer signature pending"}
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                hasEmpSign 
                                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                                  : "bg-gray-100 text-gray-400 dark:bg-white/5"
                              }`}
                            >
                              {hasEmpSign && <Check className="w-2.5 h-2.5" />} Employer
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3.5 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* Copy Public Link */}
                            <button
                              onClick={() => copySignLink(c._id)}
                              title="Copy Signing URL"
                              className="p-1 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded dark:hover:bg-white/5 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Open Public Sign Page */}
                            <Link
                              to={`/sign/${c._id}`}
                              target="_blank"
                              title="Open Signature Pad"
                              className="p-1 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded dark:hover:bg-white/5 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {/* Send For Signature */}
                            {c.signatureStatus === "draft" && (
                              <button
                                onClick={() => handleSendContract(c._id)}
                                title="Send for Signature"
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded dark:bg-brand-500/10 dark:hover:bg-brand-500/20 transition-colors"
                              >
                                <Send className="w-3 h-3" /> Send
                              </button>
                            )}

                            {/* Download PDF */}
                            <a
                              href={`/api/v1/contracts/${c._id}/pdf`}
                              target="_blank"
                              rel="noreferrer"
                              title="Download PDF"
                              className="p-1 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded dark:hover:bg-white/5 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteContract(c._id)}
                              title="Delete"
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Templates List */}
        {activeTab === "templates" && (
          <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl) => (
              <div 
                key={tpl._id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-white/2 hover:border-brand-200 dark:hover:border-brand-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300 uppercase">
                      {tpl.type || "Standard"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{tpl.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {tpl.description || "Default contractual template for overseas recruitment deployment."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, templateId: tpl._id }));
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-white bg-brand-500 rounded hover:bg-brand-600 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Issue Contract */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Issue New Contract</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="mt-4 space-y-3.5">
              {/* Select Template */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contract Template *
                </label>
                <select
                  required
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500"
                >
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Select Candidate */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate *
                </label>
                <select
                  required
                  value={formData.candidateId}
                  onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500"
                >
                  <option value="">Select a candidate</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName} ({c.passportNumber || "No Passport"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Job Demand */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Demand / Employer
                </label>
                <select
                  value={formData.demandId}
                  onChange={(e) => setFormData({ ...formData, demandId: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-transparent dark:border-gray-800 dark:text-white focus:outline-hidden focus:border-brand-500"
                >
                  <option value="">Select job demand (optional)</option>
                  {demands.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.trackingNumber} - {d.profession} ({d.employerName || "Employer"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Generating..." : "Generate Contract"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Template Preview */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{previewTemplate.name}</h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Template Preview</span>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-white/2 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed border border-gray-200/60 dark:border-gray-800">
              {previewTemplate.templateBody || 
`EMPLOYMENT AGREEMENT

This Agreement is made between:
Employer: {{employer.companyName}}
Candidate: {{candidate.firstName}} {{candidate.lastName}} (Passport: {{candidate.passportNumber}})
Position: {{demand.profession}}

Terms & Conditions:
1. Salary & Benefits as mutually agreed upon in the Job Demand.
2. Deployment duration: 2 Years renewable.
3. Airfare, accommodation, and medical insurance provided by employer.

Signatures:
Candidate: _______________________
Employer:  _______________________`}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
