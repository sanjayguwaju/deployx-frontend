import { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, User, Phone, Mail, FileText } from "lucide-react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../ui/badge/Badge";
import api from "../../api/axios";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { FormModal } from "../ui/modal/FormModal";
import { Pagination } from "../ui/pagination";
import { CandidateForm, CandidateFormData } from "./CandidateForm";
import { Can } from "../../context/AbilityContext";

interface Candidate {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  passportNumber?: string;
  phone?: string;
  email?: string;
  profession?: string;
  status: string;
  photoUrl?: string;
}

export default function CandidatesTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  const fetchCandidates = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/candidates?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setCandidates(Array.isArray(data) ? data : data.candidates || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(currentPage);
  }, [currentPage]);

  const handleAddClick = () => {
    setSelectedCandidate(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CandidateFormData) => {
    try {
      setIsSubmitting(true);
      
      // Get office id if needed for creation, we'll assume the backend handles it or we send a dummy
      const payload = { ...data, officeId: "64f1b2c3e4b0c1d2e3f4a5b6" }; 
      
      if (selectedCandidate) {
        await api.put(`/candidates/${selectedCandidate._id}`, payload);
      } else {
        await api.post("/candidates", payload);
      }
      setIsFormOpen(false);
      fetchCandidates(currentPage);
    } catch (err: any) {
      alert("Error saving candidate: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCandidate) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/candidates/${selectedCandidate._id}`);
      setIsDeleteOpen(false);
      fetchCandidates(currentPage);
    } catch (err: any) {
      alert("Error deleting candidate: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Candidate>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: "name",
      header: "Candidate Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {info.row.original.photoUrl ? (
              <img src={info.row.original.photoUrl} alt={info.getValue()} className="object-cover w-full h-full" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <span className="block font-medium text-gray-800 dark:text-white/90">
              {info.getValue()}
            </span>
            {info.row.original.profession && (
              <span className="block text-xs text-gray-500">{info.row.original.profession}</span>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("passportNumber", {
      header: "Passport",
      cell: (info) => (
        <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FileText className="w-4 h-4 text-gray-400" />
          {info.getValue() || "N/A"}
        </span>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Contact",
      cell: (info) => (
        <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
          {info.getValue() && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> {info.getValue()}
            </span>
          )}
          {info.row.original.email && (
            <span className="flex items-center gap-1 mt-0.5 text-xs">
              <Mail className="w-3 h-3" /> {info.row.original.email}
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue() || "registered";
        const colors: Record<string, "success" | "warning" | "error" | "info"> = {
          registered: "info",
          interview_scheduled: "warning",
          selected: "success",
          medical: "warning",
          visa_processing: "warning",
          ticket_booked: "success",
          deployed: "success",
          rejected: "error",
          blacklisted: "error",
        };
        return (
          <Badge color={colors[status] || "info"} size="sm">
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const candidate = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="candidates">
              <button 
                onClick={() => handleEditClick(candidate)}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit Candidate"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="candidates">
              <button 
                onClick={() => handleDeleteClick(candidate)}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete Candidate"
              >
                <Trash2 size={18} />
              </button>
            </Can>
          </div>
        );
      }
    })
  ], [isSubmitting]);

  const table = useReactTable({
    data: candidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          All Candidates
        </h3>
        <Can I="create" a="candidates">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            Add Candidate
          </button>
        </Can>
      </div>
      <DataTable table={table} isLoading={loading} />
      
      <div className="border-t border-gray-100 p-4 dark:border-white/5">
        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCandidate ? "Edit Candidate" : "Add Candidate"}
      >
        <CandidateForm
          initialData={selectedCandidate || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        title="Delete Candidate"
        message={`Are you sure you want to delete ${selectedCandidate?.firstName}?`}
      />
    </>
  );
}
