import React, { useState } from "react";
import Select from "../../components/form/Select";

export interface MigrationRegistrationFormData {
  wardId: string;
  citizenName: string;
  direction: "in" | "out";
  fromAddress?: string;
  toAddress?: string;
  reason?: string;
  migrationDateBs: string;
  remarks?: string;
}

interface MigrationRegistrationFormProps {
  initialData?: Partial<MigrationRegistrationFormData>;
  onSubmit: (data: MigrationRegistrationFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MigrationRegistrationForm: React.FC<MigrationRegistrationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<MigrationRegistrationFormData>({
    wardId: initialData?.wardId || "",
    citizenName: initialData?.citizenName || "",
    direction: initialData?.direction || "out",
    fromAddress: initialData?.fromAddress || "",
    toAddress: initialData?.toAddress || "",
    reason: initialData?.reason || "",
    migrationDateBs: initialData?.migrationDateBs || "",
    remarks: initialData?.remarks || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ward <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="wardId"
            required
            placeholder="Ward ID"
            value={formData.wardId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Migration Date (BS) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="migrationDateBs"
            required
            placeholder="YYYY-MM-DD"
            value={formData.migrationDateBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Citizen Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="citizenName"
            required
            value={formData.citizenName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Direction <span className="text-red-500">*</span>
          </label>
          <Select
            name="direction"
            required
            value={formData.direction}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="in">In (Basaai Sarai Aayeko)</option>
            <option value="out">Out (Basaai Sarai Gayeko)</option>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            From Address
          </label>
          <input
            type="text"
            name="fromAddress"
            value={formData.fromAddress}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            To Address
          </label>
          <input
            type="text"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reason for Migration
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
