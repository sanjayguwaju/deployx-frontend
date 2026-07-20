import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";
import { DataTable } from "../ui/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import Badge from "../ui/badge/Badge";
import api from "../../api/axios";
import { ConfirmDeleteModal } from "../ui/modal/ConfirmDeleteModal";
import { ConfirmStatusModal } from "../ui/modal/ConfirmStatusModal";
import { FormModal } from "../ui/modal/FormModal";
import { Pagination } from "../ui/pagination";
import { UserForm, UserFormData } from "./UserForm";
import { Can } from "../../context/AbilityContext";

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: { _id: string; name: string }[];
  designation?: string;
  wardId?: string;
  isActive: boolean;
}

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, pageSize: 10 });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/users?page=${page}&pageSize=10`);
      if (response.data.success) {
        const data = response.data.data;
        setUsers(Array.isArray(data) ? data : data.users || data.data || []);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleAddClick = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleStatusClick = (user: User) => {
    setSelectedUser(user);
    setIsStatusOpen(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      // Map roles to roleIds for the backend
      const payload: any = { ...data, roleIds: data.roles };
      delete payload.roles;
      
      if (selectedUser) {
        await api.put(`/users/${selectedUser._id}`, payload);
      } else {
        await api.post("/users", payload);
      }
      setIsFormOpen(false);
      fetchUsers(currentPage);
    } catch (err: any) {
      alert("Error saving user: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/users/${selectedUser._id}`);
      setIsDeleteOpen(false);
      fetchUsers(currentPage);
    } catch (err: any) {
      alert("Error deleting user: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatusConfirm = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await api.put(`/users/${selectedUser._id}`, { isActive: !selectedUser.isActive });
      setIsStatusOpen(false);
      fetchUsers(currentPage);
    } catch (err: any) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: t("users.name"),
      cell: (info) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: t("users.email"),
    }),
    columnHelper.accessor("roles", {
      header: t("users.roles"),
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {(info.getValue() || []).map((role: any, idx: number) => (
            <Badge key={idx} color="primary" size="sm">
              {typeof role === 'string' ? role : role.name || "Unknown Role"}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("designation", {
      header: t("users.designation"),
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
        const user = info.row.original;
        return (
          <div className="flex gap-3">
            <Can I="update" a="users">
              <>
                <button 
                  onClick={() => handleStatusClick(user)}
                  disabled={isSubmitting}
                  className={`font-medium p-1 rounded-md transition-colors ${user.isActive ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10' : 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10'}`}
                  title={user.isActive ? "Deactivate" : "Activate"}
                >
                  {user.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                </button>
                <button 
                  onClick={() => handleEditClick(user)}
                  className="text-brand-500 hover:text-brand-600 font-medium p-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                  title={t("common.edit")}
                >
                  <Edit size={18} />
                </button>
              </>
            </Can>
            <Can I="delete" a="users">
              <button 
                onClick={() => handleDeleteClick(user)}
                className="text-red-500 hover:text-red-600 font-medium p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title={t("common.delete")}
              >
                <Trash2 size={18} />
              </button>
            </Can>
          </div>
        );
      }
    })
  ], [t, isSubmitting]);

  const table = useReactTable({
    data: users,
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
          {t("users.all_users")}
        </h3>
        <Can I="create" a="users">
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            {t("users.add_user")}
          </button>
        </Can>
      </div>
      <DataTable table={table} isLoading={loading} />
      
      <div className="border-t border-gray-100 p-4 dark:border-white/5">
        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedUser ? t("users.edit_user") : t("users.add_user")}
      >
        <UserForm
          initialData={selectedUser ? {
            name: selectedUser.name,
            email: selectedUser.email,
            phone: selectedUser.phone,
            designation: selectedUser.designation,
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
        title={t("users.delete_user")}
        message={t("users.delete_confirm", { name: selectedUser?.name })}
      />

      {/* Status Confirmation Modal */}
      <ConfirmStatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleToggleStatusConfirm}
        isActive={selectedUser?.isActive || false}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
