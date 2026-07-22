import { useEffect, useState, useMemo } from "react";
import { Trash2, Briefcase, Hash, Globe, Banknote } from "lucide-react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../ui/badge/Badge";
import api from "../../api/axios";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { Pagination } from "../ui/pagination";
import { Can } from "../../context/AbilityContext";
import { Link } from "react-router";

interface Demand {
  id: string;
  _id: string;
  trackingNumber: string;
  employerId: string;
  employerName?: string;
  country: string;
  profession: string;
  quantityRequired: number;
  salary?: { amount: number; currency: string };
  status: string;
}

export default function DemandsTable() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  const fetchDemands = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/demands?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setDemands(Array.isArray(data) ? data : data.demands || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load demands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDemand) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/demands/${selectedDemand._id}`);
      setIsDeleteOpen(false);
      fetchDemands(currentPage);
    } catch (err: any) {
      alert("Error deleting demand: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Demand>();

  const columns = useMemo(() => [
    columnHelper.accessor("trackingNumber", {
      header: "Job ID",
      cell: (info) => (
        <span className="flex items-center gap-2 font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
          <Hash className="w-4 h-4" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("profession", {
      header: "Position",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-800 dark:text-white/90">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("employerName", {
      header: "Employer",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() || "Unknown Employer"}
        </span>
      ),
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => (
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Globe className="w-4 h-4 text-gray-400" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("quantityRequired", {
      header: "Quota",
      cell: (info) => (
        <Badge color="primary" size="sm">
          {info.getValue()} Pax
        </Badge>
      ),
    }),
    columnHelper.accessor("salary", {
      header: "Salary",
      cell: (info) => {
        const salary = info.getValue();
        if (!salary || !salary.amount) return "-";
        return (
          <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
            <Banknote className="w-4 h-4" />
            {salary.currency} {salary.amount.toLocaleString()}
          </span>
        );
      }
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue() || "draft";
        const colors: Record<string, "success" | "warning" | "error" | "info"> = {
          draft: "info",
          pending_approval: "warning",
          approved: "success",
          rejected: "error",
          closed: "error",
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
        const demand = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="read" a="dashboard">
              <Link
                to={`/demands/${demand._id}/pipeline`}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="View Pipeline"
              >
                Pipeline
              </Link>
            </Can>
            <Can I="delete" a="demands">
              <button 
                onClick={() => handleDeleteClick(demand)}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete Demand"
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
    data: demands,
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
          Job Demands
        </h3>
        <Can I="create" a="demands">
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            Create Demand
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

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        title="Delete Job Demand"
        message={`Are you sure you want to delete Demand #${selectedDemand?.trackingNumber}?`}
      />
    </>
  );
}
