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

interface NotificationItem {
  _id: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channel: "email" | "sms" | "push" | "in-app";
  subject?: string;
  body: string;
  status: "pending" | "sent" | "failed" | "delivered";
  createdAt: string;
}

export default function NotificationsTable() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/notifications?page=${currentPage}&pageSize=10`);
        if (response.data.success) {
          const data = response.data.data;
          setNotifications(Array.isArray(data) ? data : data.notifications || data.data || []);
          if (response.data.meta) {
            setMeta(response.data.meta);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentPage]);

  const columnHelper = createColumnHelper<NotificationItem>();

  const columns = useMemo(() => [
    columnHelper.accessor("channel", {
      header: "Channel",
      cell: (info) => (
        <span className="uppercase font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "recipient",
      header: "Recipient",
      cell: (info) => {
        const notif = info.row.original;
        return notif.channel === "email" ? notif.recipientEmail : notif.recipientPhone || "-";
      },
    }),
    columnHelper.accessor("body", {
      header: "Message Preview",
      cell: (info) => (
        <span className="line-clamp-1 max-w-[250px]" title={info.getValue()}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Sent At",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge size="sm" color={
            status === "sent" || status === "delivered" ? "success" : 
            status === "failed" ? "error" : "warning"
          }>
            {status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: () => (
        <button className="text-brand-500 hover:text-brand-600 font-medium text-sm">
          View
        </button>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: notifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading) return <div className="p-4 text-gray-500">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Notifications Log
        </h3>
        <button className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
          Send Broadcast
        </button>
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
