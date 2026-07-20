import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import ApprovalBadge from "../../components/common/ApprovalBadge";
import { FormModal } from "../../components/ui/modal/FormModal";
import Select from "../../components/form/Select";

interface LedgerEntry {
  _id: string;
  type: "income" | "expense";
  amountNpr: number;
  sourceModule?: string;
  description: string;
  dateBs: string;
}

interface BudgetAllocation {
  _id: string;
  fiscalYear: string;
  sectionSlug: string;
  allocatedAmountNpr: number;
  spentAmountNpr: number;
  status: "draft" | "approved" | "exhausted" | "closed";
  approvalId?: any;
}

interface RevenueCollection {
  _id: string;
  revenueType: string;
  payerName: string;
  amountNpr: number;
  receiptNumber: string;
  dateBs: string;
}

export default function Finance() {
  const [activeTab, setActiveTab] = useState<"ledger" | "budget" | "revenue">("ledger");
  
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [revenues, setRevenues] = useState<RevenueCollection[]>([]);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState({ income: 0, expense: 0 });

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

  const fetchWards = useCallback(async () => {
    try {
      const res = await api.get("/wards");
      if (res.data.success) {
        setWards(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/ledger");
      if (res.data.success) {
        const data: LedgerEntry[] = res.data.data;
        setEntries(data);
        
        let inc = 0, exp = 0;
        data.forEach(d => {
          if (d.type === "income") inc += d.amountNpr;
          else exp += d.amountNpr;
        });
        setBalance({ income: inc, expense: exp });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/budget-allocations");
      if (res.data.success) {
        setBudgets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/revenue-collections");
      if (res.data.success) {
        setRevenues(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
    if (activeTab === "ledger") fetchEntries();
    else if (activeTab === "budget") fetchBudgets();
    else if (activeTab === "revenue") fetchRevenues();
  }, [activeTab, fetchEntries, fetchBudgets, fetchRevenues, fetchWards]);

  const handleBudgetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fiscalYear: formData.get("fiscalYear"),
      sectionSlug: formData.get("sectionSlug"),
      wardId: formData.get("wardId") || undefined,
      allocatedAmountNpr: Number(formData.get("allocatedAmountNpr")),
    };
    try {
      await api.post("/budget-allocations", data);
      setIsBudgetModalOpen(false);
      fetchBudgets();
    } catch (err) {
      console.error("Failed to allocate budget", err);
      alert("Failed to allocate budget.");
    }
  };

  const handleRevenueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      revenueType: formData.get("revenueType"),
      payerName: formData.get("payerName"),
      payerPhone: formData.get("payerPhone"),
      amountNpr: Number(formData.get("amountNpr")),
      receiptNumber: formData.get("receiptNumber"),
      dateBs: formData.get("dateBs"),
      wardId: formData.get("wardId") || undefined,
    };
    try {
      await api.post("/revenue-collections", data);
      setIsRevenueModalOpen(false);
      fetchRevenues();
      fetchEntries(); // Refresh balance if applicable
    } catch (err: any) {
      console.error("Failed to collect revenue", err);
      alert(err.response?.data?.message || "Failed to collect revenue.");
    }
  };

  const ledgerColumnHelper = createColumnHelper<LedgerEntry>();
  const ledgerColumns = useMemo(() => [
    ledgerColumnHelper.accessor("dateBs", {
      header: "Date (BS)",
    }),
    ledgerColumnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    ledgerColumnHelper.accessor("sourceModule", {
      header: "Source Module",
      cell: (info) => (
        <span className="text-xs uppercase tracking-wide">
          {info.getValue()?.replace("_", " ") || "MANUAL"}
        </span>
      ),
    }),
    ledgerColumnHelper.accessor("amountNpr", {
      id: "income",
      header: "Income",
      cell: (info) => {
        const row = info.row.original;
        return (
          <span className="text-right font-mono text-green-600 block">
            {row.type === "income" ? row.amountNpr.toLocaleString() : "-"}
          </span>
        );
      },
    }),
    ledgerColumnHelper.accessor("amountNpr", {
      id: "expense",
      header: "Expense",
      cell: (info) => {
        const row = info.row.original;
        return (
          <span className="text-right font-mono text-red-600 block">
            {row.type === "expense" ? row.amountNpr.toLocaleString() : "-"}
          </span>
        );
      },
    }),
  ], []);

  const ledgerTable = useReactTable({
    data: entries,
    columns: ledgerColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const budgetColumnHelper = createColumnHelper<BudgetAllocation>();
  const budgetColumns = useMemo(() => [
    budgetColumnHelper.accessor("fiscalYear", {
      header: "Fiscal Year",
    }),
    budgetColumnHelper.accessor("sectionSlug", {
      header: "Department",
      cell: (info) => (
        <span className="font-medium uppercase text-xs">
          {info.getValue().replace("_", " ")}
        </span>
      ),
    }),
    budgetColumnHelper.accessor("allocatedAmountNpr", {
      header: "Allocated (NPR)",
      cell: (info) => (
        <span className="text-right font-mono block">
          {info.getValue().toLocaleString()}
        </span>
      ),
    }),
    budgetColumnHelper.accessor("spentAmountNpr", {
      header: "Spent (NPR)",
      cell: (info) => (
        <span className="text-right font-mono block">
          {info.getValue().toLocaleString()}
        </span>
      ),
    }),
    budgetColumnHelper.display({
      id: "remaining",
      header: "Remaining",
      cell: (info) => {
        const b = info.row.original;
        return (
          <span className="text-right font-mono font-semibold dark:text-white block">
            {(b.allocatedAmountNpr - b.spentAmountNpr).toLocaleString()}
          </span>
        );
      },
    }),
    budgetColumnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const b = info.row.original;
        return (
          <div className="text-center">
            {b.approvalId ? (
              <ApprovalBadge status={b.approvalId?.status || b.status} />
            ) : (
              <span className="text-xs uppercase">{b.status}</span>
            )}
          </div>
        );
      },
    }),
  ], []);

  const budgetTable = useReactTable({
    data: budgets,
    columns: budgetColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const revenueColumnHelper = createColumnHelper<RevenueCollection>();
  const revenueColumns = useMemo(() => [
    revenueColumnHelper.accessor("dateBs", {
      header: "Date (BS)",
    }),
    revenueColumnHelper.accessor("receiptNumber", {
      header: "Receipt No.",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    revenueColumnHelper.accessor("payerName", {
      header: "Payer Name",
    }),
    revenueColumnHelper.accessor("revenueType", {
      header: "Type",
      cell: (info) => (
        <span className="text-xs uppercase">
          {info.getValue().replace("_", " ")}
        </span>
      ),
    }),
    revenueColumnHelper.accessor("amountNpr", {
      header: "Amount (NPR)",
      cell: (info) => (
        <span className="text-right font-mono text-green-600 block">
          {info.getValue().toLocaleString()}
        </span>
      ),
    }),
  ], []);

  const revenueTable = useReactTable({
    data: revenues,
    columns: revenueColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageMeta
        title="Finance & Revenue | Local Government Operating System"
        description="Finance and Revenue ledger module for LGOS."
      />
      <PageBreadcrumb pageTitle="Finance & Revenue" />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income (NPR)</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">{balance.income.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense (NPR)</h3>
          <p className="mt-2 text-2xl font-bold text-red-600">{balance.expense.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Balance (NPR)</h3>
          <p className={`mt-2 text-2xl font-bold ${balance.income - balance.expense >= 0 ? "text-gray-900 dark:text-white" : "text-red-600"}`}>
            {(balance.income - balance.expense).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "ledger" 
                ? "border-brand-500 text-brand-500" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            General Ledger
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "budget" 
                ? "border-brand-500 text-brand-500" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Budget Allocations
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === "revenue" 
                ? "border-brand-500 text-brand-500" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Revenue Collection
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "ledger" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">General Ledger</h3>
              <p className="text-xs text-gray-500">Auto-generated from payments and revenue</p>
            </div>
            <DataTable table={ledgerTable} isLoading={loading} />
          </div>
        )}

        {activeTab === "budget" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Budget Allocations</h3>
              <Can I="create" a="BudgetAllocation">
                <button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
                >
                  + Allocate Budget
                </button>
              </Can>
            </div>
            <DataTable table={budgetTable} isLoading={loading} />
          </div>
        )}

        {activeTab === "revenue" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Revenue Collection</h3>
              <Can I="create" a="RevenueCollection">
                <button 
                  onClick={() => setIsRevenueModalOpen(true)}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
                >
                  + Collect Revenue
                </button>
              </Can>
            </div>
            <DataTable table={revenueTable} isLoading={loading} />
          </div>
        )}

      </div>

      {/* Allocate Budget Modal */}
      <FormModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Allocate Budget">
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiscal Year *</label>
              <input name="fiscalYear" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 2081/82" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
              <Select name="sectionSlug" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="agriculture">Agriculture</option>
                <option value="finance">Finance</option>
                <option value="administrative">Administrative</option>
                <option value="disaster">Disaster Management</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward (Optional)</label>
              <Select name="wardId" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="">Municipality Wide</option>
                {wards.map(w => (
                  <option key={w._id} value={w._id}>Ward {w.wardNumber}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (NPR) *</label>
              <input name="allocatedAmountNpr" type="number" min="1" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 500000" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Allocating budget requires a multi-tier approval before the funds are marked as officially active.</p>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Submit for Approval</button>
          </div>
        </form>
      </FormModal>

      {/* Collect Revenue Modal */}
      <FormModal isOpen={isRevenueModalOpen} onClose={() => setIsRevenueModalOpen(false)} title="Collect Revenue">
        <form onSubmit={handleRevenueSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt Number *</label>
              <input name="receiptNumber" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. REC-1029" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (BS) *</label>
              <input name="dateBs" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 2081/03/12" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Type *</label>
              <Select name="revenueType" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="property_tax">Property Tax</option>
                <option value="business_tax">Business Tax</option>
                <option value="rent">Rent / Lease</option>
                <option value="fine">Fine / Penalty</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (NPR) *</label>
              <input name="amountNpr" type="number" min="1" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. 1500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payer Name *</label>
            <input name="payerName" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Hari Bahadur" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsRevenueModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save Revenue</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
