import { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../../components/ui/badge/Badge";
import { format } from "date-fns";

export default function PlatformBilling() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions/all");
      if (res.data.success) {
        setSubscriptions(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => row.municipalityId?.name, {
      id: "tenant",
      header: "Tenant Name",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {row.municipalityId?.name || "Unknown Tenant"}
            </span>
            <span className="text-xs text-gray-500">
              {row.municipalityId?.type} - {row.municipalityId?.district}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("planName", {
      header: "Plan",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-gray-300">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let color: "success" | "warning" | "error" | "light" = "light";
        if (status === "active") color = "success";
        if (status === "trial") color = "warning";
        if (status === "past_due") color = "error";
        if (status === "canceled") color = "light";

        return (
          <Badge color={color}>
            {status?.replace("_", " ").toUpperCase() || "UNKNOWN"}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="text-gray-700 dark:text-gray-300">
          NPR {info.getValue()?.toLocaleString() || 0}
        </span>
      ),
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: (info) => {
        const date = info.getValue();
        return (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
          </span>
        );
      }
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: (info) => {
        const date = info.getValue();
        return (
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
          </span>
        );
      }
    }),
  ], []);

  const table = useReactTable({
    data: subscriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <>
      <PageMeta
        title="Billing Admin | Platform Administration"
        description="View all tenant subscriptions and billing details."
      />
      <PageBreadcrumb pageTitle="Billing & Subscriptions Admin" />
      
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:mb-7">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                All Tenant Subscriptions
              </h3>
              <p className="text-sm text-gray-500">
                Monitor and manage all active, trial, and past-due subscriptions.
              </p>
            </div>
          </div>
          
          <DataTable table={table} isLoading={loading} />
        </div>
      </div>
    </>
  );
}
