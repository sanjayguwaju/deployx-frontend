import React, { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { useFeatureFlags } from "../../context/FeatureFlagContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
}

const FeatureFlagsAdmin = () => {
  const { flags, fetchFlags } = useFeatureFlags();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const [distinctFlags, setDistinctFlags] = useState<{ key: string; name: string; description: string; isSystemFlag: boolean }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newFlag, setNewFlag] = useState({ key: "", name: "", description: "" });
  
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [flagSearchQuery, setFlagSearchQuery] = useState("");

  useEffect(() => {
    fetchTenants();
    fetchSystemFlags();
  }, []);

  const fetchSystemFlags = async () => {
    try {
      const res = await axios.get("/feature-flags/system-flags");
      if (res.data.success) {
        setDistinctFlags(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch system flags.", err);
    }
  };

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);
      const res = await axios.get("/system/tenants?limit=100");
      if (res.data.success) {
        setTenants(Array.isArray(res.data.data) ? res.data.data : res.data.data.tenants || []);
      }
    } catch (err) {
      toast.error("Failed to fetch tenants.");
      console.error(err);
    } finally {
      setLoadingTenants(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.post("/feature-flags/system-flags", newFlag);
      toast.success("Global feature flag defined!");
      setNewFlag({ key: "", name: "", description: "" });
      setIsAdding(false);
      await fetchSystemFlags(); // Refresh the columns
    } catch (error) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to define global flag");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFlag = async (tenantId: string, flagDef: { key: string; name: string; description: string }) => {
    const existingFlag = flags.find((f) => f.municipalityId === tenantId && f.key === flagDef.key);
    const operationId = `${tenantId}-${flagDef.key}`;
    setIsProcessing(operationId);

    try {
      if (existingFlag) {
        await axios.put(`/feature-flags/${existingFlag._id}`, { isActive: !existingFlag.isActive });
        toast.success(existingFlag.isActive ? "Flag disabled for tenant." : "Flag enabled for tenant.");
      } else {
        await axios.post("/feature-flags", {
          municipalityId: tenantId,
          key: flagDef.key,
          name: flagDef.name,
          description: flagDef.description,
          isActive: true,
        });
        toast.success("Flag enabled for tenant.");
      }
      await fetchFlags();
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update feature flag.");
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => 
      t.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) || 
      t.subdomain.toLowerCase().includes(tenantSearchQuery.toLowerCase())
    );
  }, [tenants, tenantSearchQuery]);

  const filteredFlags = useMemo(() => {
    return distinctFlags.filter(f => 
      f.name.toLowerCase().includes(flagSearchQuery.toLowerCase()) || 
      f.key.toLowerCase().includes(flagSearchQuery.toLowerCase())
    );
  }, [distinctFlags, flagSearchQuery]);

  const columnHelper = createColumnHelper<Tenant>();

  const columns = useMemo(() => {
    const cols: any[] = [
      columnHelper.accessor((row) => row.name, {
        id: "tenant",
        header: () => "Tenant",
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
    ];

    filteredFlags.forEach((flagDef) => {
      cols.push(
        columnHelper.display({
          id: flagDef.key,
          header: () => (
            <div className="flex flex-col items-center">
              <span className="font-semibold whitespace-nowrap">{flagDef.name}</span>
              <span className="text-[10px] font-normal opacity-70 mt-0.5">{flagDef.key}</span>
            </div>
          ),
          cell: (info) => {
            const tenant = info.row.original;
            const existingFlag = flags.find((f) => f.municipalityId === tenant._id && f.key === flagDef.key);
            const isActive = existingFlag?.isActive || false;
            const operationId = `${tenant._id}-${flagDef.key}`;
            const isWorking = isProcessing === operationId;

            return (
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => handleToggleFlag(tenant._id, flagDef)}
                  disabled={isWorking}
                  className={`text-xs px-4 py-1.5 font-medium transition-colors disabled:opacity-50 border ${
                    isActive
                      ? "text-success-700 bg-success-50 border-success-200 hover:bg-success-100 rounded-full dark:bg-success-900/30 dark:border-success-800 dark:hover:bg-success-900/50"
                      : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100 rounded-full dark:bg-red-900/30 dark:border-red-800 dark:hover:bg-red-900/50"
                  }`}
                >
                  {isActive ? "Enabled" : "Enable"}
                </button>
              </div>
            );
          },
        })
      );
    });

    return cols;
  }, [filteredFlags, flags, isProcessing]);

  const table = useReactTable({
    data: filteredTenants,
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
      <PageMeta title="Feature Flags Matrix | DeployX" description="Manage feature flags per tenant" />
      <PageBreadcrumb pageTitle="Feature Flags" />

      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Feature Flags Matrix</h3>
              <p className="text-sm text-gray-500 mt-0.5">Enable or disable features for specific municipalities</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-white/[0.1]"></div>
            <input 
              type="text" 
              placeholder="Search tenants..." 
              value={tenantSearchQuery}
              onChange={(e) => setTenantSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" 
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <input 
              type="text" 
              placeholder="Search flags..." 
              value={flagSearchQuery}
              onChange={(e) => setFlagSearchQuery(e.target.value)}
              className="w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" 
            />
            <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? "Cancel" : "Add Flag"}
            </Button>
          </div>
        </div>

        {isAdding && (
          <div className="p-5 border-b border-gray-100 bg-gray-50 dark:bg-white/[0.02] dark:border-white/5">
            <h4 className="text-md font-medium mb-4 dark:text-white">Define Global System Flag</h4>
            <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Key</label>
                <input required type="text" placeholder="e.g. online_payment" value={newFlag.key} onChange={(e) => setNewFlag({...newFlag, key: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                <input required type="text" placeholder="e.g. Online Payment" value={newFlag.name} onChange={(e) => setNewFlag({...newFlag, name: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                <input type="text" placeholder="Optional explanation" value={newFlag.description} onChange={(e) => setNewFlag({...newFlag, description: e.target.value})} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Definition"}
              </Button>
            </form>
          </div>
        )}

        <DataTable table={table} isLoading={loadingTenants} />
        
        {/* Pagination Controls */}
        {!loadingTenants && filteredTenants.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredTenants.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {filteredTenants.length}
              </span>{" "}
              tenants
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FeatureFlagsAdmin;
