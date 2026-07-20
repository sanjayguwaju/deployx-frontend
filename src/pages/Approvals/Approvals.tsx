import { useState, useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useApprovals } from "../../hooks/useApprovals";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

// Define the approval type based on usage in the old component
interface Approval {
  _id: string;
  module: string;
  recordType: string;
  recordId: string;
  createdAt: string;
}

export default function Approvals() {
  const { approvals, loading, refresh } = useApprovals();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      setActionLoading(id);
      const res = await api.post(`/approvals/${id}/action`, {
        action,
        atBs: "2081-01-01", // TODO: hook up nepali date picker
      });
      if (res.data.success) {
        toast.success(`Document ${action}d successfully`);
        refresh();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} document`);
    } finally {
      setActionLoading(null);
    }
  };

  const columnHelper = createColumnHelper<Approval>();

  const columns = useMemo(() => [
    columnHelper.accessor("module", {
      header: "Module",
      cell: (info) => (
        <span className="capitalize font-medium text-gray-900 dark:text-white">{info.getValue().replace("_", " ")}</span>
      ),
    }),
    columnHelper.accessor("recordType", {
      header: "Record Type",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("recordId", {
      header: "Record ID",
      cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Submitted",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right w-full">Actions</div>,
      cell: (info) => {
        const approval = info.row.original;
        return (
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => handleAction(approval._id, "approve")}
              disabled={actionLoading === approval._id}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm font-medium transition-colors shadow-sm"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(approval._id, "reject")}
              disabled={actionLoading === approval._id}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm font-medium transition-colors shadow-sm"
            >
              Reject
            </button>
          </div>
        );
      },
    }),
  ], [actionLoading]);

  const table = useReactTable({
    data: approvals,
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
    <div>
      <PageMeta title="Approvals | PalikaOS" description="Pending approvals" />
      <PageBreadcrumb pageTitle="Approvals" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pending Your Approval</h2>

        {loading ? (
          <Loader />
        ) : approvals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">You have no pending approvals.</p>
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
}
