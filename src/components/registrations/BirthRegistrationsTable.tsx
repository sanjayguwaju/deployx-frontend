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
import { BirthRegistrationForm, BirthRegistrationFormData } from "./BirthRegistrationForm";
import { Can } from "../../context/AbilityContext";
import { Edit, Trash2 } from "lucide-react";

interface BirthRegistration {
  _id: string;
  registrationNumber: string;
  childName: string;
  dateOfBirthBs: string;
  fatherName?: string;
  status: "pending" | "verified" | "certificate_issued" | "rejected";
  createdAt: string;
}

export default function BirthRegistrationsTable() {
  const [registrations, setRegistrations] = useState<BirthRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get(`/registration/birth?page=${currentPage}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setRegistrations(Array.isArray(data) ? data : data.registrations || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage]);

  const handleAddClick = () => {
    setSelectedRegistration(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (reg: BirthRegistration) => {
    setSelectedRegistration(reg);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (reg: BirthRegistration) => {
    setSelectedRegistration(reg);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: BirthRegistrationFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedRegistration) {
        await api.put(`/registration/birth/${selectedRegistration._id}`, data);
      } else {
        // Need to add registrationDateBs
        const submitData = {
          ...data,
          registrationDateBs: new Date().toISOString().split('T')[0] // or get Nepali date
        };
        await api.post("/registration/birth", submitData);
      }
      setIsFormOpen(false);
      fetchRegistrations();
    } catch (err: any) {
      setError(err.message || "Failed to save registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRegistration) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/registration/birth/${selectedRegistration._id}`);
      setIsDeleteOpen(false);
      fetchRegistrations();
    } catch (err: any) {
      setError(err.message || "Failed to delete registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const columnHelper = createColumnHelper<BirthRegistration>();

  const columns = useMemo(() => [
    columnHelper.accessor("registrationNumber", {
      header: "Reg No.",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("childName", {
      header: "Child Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dateOfBirthBs", {
      header: "DOB (BS)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fatherName", {
      header: "Father's Name",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge
            size="sm"
            color={
              status === "verified" || status === "certificate_issued"
                ? "success"
                : status === "rejected"
                ? "error"
                : "warning"
            }
          >
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const reg = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="registration">
              <button 
                onClick={() => handleEditClick(reg)}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="registration">
              <button 
                onClick={() => handleDeleteClick(reg)}
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
    data: registrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Birth Registrations
        </h3>
        <Can I="create" a="registration">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            New Registration
          </button>
        </Can>
      </div>
      <div className="max-w-full overflow-x-auto">
        <DataTable table={table} isLoading={loading} />

        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedRegistration ? "Edit Birth Registration" : "New Birth Registration"}
      >
        <BirthRegistrationForm
          initialData={selectedRegistration || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Registration"
        message={`Are you sure you want to delete registration ${selectedRegistration?.registrationNumber}?`}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
