import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import Select from "../../components/form/Select";
import { ComboboxSelect } from "../../components/ui/form/ComboboxSelect";

interface Ward {
  _id: string;
  wardNumber: number;
}

export interface CitizenFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  phone?: string;
  citizenshipNumber?: string;
  wardId?: string;
  isVerified: boolean;
}

interface CitizenFormProps {
  initialData?: Partial<CitizenFormData>;
  onSubmit: (data: CitizenFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CitizenForm: React.FC<CitizenFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CitizenFormData>({
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    gender: initialData?.gender || "male",
    phone: initialData?.phone || "",
    citizenshipNumber: initialData?.citizenshipNumber || "",
    wardId: initialData?.wardId || "",
    isVerified: initialData?.isVerified || false,
  });

  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        setLoadingWards(true);
        const res = await api.get("/wards");
        if (res.data?.success) {
          setWards(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching wards:", err);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.first_name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.middle_name")}
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.last_name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.gender")}
          </label>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="male">{t("citizens.male")}</option>
            <option value="female">{t("citizens.female")}</option>
            <option value="other">{t("citizens.other")}</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.phone")}
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.citizenship_no")}
          </label>
          <input
            type="text"
            name="citizenshipNumber"
            value={formData.citizenshipNumber}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("citizens.ward_id")}
          </label>
          <ComboboxSelect
            name="wardId"
            options={wards.map((ward) => ({
              value: ward._id,
              label: `Ward ${ward.wardNumber}`
            }))}
            value={formData.wardId || ""}
            onChange={(val) => setFormData((prev) => ({ ...prev, wardId: val }))}
            placeholder={loadingWards ? "Loading..." : "Select Ward"}
            disabled={loadingWards}
            hideSearchIcon={true}
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={formData.isVerified}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700"
          />
          <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t("citizens.verified_citizen")}
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
          {isSubmitting ? t("common.saving") : t("citizens.save_citizen")}
        </button>
      </div>
    </form>
  );
};
