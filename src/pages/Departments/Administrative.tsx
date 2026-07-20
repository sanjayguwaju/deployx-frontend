import { useState, useEffect, useCallback, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ApprovalBadge from "../../components/common/ApprovalBadge";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import { FormModal } from "../../components/ui/modal/FormModal";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

interface AdminDocument {
  _id: string;
  title: string;
  titleNp?: string;
  createdBy: { name: string; email: string };
  createdAt: string;
  approvalId?: { status: "pending" | "approved" | "rejected" };
}

export default function Administrative() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin-documents");
      if (res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDocSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      titleNp: formData.get("titleNp"),
    };
    try {
      await api.post("/admin-documents", data);
      setIsDocModalOpen(false);
      fetchDocuments();
    } catch (err: any) {
      console.error("Failed to create document", err);
      alert(err.response?.data?.message || "Failed to create document.");
    }
  };

  const columnHelper = createColumnHelper<AdminDocument>();

  const columns = useMemo(() => [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => {
        const doc = info.row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {doc.title}
            </span>
            {doc.titleNp && (
              <span className="text-xs text-gray-500">{doc.titleNp}</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.createdBy?.name, {
      id: "createdBy",
      header: "Created By",
      cell: (info) => info.getValue() || "Unknown",
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor((row) => row.approvalId?.status, {
      id: "status",
      header: "Approval Status",
      cell: (info) => {
        const status = info.getValue();
        return status ? (
          <ApprovalBadge status={status} />
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <PageMeta
        title="Administrative | Local Government Operating System"
        description="Administrative department module for LGOS."
      />
      <PageBreadcrumb pageTitle="Administrative Section" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex justify-between items-center mb-5 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Official Documents & Dispatches
          </h3>
          <Can I="create" a="AdminDocument">
            <button 
              onClick={() => setIsDocModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
            >
              + New Document
            </button>
          </Can>
        </div>
        
        <DataTable table={table} isLoading={loading} />
      </div>

      <FormModal 
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title="Create New Official Document"
      >
        <form onSubmit={handleDocSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
            <input 
              name="title" 
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Nepali)</label>
            <input 
              name="titleNp" 
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsDocModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm text-white bg-brand-500 rounded hover:bg-brand-600"
            >
              Save Document
            </button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
