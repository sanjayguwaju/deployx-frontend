import { useEffect, useState } from "react";
import { UserPlus, CheckCircle2, XCircle, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Badge from "../../components/ui/badge/Badge";
import { FormModal } from "../../components/ui/modal/FormModal";
import Loader from "../../components/common/Loader";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  profession: string;
  status: string;
  isVerified: boolean;
  passportNumber?: string;
  phone?: string;
  createdAt: string;
}

export default function AgentCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
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
      setLoading(true);
      const response = await api.get("/portals/agent/candidates");
      if (response.data?.success) {
        setCandidates(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load referred candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/portals/agent/candidates", formData);
      toast.success("Candidate referral submitted successfully!");
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passportNumber: "",
        profession: "",
      });
      fetchCandidates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit referral");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      (c.profession && c.profession.toLowerCase().includes(term)) ||
      (c.passportNumber && c.passportNumber.toLowerCase().includes(term))
    );
  });

  return (
    <>
      <PageMeta
        title="My Candidate Referrals | DeployX"
        description="Overseas candidates referred by sourcing agent."
      />
      <PageBreadcrumb pageTitle="Referred Candidates" />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Referred Candidates
            </h3>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              {candidates.length} Total
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 h-8 text-xs shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Refer Candidate</span>
            </Button>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : filteredCandidates.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">
            {searchTerm ? "No candidates match your search." : "No candidate referrals recorded yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2.5">Candidate</th>
                  <th className="px-4 py-2.5">Profession</th>
                  <th className="px-4 py-2.5">Passport</th>
                  <th className="px-4 py-2.5">Referred On</th>
                  <th className="px-4 py-2.5">Pipeline Status</th>
                  <th className="px-4 py-2.5">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-white/90">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                      {candidate.profession || "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-gray-400">
                      {candidate.passportNumber || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        color={
                          candidate.status === "deployed" || candidate.status === "completed"
                            ? "success"
                            : candidate.status === "rejected"
                            ? "error"
                            : "info"
                        }
                        size="sm"
                      >
                        {(candidate.status || "registered").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      {candidate.isVerified ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refer Candidate Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Refer New Candidate"
        description="Submit candidate details to initiate agency vetting and document processing."
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Ramesh"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Thapa"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ramesh@example.com"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="phone">Mobile / WhatsApp *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+977-9800000000"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
                placeholder="e.g. PA0192834"
                className="h-9 text-xs font-mono"
              />
            </div>
            <div>
              <Label htmlFor="profession">Target Profession / Skill *</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
                placeholder="e.g. Electrician, Welder, Driver"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Referral"}
            </Button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
