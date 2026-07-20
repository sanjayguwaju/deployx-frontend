import { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useInventory } from "../../hooks/useInventory";
import api from "../../api/axios";
import { Can } from "../../context/AbilityContext";
import { FormModal } from "../../components/ui/modal/FormModal";
import Select from "../../components/form/Select";

interface HealthPost {
  _id: string;
  name: string;
  wardId: { _id: string; wardNumber: number };
  staffCount: number;
  catchmentPopulation: number;
  isActive: boolean;
}

interface InventoryItem {
  _id: string;
  category: string;
  name: string;
  nameNp?: string;
  unit: string;
}

export default function Health() {
  const [healthPosts, setHealthPosts] = useState<HealthPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);

  const { items: inventory, loading: invLoading, refresh: refreshInventory } = useInventory("health");

  const fetchHealthPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await api.get("/health-posts");
      if (res.data.success) {
        setHealthPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostsLoading(false);
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
    fetchHealthPosts();
    fetchWards();
  }, [fetchHealthPosts, fetchWards]);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      wardId: formData.get("wardId"),
      staffCount: Number(formData.get("staffCount") || 0),
      catchmentPopulation: Number(formData.get("catchmentPopulation") || 0),
    };
    try {
      await api.post("/health-posts", data);
      setIsPostModalOpen(false);
      fetchHealthPosts();
    } catch (err) {
      console.error("Failed to create health post", err);
      alert("Failed to create health post.");
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
      departmentSlug: "health"
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

  const healthPostColumnHelper = createColumnHelper<HealthPost>();
  const healthPostsColumns = useMemo(() => [
    healthPostColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    healthPostColumnHelper.accessor("wardId", {
      header: "Ward",
      cell: (info) => `Ward ${info.getValue()?.wardNumber}`,
    }),
    healthPostColumnHelper.accessor("staffCount", {
      header: "Staff",
    }),
    healthPostColumnHelper.accessor("isActive", {
      header: "Status",
      cell: (info) => (
        info.getValue() ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            Inactive
          </span>
        )
      ),
    }),
  ], []);

  const healthPostsTable = useReactTable({
    data: healthPosts,
    columns: healthPostsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const inventoryColumnHelper = createColumnHelper<InventoryItem>();
  const inventoryColumns = useMemo(() => [
    inventoryColumnHelper.accessor("category", {
      header: "Category",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    inventoryColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => {
        const item = info.row.original;
        return (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.name} {item.nameNp ? `(${item.nameNp})` : ""}
          </span>
        );
      },
    }),
    inventoryColumnHelper.accessor("unit", {
      header: "Unit",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
  ], []);

  const inventoryTable = useReactTable({
    data: inventory as InventoryItem[],
    columns: inventoryColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <PageMeta
        title="Health Department | Local Government Operating System"
        description="Health department module for LGOS."
      />
      <PageBreadcrumb pageTitle="Health Department" />
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Health Posts Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Health Posts
            </h3>
            <Can I="create" a="HealthPost">
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add Post
              </button>
            </Can>
          </div>
          
          <DataTable table={healthPostsTable} isLoading={postsLoading} />
        </div>

        {/* Medical Inventory Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Medical Supplies Inventory
            </h3>
            <Can I="create" a="InventoryItem">
              <button 
                onClick={() => setIsItemModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add Item
              </button>
            </Can>
          </div>
          
          <DataTable table={inventoryTable} isLoading={invLoading} />
        </div>
      </div>

      <FormModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="Add Health Post">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Name *</label>
            <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Ward 1 Health Clinic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward *</label>
            <Select name="wardId" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
              <option value="">Select Ward</option>
              {wards.map(w => (
                <option key={w._id} value={w._id}>Ward {w.wardNumber}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Count</label>
              <input name="staffCount" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catchment Population</label>
              <input name="catchmentPopulation" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save</button>
          </div>
        </form>
      </FormModal>

      <FormModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Add Medical Supply Item">
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name *</label>
              <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Paracetamol" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Nepali)</label>
              <input name="nameNp" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. सिटामोल" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <Select name="category" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="medicine">Medicine</option>
                <option value="equipment">Equipment</option>
                <option value="consumable">Consumable</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit *</label>
              <input name="unit" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Box, Tablets, Pcs" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="Optional description"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save</button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
