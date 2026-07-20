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
import { CorrespondenceForm, CorrespondenceFormData } from "./CorrespondenceForm";
import { Can } from "../../context/AbilityContext";
import { Edit, Trash2 } from "lucide-react";

interface CorrespondenceItem {
  _id: string;
  referenceNumber: string;
  subject: string;
  direction: "incoming" | "outgoing" | "internal";
  fromEntity?: string;
  toEntity?: string;
  dateBs: string;
  status: string;
}

export default function CorrespondenceTable() {
  const [items, setItems] = useState<CorrespondenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCorrespondence = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/correspondence?direction=${activeTab}&page=${currentPage}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setItems(Array.isArray(data) ? data : data.items || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load correspondence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when tab changes
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchCorrespondence();
  }, [activeTab, currentPage]);

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CorrespondenceFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedItem) {
        await api.put(`/correspondence/${selectedItem._id}`, data);
      } else {
        await api.post("/correspondence", data);
      }
      setIsFormOpen(false);
      fetchCorrespondence();
    } catch (err: any) {
      setError(err.message || "Failed to save correspondence");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      setIsSubmitting(true);
      // Backend uses soft delete (isDeleted: true) via PUT or DELETE endpoint depending on implementation
      // Since it's a soft delete, I'll send a PUT setting isDeleted to true
      await api.put(`/correspondence/${selectedItem._id}`, { isDeleted: true });
      setIsDeleteOpen(false);
      fetchCorrespondence();
    } catch (err: any) {
      setError(err.message || "Failed to delete correspondence");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<CorrespondenceItem>();

  const columns = useMemo(() => [
    columnHelper.accessor("referenceNumber", {
      header: "Ref No.",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "entity",
      header: activeTab === "incoming" ? "From Entity" : "To Entity",
      cell: (info) => {
        const item = info.row.original;
        return activeTab === "incoming" ? (item.fromEntity || "-") : (item.toEntity || "-");
      }
    }),
    columnHelper.accessor("dateBs", {
      header: "Date (BS)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge size="sm" color={
            status === "sent" || status === "received" ? "success" : 
            status === "draft" ? "warning" : "primary"
          }>
            {status}
          </Badge>
        );
      }
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="correspondence">
              <button 
                onClick={() => handleEditClick(item)}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
            </Can>
            <Can I="delete" a="correspondence">
              <button 
                onClick={() => handleDeleteClick(item)}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </Can>
          </div>
        );
      }
    })
  ], [activeTab]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`font-semibold text-lg ${
              activeTab === "incoming" ? "text-brand-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Incoming (Darta)
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`font-semibold text-lg ${
              activeTab === "outgoing" ? "text-brand-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Outgoing (Chalani)
          </button>
        </div>
        <Can I="create" a="correspondence">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            New {activeTab === "incoming" ? "Darta" : "Chalani"}
          </button>
        </Can>
      </div>
      
      {error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
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
      )}

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedItem ? `Edit ${activeTab === "incoming" ? "Darta" : "Chalani"}` : `New ${activeTab === "incoming" ? "Darta" : "Chalani"}`}
      >
        <CorrespondenceForm
          initialData={selectedItem || {}}
          activeTab={activeTab}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${activeTab === "incoming" ? "Darta" : "Chalani"}`}
        message={`Are you sure you want to delete correspondence ${selectedItem?.referenceNumber}?`}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
