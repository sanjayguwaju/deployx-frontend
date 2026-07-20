import { useState, useEffect, useMemo } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { Search, Download, MoreVertical, Edit2, Eye, Trash2, Pause, Play } from "lucide-react";
import { Pagination } from "../../components/ui/pagination";
import Badge from "../../components/ui/badge/Badge";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ConfirmDeleteModal } from "../../components/ui/modal/ConfirmDeleteModal";
import { ViewTenantModal } from "./components/ViewTenantModal";
import { EditTenantModal } from "./components/EditTenantModal";
import { DataTable } from "../../components/ui/table/DataTable";
import Select from "../../components/form/Select";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
  code: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function TenantsAdmin() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });
  
  // Selection state
  const [rowSelection, setRowSelection] = useState({});

  // Modal and Action States

  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchTenants(currentPage, limit, searchQuery);
  }, [currentPage, limit]);

  // Debounced Search Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTenants(1, limit, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTenants = async (page = 1, pageLimit = 10, search = "") => {
    try {
      setLoading(true);
      const res = await api.get(`/system/tenants?page=${page}&limit=${pageLimit}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setTenants(Array.isArray(res.data.data) ? res.data.data : res.data.data.tenants || []);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await api.put(`/system/tenants/${id}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Tenant marked as ${newStatus}`);
        setTenants((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus as any } : t))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update tenant");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!activeTenant) return;
    setUpdating(activeTenant._id);
    try {
      const res = await api.delete(`/system/tenants/${activeTenant._id}`);
      if (res.data.success) {
        toast.success("Tenant deleted successfully");
        fetchTenants(currentPage, limit, searchQuery);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete tenant");
    } finally {
      setUpdating(null);
      setDeleteModalOpen(false);
    }
  };

  const handleDownloadCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const dataToDownload = selectedRows.length > 0 
      ? selectedRows.map(r => r.original)
      : tenants;
    
    if (dataToDownload.length === 0) return toast.error("No data to download");

    const headers = ["Name", "Subdomain", "Type", "Status", "Registered Date"];
    const csvContent = [
      headers.join(","),
      ...dataToDownload.map(t => [
        `"${t.name}"`,
        `"${t.subdomain}"`,
        `"${t.type}"`,
        `"${t.status}"`,
        `"${new Date(t.createdAt).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tenants_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnHelper = createColumnHelper<Tenant>();

  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600"
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600"
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => {
        const tenant = info.row.original;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-theme-sm dark:text-white/90">
              {tenant.name}
            </span>
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">
              {tenant.subdomain}.demo.com
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => (
        <span className="capitalize">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Registered Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <Badge
            size="sm"
            color={
              status === "approved"
                ? "success"
                : status === "rejected"
                ? "error"
                : "warning"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const tenant = info.row.original;
        return (
          <div className="flex items-center gap-2 relative">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="dropdown-toggle p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-dark"
                >
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => { setActiveTenant(tenant); setViewModalOpen(true); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => { setActiveTenant(tenant); setEditModalOpen(true); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Tenant
                    </button>
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  {tenant.status !== 'approved' ? (
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => { handleStatusChange(tenant._id, "approved"); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-success-700 hover:bg-success-50 rounded-lg dark:text-success-500 dark:hover:bg-success-900/30 transition-colors text-left"
                      >
                        <Play className="w-4 h-4" /> Activate
                      </button>
                    </DropdownMenu.Item>
                  ) : (
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => { handleStatusChange(tenant._id, "rejected"); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-warning-700 hover:bg-warning-50 rounded-lg dark:text-warning-500 dark:hover:bg-warning-900/30 transition-colors text-left"
                      >
                        <Pause className="w-4 h-4" /> Suspend
                      </button>
                    </DropdownMenu.Item>
                  )}
                  
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => { setActiveTenant(tenant); setDeleteModalOpen(true); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-500 dark:hover:bg-red-900/30 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: tenants,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      {/* Top Header / Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Show</span>
          <Select 
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-3 py-2 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors shadow-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">entries</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2.5 outline-none dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors shadow-sm"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            Download <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <DataTable table={table} isLoading={loading} />
      
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mt-4">
        {meta.totalPages > 1 && (
          <div className="border-t border-gray-100 p-4 dark:border-white/5">
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewTenantModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        tenant={activeTenant}
      />
      
      <EditTenantModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tenant={activeTenant}
        onSuccess={() => fetchTenants(currentPage, limit, searchQuery)}
      />
      
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        message={`Are you sure you want to permanently delete the tenant "${activeTenant?.name}"? This action cannot be undone.`}
        isDeleting={updating === activeTenant?._id}
      />
    </div>
  );
}
