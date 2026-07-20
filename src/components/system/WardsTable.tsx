import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Ban, CheckCircle } from "lucide-react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import api from "../../api/axios";
import { ConfirmStatusModal } from "../ui/modal/ConfirmStatusModal";
import { FormModal } from "../ui/modal/FormModal";
import { WardFormModal, WardFormData } from "./WardFormModal";
import { Can } from "../../context/AbilityContext";

interface Ward {
  _id: string;
  wardNumber: number;
  nameNp: string;
  officeAddress?: string;
  contactPhone?: string;
  population?: number;
  isActive: boolean;
}

export default function WardsTable() {
  const { t } = useTranslation();
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/wards`);
      if (response.data.success) {
        setWards(response.data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load wards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const handleAddClick = () => {
    setSelectedWard(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (ward: Ward) => {
    setSelectedWard(ward);
    setIsFormOpen(true);
  };

  const handleStatusClick = (ward: Ward) => {
    setSelectedWard(ward);
    setIsStatusOpen(true);
  };

  const handleFormSubmit = async (data: WardFormData) => {
    try {
      setIsSubmitting(true);
      
      if (selectedWard) {
        await api.put(`/wards/${selectedWard._id}`, data);
      } else {
        await api.post("/wards", data);
      }
      setIsFormOpen(false);
      fetchWards();
    } catch (err: any) {
      alert("Error saving ward: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatusConfirm = async () => {
    if (!selectedWard) return;
    try {
      setIsSubmitting(true);
      await api.put(`/wards/${selectedWard._id}`, { isActive: !selectedWard.isActive });
      setIsStatusOpen(false);
      fetchWards();
    } catch (err: any) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Ward>();

  const columns = useMemo(() => [
    columnHelper.accessor("wardNumber", {
      header: "Ward No.",
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("nameNp", {
      header: "Name (Nepali)",
    }),
    columnHelper.accessor("officeAddress", {
      header: "Office Address",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("contactPhone", {
      header: "Contact",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("population", {
      header: "Population",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: t("common.actions"),
      cell: (info) => {
        const ward = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="system">
              <>
                <button 
                  onClick={() => handleStatusClick(ward)}
                  disabled={isSubmitting}
                  className={`font-medium p-1 rounded-md transition-colors ${ward.isActive ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10' : 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10'}`}
                  title={ward.isActive ? "Deactivate" : "Activate"}
                >
                  {ward.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                </button>
                <button 
                  onClick={() => handleEditClick(ward)}
                  className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                  title={t("common.edit")}
                >
                  <Edit size={18} />
                </button>
              </>
            </Can>
          </div>
        );
      }
    })
  ], [t, isSubmitting]);

  const table = useReactTable({
    data: wards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          All Wards
        </h3>
        <Can I="create" a="system">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            Add Ward
          </button>
        </Can>
      </div>
      <DataTable table={table} isLoading={loading} />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedWard ? "Edit Ward" : "Add Ward"}
      >
        <WardFormModal
          initialData={selectedWard ? {
            wardNumber: selectedWard.wardNumber,
            nameNp: selectedWard.nameNp,
            officeAddress: selectedWard.officeAddress,
            contactPhone: selectedWard.contactPhone,
            population: selectedWard.population,
            isActive: selectedWard.isActive,
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>

      {/* Status Confirmation Modal */}
      <ConfirmStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleToggleStatusConfirm}
        isActive={selectedWard?.isActive || false}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
