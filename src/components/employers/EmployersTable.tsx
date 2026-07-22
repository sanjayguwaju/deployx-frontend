import { useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Building, Mail, Phone } from "lucide-react";
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
import { EmployerForm, EmployerFormData } from "./EmployerForm";
import { Can } from "../../context/AbilityContext";

interface ContactPerson {
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
}

interface Employer {
  id: string;
  _id: string;
  companyName: string;
  country: string;
  logoUrl?: string;
  industry?: string;
  contactPersons: ContactPerson[];
  paymentStatus?: "good_standing" | "overdue" | "suspended";
}

export default function EmployersTable() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  const fetchEmployers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/employers?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setEmployers(Array.isArray(data) ? data : data.employers || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load employers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers(currentPage);
  }, [currentPage]);

  const handleAddClick = () => {
    setSelectedEmployer(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (employer: Employer) => {
    setSelectedEmployer(employer);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (employer: Employer) => {
    setSelectedEmployer(employer);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: EmployerFormData) => {
    try {
      setIsSubmitting(true);
      
      if (selectedEmployer) {
        await api.put(`/employers/${selectedEmployer._id}`, data);
      } else {
        await api.post("/employers", data);
      }
      setIsFormOpen(false);
      fetchEmployers(currentPage);
    } catch (err: any) {
      alert("Error saving employer: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployer) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/employers/${selectedEmployer._id}`);
      setIsDeleteOpen(false);
      fetchEmployers(currentPage);
    } catch (err: any) {
      alert("Error deleting employer: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Employer>();

  const columns = useMemo(() => [
    columnHelper.accessor("companyName", {
      header: "Company Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {info.row.original.logoUrl ? (
              <img src={info.row.original.logoUrl} alt={info.getValue()} className="object-cover w-full h-full" />
            ) : (
              <Building className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <span className="block font-medium text-gray-800 dark:text-white/90">
              {info.getValue()}
            </span>
            {info.row.original.industry && (
              <span className="block text-xs text-gray-500">{info.row.original.industry}</span>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => (
        <Badge color="info" size="sm">
          {info.getValue() || "N/A"}
        </Badge>
      ),
    }),
    columnHelper.accessor("contactPersons", {
      header: "Primary Contact",
      cell: (info) => {
        const contacts = info.getValue() || [];
        if (contacts.length === 0) return "-";
        const primary = contacts[0];
        return (
          <div className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-800 dark:text-white/80">{primary.name}</span>
            {primary.email && (
              <span className="flex items-center gap-1 text-xs mt-0.5">
                <Mail className="w-3 h-3" /> {primary.email}
              </span>
            )}
            {primary.phone && (
              <span className="flex items-center gap-1 text-xs mt-0.5">
                <Phone className="w-3 h-3" /> {primary.phone}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("paymentStatus", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue() || "good_standing";
        const colors: Record<string, "success" | "warning" | "error"> = {
          good_standing: "success",
          overdue: "warning",
          suspended: "error",
        };
        return (
          <Badge color={colors[status]} size="sm">
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const employer = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="employers">
              <button 
                onClick={() => handleEditClick(employer)}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit Employer"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="employers">
              <button 
                onClick={() => handleDeleteClick(employer)}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete Employer"
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
    data: employers,
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
          Employers & Partners
        </h3>
        <Can I="create" a="employers">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            Add Employer
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
        title={selectedEmployer ? "Edit Employer" : "Add Employer"}
      >
        <EmployerForm
          initialData={selectedEmployer || undefined}
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
        title="Delete Employer"
        message={`Are you sure you want to delete ${selectedEmployer?.companyName}?`}
      />
    </>
  );
}
