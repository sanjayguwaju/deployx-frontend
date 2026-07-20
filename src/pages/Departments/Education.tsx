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

interface School {
  _id: string;
  name: string;
  wardId: { _id: string; wardNumber: number };
  level: "basic" | "secondary";
  staffCount: number;
  isActive: boolean;
}

interface InventoryItem {
  _id: string;
  category: string;
  name: string;
  nameNp?: string;
  unit: string;
}

export default function Education() {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [wards, setWards] = useState<{ _id: string; wardNumber: number }[]>([]);

  const { items: inventory, loading: invLoading, refresh: refreshInventory } = useInventory("education");

  const fetchSchools = useCallback(async () => {
    setSchoolsLoading(true);
    try {
      const res = await api.get("/schools");
      if (res.data.success) {
        setSchools(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSchoolsLoading(false);
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
    fetchSchools();
    fetchWards();
  }, [fetchSchools, fetchWards]);

  const handleSchoolSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      wardId: formData.get("wardId"),
      level: formData.get("level"),
      staffCount: Number(formData.get("staffCount") || 0),
    };
    try {
      await api.post("/schools", data);
      setIsSchoolModalOpen(false);
      fetchSchools();
    } catch (err) {
      console.error("Failed to create school", err);
      alert("Failed to create school.");
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
      departmentSlug: "education"
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

  const schoolColumnHelper = createColumnHelper<School>();
  const schoolColumns = useMemo(() => [
    schoolColumnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
    }),
    schoolColumnHelper.accessor("level", {
      header: "Level",
      cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    }),
    schoolColumnHelper.accessor("wardId", {
      header: "Ward",
      cell: (info) => `Ward ${info.getValue()?.wardNumber}`,
    }),
    schoolColumnHelper.accessor("isActive", {
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

  const schoolTable = useReactTable({
    data: schools,
    columns: schoolColumns,
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
      cell: (info) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </span>
      ),
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
        title="Education Department | Local Government Operating System"
        description="Education department module for LGOS."
      />
      <PageBreadcrumb pageTitle="Education Department" />
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Schools Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Schools
            </h3>
            <Can I="create" a="School">
              <button 
                onClick={() => setIsSchoolModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add School
              </button>
            </Can>
          </div>
          
          <DataTable table={schoolTable} isLoading={schoolsLoading} />
        </div>

        {/* Educational Inventory Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
          <div className="flex justify-between items-center mb-5 lg:mb-7">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Educational Materials Inventory
            </h3>
            <Can I="create" a="EducationInventory">
              <button 
                onClick={() => setIsItemModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded hover:bg-brand-600"
              >
                + Add Material
              </button>
            </Can>
          </div>
          
          <DataTable table={inventoryTable} isLoading={invLoading} />
        </div>
      </div>

      <FormModal isOpen={isSchoolModalOpen} onClose={() => setIsSchoolModalOpen(false)} title="Add School">
        <form onSubmit={handleSchoolSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name *</label>
            <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Shree Basic School" />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level *</label>
              <Select name="level" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="basic">Basic</option>
                <option value="secondary">Secondary</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff Count</label>
            <input name="staffCount" type="number" min="0" defaultValue="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t dark:border-gray-700">
            <button type="button" onClick={() => setIsSchoolModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">Save</button>
          </div>
        </form>
      </FormModal>

      <FormModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Add Educational Material">
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name *</label>
              <input name="name" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Textbooks" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Nepali)</label>
              <input name="nameNp" type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. पाठ्यपुस्तक" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <Select name="category" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500">
                <option value="stationery">Stationery</option>
                <option value="furniture">Furniture</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit *</label>
              <input name="unit" type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500" placeholder="e.g. Sets, Pcs, Dozen" />
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
