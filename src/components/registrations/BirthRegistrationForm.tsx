import React, { useState } from "react";
import Select from "../../components/form/Select";

export interface BirthRegistrationFormData {
  wardId: string;
  childName: string;
  childNameNp?: string;
  dateOfBirthBs: string;
  gender: string;
  fatherName?: string;
  fatherCitizenshipNo?: string;
  motherName?: string;
  motherCitizenshipNo?: string;
  remarks?: string;
}

interface BirthRegistrationFormProps {
  initialData?: Partial<BirthRegistrationFormData>;
  onSubmit: (data: BirthRegistrationFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const BirthRegistrationForm: React.FC<BirthRegistrationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<BirthRegistrationFormData>({
    wardId: initialData?.wardId || "",
    childName: initialData?.childName || "",
    childNameNp: initialData?.childNameNp || "",
    dateOfBirthBs: initialData?.dateOfBirthBs || "",
    gender: initialData?.gender || "Male",
    fatherName: initialData?.fatherName || "",
    fatherCitizenshipNo: initialData?.fatherCitizenshipNo || "",
    motherName: initialData?.motherName || "",
    motherCitizenshipNo: initialData?.motherCitizenshipNo || "",
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
            placeholder="Ward ID (Temporary)"
            value={formData.wardId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Birth (BS) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dateOfBirthBs"
            required
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirthBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Child Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="childName"
            required
            value={formData.childName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Child Name (Nepali)
          </label>
          <input
            type="text"
            name="childNameNp"
            value={formData.childNameNp}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gender <span className="text-red-500">*</span>
          </label>
          <Select
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        {/* Father Details */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Father's Name
          </label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Father's Citizenship No.
          </label>
          <input
            type="text"
            name="fatherCitizenshipNo"
            value={formData.fatherCitizenshipNo}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Mother Details */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mother's Name
          </label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mother's Citizenship No.
          </label>
          <input
            type="text"
            name="motherCitizenshipNo"
            value={formData.motherCitizenshipNo}
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
