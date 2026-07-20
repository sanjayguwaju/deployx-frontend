import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface WardFormData {
  wardNumber: number;
  nameNp: string;
  officeAddress?: string;
  contactPhone?: string;
  population?: number;
  isActive: boolean;
}

interface WardFormProps {
  initialData?: Partial<WardFormData>;
  onSubmit: (data: WardFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

export const WardFormModal: React.FC<WardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<WardFormData>({
    wardNumber: initialData?.wardNumber || 1,
    nameNp: initialData?.nameNp || "",
    officeAddress: initialData?.officeAddress || "",
    contactPhone: initialData?.contactPhone || "",
    population: initialData?.population || 0,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ward Number *</label>
          <input
            type="number"
            name="wardNumber"
            required
            min={1}
            value={formData.wardNumber}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Name (Nepali) *</label>
          <input
            type="text"
            name="nameNp"
            required
            value={formData.nameNp}
            onChange={handleChange}
            className={inputClass}
            placeholder="वडा नं १"
          />
        </div>

        <div>
          <label className={labelClass}>Office Address</label>
          <input
            type="text"
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Population</label>
          <input
            type="number"
            name="population"
            min={0}
            value={formData.population}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex items-center mt-8">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Is Active
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {isSubmitting ? t("common.saving") : t("common.save")}
        </button>
      </div>
    </form>
  );
};
