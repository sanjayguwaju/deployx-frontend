import { useEffect, useState, useMemo } from "react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import api from "../../api/axios";
import { Pagination } from "../ui/pagination";

interface AuditLog {
  _id: string;
  actorEmail: string;
  module: string;
  action: string;
  entityType: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  READ: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  LOGIN: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  LOGOUT: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 15 });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/audit-logs?page=${page}&pageSize=15`);
      if (response.data.success) {
        const data = response.data.data;
        setLogs(Array.isArray(data) ? data : data.logs || data.data || []);
        if (response.data.meta) setMeta(response.data.meta);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(currentPage); }, [currentPage]);

  const columnHelper = createColumnHelper<AuditLog>();

  const columns = useMemo(() => [
    columnHelper.accessor("createdAt", {
      header: "Timestamp",
      cell: (info) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDate(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("actorEmail", {
      header: "Actor",
      cell: (info) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("module", {
      header: "Module",
      cell: (info) => (
        <span className="capitalize">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => {
        const action = info.getValue();
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${ACTION_COLORS[action] || ACTION_COLORS["READ"]}`}>
            {action}
          </span>
        );
      }
    }),
    columnHelper.accessor("entityType", {
      header: "Entity",
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <span className="max-w-xs truncate block" title={info.getValue()}>
          {info.getValue()}
        </span>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Audit Logs</h3>
          <p className="text-sm text-gray-500 mt-0.5">System-wide activity trail — read only</p>
        </div>
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
  );
}
