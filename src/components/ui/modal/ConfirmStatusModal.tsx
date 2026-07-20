import React from "react";
import { Modal } from "./index";
import { Ban, CheckCircle } from "lucide-react";

interface ConfirmStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isActive: boolean;
  isSubmitting?: boolean;
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isActive,
  isSubmitting = false,
}) => {
  const isDeactivating = isActive; // if true, we are deactivating

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-4 ${isDeactivating ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
          {isDeactivating ? <Ban size={24} /> : <CheckCircle size={24} />}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDeactivating ? "Confirm Deactivation" : "Confirm Activation"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isDeactivating
            ? "Are you sure you want to deactivate this user? They will no longer be able to log in to the system."
            : "Are you sure you want to activate this user? They will regain access to the system."}
        </p>
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${isDeactivating ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isSubmitting ? "Processing..." : (isDeactivating ? "Deactivate" : "Activate")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
