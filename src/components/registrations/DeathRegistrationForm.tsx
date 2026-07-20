import React, { useState } from "react";
import Select from "../../components/form/Select";

export interface DeathRegistrationFormData {
  wardId: string;
  deceasedName: string;
  deceasedNameNp?: string;
  dateOfDeathBs: string;
  gender?: string;
  ageAtDeath?: string;
  causeOfDeath?: string;
  informantName?: string;
  informantRelation?: string;
  remarks?: string;
}

interface DeathRegistrationFormProps {
  initialData?: Partial<DeathRegistrationFormData>;
  onSubmit: (data: DeathRegistrationFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const DeathRegistrationForm: React.FC<DeathRegistrationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<DeathRegistrationFormData>({
    wardId: initialData?.wardId || "",
    deceasedName: initialData?.deceasedName || "",
    deceasedNameNp: initialData?.deceasedNameNp || "",
    dateOfDeathBs: initialData?.dateOfDeathBs || "",
    gender: initialData?.gender || "Male",
    ageAtDeath: initialData?.ageAtDeath || "",
    causeOfDeath: initialData?.causeOfDeath || "",
    informantName: initialData?.informantName || "",
    informantRelation: initialData?.informantRelation || "",
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
            Date of Death (BS) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dateOfDeathBs"
            required
            placeholder="YYYY-MM-DD"
            value={formData.dateOfDeathBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deceased Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="deceasedName"
            required
            value={formData.deceasedName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deceased Name (Nepali)
          </label>
          <input
            type="text"
            name="deceasedNameNp"
            value={formData.deceasedNameNp}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Age at Death
          </label>
          <input
            type="text"
            name="ageAtDeath"
            value={formData.ageAtDeath}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cause of Death
          </label>
          <input
            type="text"
            name="causeOfDeath"
            value={formData.causeOfDeath}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="hidden sm:block"></div>

        {/* Informant Details */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Informant Name
          </label>
          <input
            type="text"
            name="informantName"
            value={formData.informantName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Informant Relation
          </label>
          <input
            type="text"
            name="informantRelation"
            value={formData.informantRelation}
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
