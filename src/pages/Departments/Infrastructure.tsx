import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import ApprovalTimeline from "../../components/common/ApprovalTimeline";
import ApprovalBadge from "../../components/common/ApprovalBadge";
import { FormModal } from "../../components/ui/modal/FormModal";
import Select from "../../components/form/Select";

interface InfraProject {
  _id: string;
  name: string;
  wardId?: { _id: string; wardNumber: number };
  budget: number;
  contractor: string;
  status: "planned" | "ongoing" | "completed" | "delayed";
  percentComplete: number;
  fiscalYear?: string;
  registrationNumber?: string;
  projectSector?: string;
  implementationMedium?: string;
  committeeContractorName?: string;
  municipalityBudget?: number;
  costSharingBudget?: number;
  contingencyBudget?: number;
  agreementDateBs?: string;
  targetCompletionDateBs?: string;
  startDateBs?: string;
  targetedGroup?: string;
  benefitedHouseholds?: number;
  paymentStatus?: string;
  monitoringCommittee?: string;
}

interface InfraPayment {
  _id: string;
  amountNpr: number;
  status: "pending" | "approved" | "paid" | "rejected";
  createdAt: string;
  paidAtBs?: string;
  approvalId?: any;
}

export default function Infrastructure() {
  const [projects, setProjects] = useState<InfraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<InfraProject | null>(null);
  const [payments, setPayments] = useState<InfraPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);
  const [implementationMedium, setImplementationMedium] = useState("upabhokta_samiti");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/infra-projects");
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWards = useCallback(async () => {
    try {
      const res = await api.get("/wards");
      if (res.data.success) {
        setWards(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchPayments = useCallback(async (projectId: string) => {
    setPaymentsLoading(true);
    try {
      const res = await api.get(`/infra-projects/${projectId}/payments`);
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchWards();
  }, [fetchProjects, fetchWards]);

  useEffect(() => {
    if (selectedProject) {
      fetchPayments(selectedProject._id);
    }
  }, [selectedProject, fetchPayments]);

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const wardId = formData.get("wardId");
    
    // Parse budgets
    const municipalityBudget = Number(formData.get("municipalityBudget") || 0);
    const costSharingBudget = Number(formData.get("costSharingBudget") || 0);
    const contingencyBudget = Number(formData.get("contingencyBudget") || 0);
    const totalBudget = municipalityBudget + costSharingBudget + contingencyBudget;

    const data = {
      name: formData.get("name"),
      wardId: wardId ? wardId : undefined,
      budget: totalBudget, // Calculated budget
      contractor: formData.get("committeeContractorName"), // Fallback to existing field
      status: formData.get("status"),
      fiscalYear: formData.get("fiscalYear"),
      registrationNumber: formData.get("registrationNumber"),
      projectSector: formData.get("projectSector"),
      implementationMedium: formData.get("implementationMedium"),
      committeeContractorName: formData.get("committeeContractorName"),
      municipalityBudget,
      costSharingBudget,
      contingencyBudget,
      agreementDateBs: formData.get("agreementDateBs"),
      targetCompletionDateBs: formData.get("targetCompletionDateBs"),
      startDateBs: formData.get("startDateBs"),
      targetedGroup: formData.get("targetedGroup"),
      benefitedHouseholds: Number(formData.get("benefitedHouseholds") || 0),
      paymentStatus: formData.get("paymentStatus"),
      monitoringCommittee: formData.get("monitoringCommittee"),
    };
    try {
      await api.post("/infra-projects", data);
      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to create project", err);
      alert("Failed to create project.");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      amountNpr: Number(formData.get("amountNpr") || 0),
    };
    try {
      await api.post(`/infra-projects/${selectedProject._id}/payments`, data);
      setIsPaymentModalOpen(false);
      fetchPayments(selectedProject._id);
    } catch (err) {
      console.error("Failed to request payment", err);
      alert("Failed to request payment.");
    }
  };

  const projectsColumnHelper = createColumnHelper<InfraProject>();
  const projectsColumns = useMemo(() => [
    projectsColumnHelper.accessor("name", {
      header: "Project Name",
      cell: (info) => {
        const project = info.row.original;
        return (
          <div 
            className="font-medium text-brand-600 dark:text-brand-400 cursor-pointer hover:underline"
            onClick={() => setSelectedProject(project)}
          >
            {info.getValue()}
          </div>
        );
      },
    }),
    projectsColumnHelper.accessor("wardId", {
      header: "Ward",
      cell: (info) => info.getValue() ? `Ward ${info.getValue()?.wardNumber}` : "Municipality-wide",
    }),
    projectsColumnHelper.accessor("budget", {
      header: "Budget (NPR)",
      cell: (info) => (
        <span className="text-right font-mono block">
          {info.getValue() ? info.getValue().toLocaleString() : "0"}
        </span>
      ),
    }),
    projectsColumnHelper.accessor("percentComplete", {
      header: "Progress",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${info.getValue() || 0}%` }}></div>
          </div>
          <span className="text-xs">{info.getValue() || 0}%</span>
        </div>
      ),
    }),
    projectsColumnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            status === "completed" ? "bg-green-100 text-green-700 border-green-200" :
            status === "ongoing" ? "bg-blue-100 text-blue-700 border-blue-200" :
            status === "delayed" ? "bg-red-100 text-red-700 border-red-200" :
            "bg-gray-100 text-gray-700 border-gray-200"
          }`}>
            {status.toUpperCase()}
          </span>
        );
      },
    }),
  ], []);

  const projectsTable = useReactTable({
    data: projects,
    columns: projectsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageMeta
        title="Infrastructure Department | Local Government Operating System"
        description="Infrastructure and Development module for LGOS."
      />
      <PageBreadcrumb pageTitle="Infrastructure & Development" />
      
      {selectedProject ? (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedProject(null)}
            className="text-sm text-brand-500 hover:underline flex items-center gap-1"
          >
            ← Back to Projects
          </button>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {selectedProject.name}
            </h3>
            <div className="flex gap-4 text-sm text-gray-500 mb-6">
              <span>Budget: NPR {selectedProject.budget?.toLocaleString() || '0'}</span>
              <span>•</span>
              <span>Status: {selectedProject.status.toUpperCase()}</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{selectedProject.percentComplete}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-brand-500 h-2.5 rounded-full" style={{ width: `${selectedProject.percentComplete}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payments Tab */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Payments</h4>
                  <Can I="create" a="InfraPayment">
                    <button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-2 py-1 text-xs font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
                    >
                      Request Payment
                    </button>
                  </Can>
                </div>
                
                {paymentsLoading ? (
                  <p className="text-sm text-gray-500">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="text-sm text-gray-500">No payments requested yet.</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map(payment => (
                      <div key={payment._id} className="p-3 border rounded-lg dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold dark:text-white">NPR {payment.amountNpr.toLocaleString()}</span>
                          <ApprovalBadge status={payment.status as any} />
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>Requested: {new Date(payment.createdAt).toLocaleDateString()}</span>
                          {payment.paidAtBs && <span>Paid on: {payment.paidAtBs}</span>}
                        </div>
                        {payment.approvalId && (
                          <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <ApprovalTimeline history={payment.approvalId?.history || []} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Milestones Tab (Placeholder for now) */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Milestones</h4>
                <p className="text-sm text-gray-500">Milestone tracking would be implemented here, similar to the payments tab.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Infrastructure Projects
            </h3>
            <Can I="create" a="InfraProject">
              <button 
                onClick={() => setIsProjectModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + New Project
              </button>
            </Can>
          </div>
          
          <DataTable table={projectsTable} isLoading={loading} />
        </div>
      )}

      <FormModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Create New Infrastructure Project" className="max-w-5xl w-[95vw]">
        <form onSubmit={handleProjectSubmit} className="space-y-6">
          
          {/* Basic Project Identifiers */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">1. Basic Project Identifiers (आधारभूत विवरण)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name (योजनाको नाम) *</label>
                <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Ward 3 Road Construction" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiscal Year (आर्थिक वर्ष) *</label>
                <Select name="fiscalYear" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="2080/81">2080/81</option>
                  <option value="2081/82">2081/82</option>
                  <option value="2082/83">2082/83</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number (योजना दर्ता नं.)</label>
                <input name="registrationNumber" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Sector (योजनाको क्षेत्र)</label>
                <Select name="projectSector" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="">Select Sector</option>
                  <option value="capital">Capital (Infrastructure)</option>
                  <option value="recurrent">Recurrent (Chalu)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward (वडा)</label>
                <Select name="wardId" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="">Municipality Wide</option>
                  {wards.map(w => (
                    <option key={w._id} value={w._id}>Ward {w.wardNumber}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Execution Mechanism */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">2. Execution Mechanism (कार्यान्वयन गर्ने निकाय)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Implementation Medium (कार्यान्वयन माध्यम)</label>
                <Select 
                  name="implementationMedium" 
                  value={implementationMedium} 
                  onChange={(e) => setImplementationMedium(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500"
                >
                  <option value="upabhokta_samiti">Upabhokta Samiti (उपभोक्ता समिति)</option>
                  <option value="contractor">Contractor (निर्माण व्यवसायी)</option>
                  <option value="amanat">Amanat (अमानत)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {implementationMedium === 'upabhokta_samiti' ? 'Committee Name (समितिको नाम)' : implementationMedium === 'contractor' ? 'Contractor Name (निर्माण व्यवसायीको नाम)' : 'Name (नाम)'}
                </label>
                <input name="committeeContractorName" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">3. Budget Breakdown (बजेट विवरण)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Municipality Budget (पालिकाको अनुदान)</label>
                <input name="municipalityBudget" type="number" min="0" defaultValue={0} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Sharing (जनश्रमदान)</label>
                <input name="costSharingBudget" type="number" min="0" defaultValue={0} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contingency (कन्टेन्जेन्सी)</label>
                <input name="contingencyBudget" type="number" min="0" defaultValue={0} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Dates & Milestones */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">4. Dates & Milestones (मितिहरु)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agreement Date (सम्झौता मिति - BS)</label>
                <input name="agreementDateBs" type="text" placeholder="YYYY-MM-DD" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date (कार्य सुरु गर्ने मिति - BS)</label>
                <input name="startDateBs" type="text" placeholder="YYYY-MM-DD" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Date (सम्पन्न गर्नुपर्ने मिति)</label>
                <input name="targetCompletionDateBs" type="text" placeholder="YYYY-MM-DD" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Beneficiaries & Targets */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">5. Beneficiaries & Targets (लक्ष्य र लाभान्वित)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Targeted Group (लक्षित वर्ग)</label>
                <Select name="targetedGroup" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="">Select Group</option>
                  <option value="general">General (सबै)</option>
                  <option value="women">Women (महिला)</option>
                  <option value="dalit">Dalit (दलित)</option>
                  <option value="janajati">Janajati (जनजाति)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benefited Households (लाभान्वित घरधुरी)</label>
                <input name="benefitedHouseholds" type="number" min="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          {/* Monitoring & Status */}
          <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white border-b pb-2">6. Monitoring & Status (अनुगमन र अवस्था)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Status (अवस्था)</label>
                <Select name="status" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="planned">Planned (योजनामा)</option>
                  <option value="ongoing">Ongoing (संचालनमा)</option>
                  <option value="completed">Completed (सम्पन्न)</option>
                  <option value="delayed">Delayed (ढिलाइ)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status (भुक्तानी अवस्था)</label>
                <Select name="paymentStatus" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                  <option value="">Select Status</option>
                  <option value="advance">Advance (पेश्की)</option>
                  <option value="first_installment">First Installment (पहिलो किस्ता)</option>
                  <option value="final_payment">Final Payment (अन्तिम भुक्तानी)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monitoring Committee (अनुगमन समिति)</label>
                <input name="monitoringCommittee" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save Project</button>
          </div>
        </form>
      </FormModal>

      <FormModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Request Contractor Payment" className="max-w-lg">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Amount (NPR) *</label>
            <input name="amountNpr" type="number" min="1" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 50000" />
            <p className="mt-1 text-xs text-gray-500">This will initiate a multi-tier approval request before funds are released.</p>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Request Approval</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
