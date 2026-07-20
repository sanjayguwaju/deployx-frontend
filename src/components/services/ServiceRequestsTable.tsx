import { useEffect, useState, useMemo } from "react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../ui/badge/Badge";
import api from "../../api/axios";
import { Pagination } from "../ui/pagination";
import { FormModal } from "../ui/modal/FormModal";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { Can } from "../../context/AbilityContext";
import { Edit, Trash2 } from "lucide-react";
import Select from "../../components/form/Select";

interface ServiceRequest {
  _id: string;
  trackingNumber: string;
  serviceType: string;
  applicantName: string;
  applicantPhone?: string;
  description?: string;
  status: string;
  priority: string;
}

interface SRFormData {
  serviceType: string;
  applicantName: string;
  applicantPhone: string;
  description: string;
  priority: string;
}

const SERVICE_TYPES = [
  "Business Registration",
  "Vital Registration",
  "Recommendation Letter",
  "Citizenship Certificate",
  "Land Transfer",
  "Building Permit",
  "Other",
];

function ServiceRequestForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initialData?: Partial<SRFormData>;
  onSubmit: (data: SRFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<SRFormData>({
    serviceType: initialData?.serviceType || "",
    applicantName: initialData?.applicantName || "",
    applicantPhone: initialData?.applicantPhone || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "normal",
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Service Type <span className="text-red-500">*</span></label>
          <Select required value={form.serviceType} onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))} className={inputClass}>
            <option value="">Select service type...</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <Select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))} className={inputClass}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
        <div>
          <label className={labelClass}>Applicant Name <span className="text-red-500">*</span></label>
          <input type="text" required value={form.applicantName} onChange={(e) => setForm((p) => ({ ...p, applicantName: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Applicant Phone</label>
          <input type="text" value={form.applicantPhone} onChange={(e) => setForm((p) => ({ ...p, applicantPhone: e.target.value }))} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description / Remarks</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">{isSubmitting ? "Saving..." : "Save Request"}</button>
      </div>
    </form>
  );
}

export default function ServiceRequestsTable() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/service-requests?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setRequests(Array.isArray(data) ? data : data.requests || data.data || []);
        if (response.data.meta) setMeta(response.data.meta);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(currentPage); }, [currentPage]);

  const handleFormSubmit = async (data: SRFormData) => {
    try {
      setIsSubmitting(true);
      if (selected) {
        await api.put(`/service-requests/${selected._id}`, data);
      } else {
        await api.post("/service-requests", data);
      }
      setIsFormOpen(false);
      fetchRequests(currentPage);
    } catch (err: any) {
      alert("Error saving request: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/service-requests/${selected._id}`);
      setIsDeleteOpen(false);
      fetchRequests(currentPage);
    } catch (err: any) {
      alert("Error deleting request: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<ServiceRequest>();

  const columns = useMemo(() => [
    columnHelper.accessor("trackingNumber", {
      header: "Tracking No.",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("serviceType", {
      header: "Service Type",
    }),
    columnHelper.accessor("applicantName", {
      header: "Applicant",
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge size="sm" color={status === "completed" || status === "approved" ? "success" : status === "rejected" ? "error" : "warning"}>
            {status.replace(/_/g, " ")}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const req = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="service_requests">
              <button 
                onClick={() => { setSelected(req); setIsFormOpen(true); }}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="service_requests">
              <button 
                onClick={() => { setSelected(req); setIsDeleteOpen(true); }}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </Can>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading) return <div className="p-4 text-gray-500">Loading requests...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Service Requests</h3>
          <Can I="create" a="service_requests">
            <button onClick={() => { setSelected(null); setIsFormOpen(true); }} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
              New Request
            </button>
          </Can>
        </div>
        <DataTable table={table} isLoading={loading} />
        <div className="border-t border-gray-100 p-4 dark:border-white/5">
          <Pagination currentPage={currentPage} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.pageSize} onPageChange={setCurrentPage} />
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selected ? "Edit Service Request" : "New Service Request"}>
        <ServiceRequestForm initialData={selected || undefined} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} isSubmitting={isSubmitting} />
      </FormModal>

      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isDeleting={isSubmitting} title="Delete Service Request" message={`Delete service request ${selected?.trackingNumber}?`} />
    </>
  );
}
