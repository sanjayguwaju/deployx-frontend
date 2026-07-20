import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Download, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Tooltip } from "../ui/tooltip/Tooltip";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../ui/badge/Badge";
import api from "../../api/axios";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { FormModal } from "../ui/modal/FormModal";
import { Pagination } from "../ui/pagination";
import { CitizenForm, CitizenFormData } from "./CitizenForm";
import { Can } from "../../context/AbilityContext";
import { exportToCSV } from "../../utils/export";

interface Citizen {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  phone?: string;
  citizenshipNumber?: string;
  isVerified: boolean;
  wardId?: { _id: string; name?: string } | string;
}

export default function CitizensTable() {
  const { t } = useTranslation();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  const fetchCitizens = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/citizens?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setCitizens(Array.isArray(data) ? data : data.citizens || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load citizens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens(currentPage);
  }, [currentPage]);

  const handleAddClick = () => {
    setSelectedCitizen(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: CitizenFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedCitizen) {
        await api.put(`/citizens/${selectedCitizen._id}`, data);
      } else {
        await api.post("/citizens", data);
      }
      setIsFormOpen(false);
      fetchCitizens(currentPage);
    } catch (err: any) {
      alert("Error saving citizen: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCitizen) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/citizens/${selectedCitizen._id}`);
      setIsDeleteOpen(false);
      fetchCitizens(currentPage);
    } catch (err: any) {
      alert("Error deleting citizen: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    exportToCSV(
      citizens.map(c => ({
        Name: `${c.firstName} ${c.middleName ? c.middleName + ' ' : ''}${c.lastName}`,
        Gender: c.gender || '',
        Phone: c.phone || '',
        CitizenshipNo: c.citizenshipNumber || '',
        Status: c.isVerified ? 'Verified' : 'Unverified'
      })),
      "Citizens_List"
    );
  };

  const handleApprove = async (citizenId: string, status: 'approved' | 'rejected') => {
    try {
      setIsSubmitting(true);
      await api.patch(`/citizens/${citizenId}/approve`, { status });
      fetchCitizens(currentPage);
    } catch (err: any) {
      alert(`Error updating status: ` + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Citizen>();

  const columns = useMemo(() => [
    columnHelper.accessor("firstName", {
      header: t("citizens.full_name"),
      cell: (info) => {
        const citizen = info.row.original;
        return `${citizen.firstName} ${citizen.middleName ? citizen.middleName + ' ' : ''}${citizen.lastName}`;
      },
    }),
    columnHelper.accessor("gender", {
      header: t("citizens.gender"),
      cell: (info) => (
        <span className="capitalize">{info.getValue() || "-"}</span>
      ),
    }),
    columnHelper.accessor("phone", {
      header: t("citizens.phone"),
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("citizenshipNumber", {
      header: t("citizens.citizenship_no"),
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("isVerified", {
      header: t("common.status"),
      cell: (info) => (
        <Badge size="sm" color={info.getValue() ? "success" : "warning"}>
          {info.getValue() ? t("common.verified") : t("common.unverified")}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: t("common.actions"),
      cell: (info) => {
        const citizen = info.row.original;
        return (
          <DropdownMenu.Root>
            <Tooltip content="Actions">
              <DropdownMenu.Trigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                  <MoreHorizontal size={18} />
                </button>
              </DropdownMenu.Trigger>
            </Tooltip>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-dark"
              >
                <Can I="approve" a="citizens">
                  {!citizen.isVerified && (
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => handleApprove(citizen._id, 'approved')}
                        className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-green-600 outline-none hover:bg-green-50 focus:bg-green-50 dark:hover:bg-green-500/10 dark:focus:bg-green-500/10"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    </DropdownMenu.Item>
                  )}
                  {citizen.isVerified && (
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => handleApprove(citizen._id, 'rejected')}
                        className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 outline-none hover:bg-orange-50 focus:bg-orange-50 dark:hover:bg-orange-500/10 dark:focus:bg-orange-500/10"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </DropdownMenu.Item>
                  )}
                </Can>
                <Can I="update" a="citizens">
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => handleEditClick(citizen)}
                      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-500 outline-none hover:bg-brand-50 focus:bg-brand-50 dark:hover:bg-brand-500/10 dark:focus:bg-brand-500/10"
                    >
                      <Edit size={16} />
                      {t("common.edit")}
                    </button>
                  </DropdownMenu.Item>
                </Can>
                <Can I="delete" a="citizens">
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => handleDeleteClick(citizen)}
                      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 outline-none hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      {t("common.delete")}
                    </button>
                  </DropdownMenu.Item>
                </Can>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      },
    }),
  ], [t, citizens]);

  const table = useReactTable({
    data: citizens,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("citizens.directory")}
        </h3>
        <div className="flex gap-2">
          <Can I="export" a="citizens">
            <button 
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Download size={16} /> Export
            </button>
          </Can>
          <Can I="create" a="citizens">
            <button 
              onClick={handleAddClick}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
            >
              {t("citizens.add_citizen")}
            </button>
          </Can>
        </div>
      </div>
      <DataTable table={table} isLoading={loading} />
          
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            pageSize={meta.pageSize}
            onPageChange={setCurrentPage}
          />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCitizen ? t("citizens.edit_citizen") : t("citizens.add_citizen")}
      >
        <CitizenForm
          initialData={selectedCitizen ? {
            ...selectedCitizen,
            wardId: typeof selectedCitizen.wardId === 'object' ? selectedCitizen.wardId?._id : selectedCitizen.wardId
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        title={t("citizens.delete_citizen")}
        message={t("citizens.delete_confirm", { name: `${selectedCitizen?.firstName} ${selectedCitizen?.lastName}` })}
      />
    </>
  );
}
