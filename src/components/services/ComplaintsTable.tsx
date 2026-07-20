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

interface Complaint {
  _id: string;
  trackingNumber: string;
  subject: string;
  description?: string;
  complainantName?: string;
  complainantPhone?: string;
  isAnonymous: boolean;
  status: string;
  priority: string;
}

interface ComplaintFormData {
  subject: string;
  description: string;
  complainantName: string;
  complainantPhone: string;
  priority: string;
  isAnonymous: boolean;
}

function ComplaintForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initialData?: Partial<ComplaintFormData>;
  onSubmit: (data: ComplaintFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<ComplaintFormData>({
    subject: initialData?.subject || "",
    description: initialData?.description || "",
    complainantName: initialData?.complainantName || "",
    complainantPhone: initialData?.complainantPhone || "",
    priority: initialData?.priority || "normal",
    isAnonymous: initialData?.isAnonymous || false,
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className={labelClass}>Subject <span className="text-red-500">*</span></label>
        <input type="text" required value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Description <span className="text-red-500">*</span></label>
        <textarea required rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Complainant Name</label>
          <input type="text" value={form.complainantName} onChange={(e) => setForm((p) => ({ ...p, complainantName: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Complainant Phone</label>
          <input type="text" value={form.complainantPhone} onChange={(e) => setForm((p) => ({ ...p, complainantPhone: e.target.value }))} className={inputClass} />
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
        <div className="flex items-center mt-6">
          <input type="checkbox" id="isAnonymous" checked={form.isAnonymous} onChange={(e) => setForm((p) => ({ ...p, isAnonymous: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-brand-500" />
          <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Submit Anonymously</label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">{isSubmitting ? "Saving..." : "Save Complaint"}</button>
      </div>
    </form>
  );
}

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComplaints = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/complaints?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setComplaints(Array.isArray(data) ? data : data.complaints || data.data || []);
        if (response.data.meta) setMeta(response.data.meta);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(currentPage); }, [currentPage]);

  const handleFormSubmit = async (data: ComplaintFormData) => {
    try {
      setIsSubmitting(true);
      if (selected) {
        await api.put(`/complaints/${selected._id}`, data);
      } else {
        await api.post("/complaints", data);
      }
      setIsFormOpen(false);
      fetchComplaints(currentPage);
    } catch (err: any) {
      alert("Error saving complaint: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/complaints/${selected._id}`);
      setIsDeleteOpen(false);
      fetchComplaints(currentPage);
    } catch (err: any) {
      alert("Error deleting complaint: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Complaint>();

  const columns = useMemo(() => [
    columnHelper.accessor("trackingNumber", {
      header: "Tracking No.",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
    }),
    columnHelper.display({
      id: "complainant",
      header: "Complainant",
      cell: (info) => {
        const comp = info.row.original;
        return comp.isAnonymous ? "Anonymous" : comp.complainantName || "-";
      },
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
          <Badge size="sm" color={status === "resolved" || status === "closed" ? "success" : status === "received" ? "primary" : "warning"}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const comp = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="complaints">
              <button 
                onClick={() => { setSelected(comp); setIsFormOpen(true); }}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="complaints">
              <button 
                onClick={() => { setSelected(comp); setIsDeleteOpen(true); }}
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
    data: complaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading) return <div className="p-4 text-gray-500">Loading complaints...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Citizen Complaints</h3>
          <Can I="create" a="complaints">
            <button onClick={() => { setSelected(null); setIsFormOpen(true); }} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
              New Complaint
            </button>
          </Can>
        </div>
        <DataTable table={table} isLoading={loading} />
        <div className="border-t border-gray-100 p-4 dark:border-white/5">
          <Pagination currentPage={currentPage} totalPages={meta.totalPages} totalItems={meta.total} pageSize={meta.pageSize} onPageChange={setCurrentPage} />
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selected ? "Edit Complaint" : "New Complaint"}>
        <ComplaintForm initialData={selected || undefined} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} isSubmitting={isSubmitting} />
      </FormModal>

      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isDeleting={isSubmitting} title="Delete Complaint" message={`Delete complaint ${selected?.trackingNumber}?`} />
    </>
  );
}
