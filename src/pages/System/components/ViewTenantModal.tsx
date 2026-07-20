import React from "react";
import { Modal } from "../../../components/ui/modal";
import Badge from "../../../components/ui/badge/Badge";

interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
  code: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ViewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const ViewTenantModal: React.FC<ViewTenantModalProps> = ({ isOpen, onClose, tenant }) => {
  if (!tenant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Tenant Details</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">{tenant.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subdomain</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">{tenant.subdomain}.demo.com</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white capitalize">{tenant.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Code</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white uppercase">{tenant.code || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
          <Badge
            size="sm"
            color={
              tenant.status === "approved"
                ? "success"
                : tenant.status === "rejected"
                ? "error"
                : "warning"
            }
          >
            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registered Date</p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {new Date(tenant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
