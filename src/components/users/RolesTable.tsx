import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import api from "../../api/axios";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { FormModal } from "../ui/modal/FormModal";
import { Pagination } from "../ui/pagination";
import { RoleForm, RoleFormData } from "./RoleForm";
import { Can } from "../../context/AbilityContext";

interface Role {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  level: number;
  isSystem: boolean;
  permissions: { module: string; action: string }[];
}

export default function RolesTable() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/roles");
      if (response.data.success) {
        const data = response.data.data;
        setRoles(Array.isArray(data) ? data : data.roles || data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddClick = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedRole) {
        await api.put(`/roles/${selectedRole._id}`, data);
        toast.success(t("roles.role_updated", "Role updated successfully"));
      } else {
        await api.post("/roles", data);
        toast.success(t("roles.role_created", "Role created successfully"));
      }
      setIsFormOpen(false);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Error saving role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/roles/${selectedRole._id}`);
      toast.success(t("roles.role_deleted", "Role deleted successfully"));
      setIsDeleteOpen(false);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Error deleting role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<Role>();

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: t("roles.role_name"),
      cell: (info) => {
        const role = info.row.original;
        return (
          <span className="font-medium text-gray-800 dark:text-white/90">
            {role.name}
            {role.isSystem && (
              <span className="ml-2 inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-700/10">
                System
              </span>
            )}
          </span>
        );
      }
    }),
    columnHelper.accessor("slug", {
      header: "Slug",
    }),
    columnHelper.accessor("permissions", {
      header: t("roles.permissions"),
      cell: (info) => t("roles.permissions_count", { count: (info.getValue() || []).length }),
    }),
    columnHelper.display({
      id: "actions",
      header: t("common.actions"),
      cell: (info) => {
        const role = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="rbac">
              <button 
                onClick={() => handleEditClick(role)}
                className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                title={t("common.edit")}
              >
                <Edit size={18} />
              </button>
            </Can>
            {!role.isSystem && (
              <Can I="delete" a="rbac">
                <button 
                  onClick={() => handleDeleteClick(role)}
                  className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title={t("common.delete")}
                >
                  <Trash2 size={18} />
                </button>
              </Can>
            )}
          </div>
        );
      }
    }),
  ], [t]);

  const tableData = useMemo(() => {
    return roles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [roles, currentPage, pageSize]);

  const table = useReactTable({
    data: tableData,
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
          {t("roles.all_roles")}
        </h3>
        <Can I="create" a="rbac">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            {t("roles.add_role")}
          </button>
        </Can>
      </div>
      <DataTable table={table} isLoading={loading} />
      
      <div className="border-t border-gray-100 p-4 dark:border-white/5">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(roles.length / pageSize) || 1}
          totalItems={roles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedRole ? t("roles.edit_role") : t("roles.add_role")}
        className="max-w-5xl"
      >
        <RoleForm
          initialData={selectedRole ? {
            name: selectedRole.name,
            slug: selectedRole.slug,
            description: selectedRole.description,
            level: selectedRole.level,
            isSystem: selectedRole.isSystem,
            permissions: selectedRole.permissions,
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
        title={t("roles.delete_role")}
        message={t("roles.delete_confirm", { name: selectedRole?.name })}
      />
    </>
  );
}
