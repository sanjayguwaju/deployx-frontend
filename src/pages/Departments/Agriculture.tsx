import { useState, useEffect, useCallback, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useInventory } from "../../hooks/useInventory";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import { FormModal } from "../../components/ui/modal/FormModal";
import { DataTable } from "../../components/ui/table/DataTable";
import Select from "../../components/form/Select";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

interface LivestockRecord {
  _id: string;
  farmerName: string;
  wardId: { _id: string; wardNumber: number };
  animalType: string;
  count: number;
}

// Inferring structure from usage

export default function Agriculture() {
  const [records, setRecords] = useState<LivestockRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);

  const { items: inventory, loading: invLoading, refresh: refreshInventory } = useInventory("agriculture");

  const fetchRecords = useCallback(async () => {
    setRecordsLoading(true);
    try {
      const res = await api.get("/livestock");
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchRecords();
    fetchWards();
  }, [fetchRecords, fetchWards]);

  const handleRecordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      farmerName: formData.get("farmerName"),
      wardId: formData.get("wardId"),
      animalType: formData.get("animalType"),
      count: Number(formData.get("count") || 0),
    };
    try {
      await api.post("/livestock", data);
      setIsRecordModalOpen(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to create livestock record", err);
      alert("Failed to create livestock record.");
    }
  };

  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      nameNp: formData.get("nameNp"),
      category: formData.get("category"),
      unit: formData.get("unit"),
      description: formData.get("description"),
      departmentSlug: "agriculture"
    };
    try {
      await api.post("/inventory/items", data);
      setIsItemModalOpen(false);
      refreshInventory();
    } catch (err) {
      console.error("Failed to create inventory item", err);
      alert("Failed to add inventory item.");
    }
  };

  // --- Livestock Table Setup ---
  const recordColumnHelper = createColumnHelper<LivestockRecord>();
  const recordColumns = useMemo(() => [
    recordColumnHelper.accessor("farmerName", {
      header: "Farmer Name",
      cell: (info) => <span className="font-medium text-gray-900 dark:text-white">{info.getValue()}</span>,
    }),
    recordColumnHelper.accessor((row) => row.wardId?.wardNumber, {
      id: "ward",
      header: "Ward",
      cell: (info) => `Ward ${info.getValue() || "N/A"}`,
    }),
    recordColumnHelper.accessor("animalType", {
      header: "Animal Type",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    recordColumnHelper.accessor("count", {
      header: () => <div className="text-right w-full">Count</div>,
      cell: (info) => <div className="text-right w-full">{info.getValue()}</div>,
    }),
  ], []);

  const recordsTable = useReactTable({
    data: records,
    columns: recordColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // --- Inventory Table Setup ---
  // Using any or the correct type returned by useInventory hook. Assuming it matches InventoryItem.
  const invColumnHelper = createColumnHelper<any>();
  const invColumns = useMemo(() => [
    invColumnHelper.accessor("category", {
      header: "Category",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    invColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => <span className="font-medium text-gray-900 dark:text-white">{info.getValue()}</span>,
    }),
    invColumnHelper.accessor("unit", {
      header: "Unit",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
  ], []);

  const inventoryTable = useReactTable({
    data: inventory,
    columns: invColumns,
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
        title="Agriculture Department | Local Government Operating System"
        description="Agriculture department module for LGOS."
      />
      <PageBreadcrumb pageTitle="Agriculture & Animal Rearing" />
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Livestock Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Livestock Records
            </h3>
            <Can I="create" a="LivestockRecord">
              <button 
                onClick={() => setIsRecordModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add Record
              </button>
            </Can>
          </div>
          
          <DataTable table={recordsTable} isLoading={recordsLoading} />
        </div>

        {/* Agricultural Inventory Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Agricultural Resources Inventory
            </h3>
            <Can I="create" a="AgricultureInventory">
              <button 
                onClick={() => setIsItemModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add Resource
              </button>
            </Can>
          </div>
          
          <DataTable table={inventoryTable} isLoading={invLoading} />
        </div>
      </div>

      <FormModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Add Livestock Record">
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farmer Name *</label>
            <input name="farmerName" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Ram Bahadur" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward *</label>
              <Select name="wardId" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="">Select Ward</option>
                {wards.map(w => (
                  <option key={w._id} value={w._id}>Ward {w.wardNumber}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Animal Type *</label>
              <Select name="animalType" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="cattle">Cattle (Cow/Buffalo)</option>
                <option value="goat">Goat/Sheep</option>
                <option value="poultry">Poultry</option>
                <option value="pig">Pig</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count *</label>
            <input name="count" type="number" min="1" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsRecordModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save</button>
          </div>
        </form>
      </FormModal>

      <FormModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Add Agricultural Resource">
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name (English) *</label>
              <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name (Nepali)</label>
              <input name="nameNp" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <Select name="category" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="seeds">Seeds</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="equipment">Equipment</option>
                <option value="pesticides">Pesticides</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit of Measurement *</label>
              <Select name="unit" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="kg">Kilogram (kg)</option>
                <option value="liter">Liter (L)</option>
                <option value="piece">Piece (pcs)</option>
                <option value="packet">Packet</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save Item</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
