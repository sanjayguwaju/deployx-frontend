import React, { useState } from "react";

export interface MarriageRegistrationFormData {
  wardId: string;
  groomName: string;
  groomCitizenshipNo?: string;
  brideName: string;
  brideCitizenshipNo?: string;
  marriageDateBs: string;
  marriageType?: string;
  witnessName1?: string;
  witnessName2?: string;
  remarks?: string;
}

interface MarriageRegistrationFormProps {
  initialData?: Partial<MarriageRegistrationFormData>;
  onSubmit: (data: MarriageRegistrationFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MarriageRegistrationForm: React.FC<MarriageRegistrationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<MarriageRegistrationFormData>({
    wardId: initialData?.wardId || "",
    groomName: initialData?.groomName || "",
    groomCitizenshipNo: initialData?.groomCitizenshipNo || "",
    brideName: initialData?.brideName || "",
    brideCitizenshipNo: initialData?.brideCitizenshipNo || "",
    marriageDateBs: initialData?.marriageDateBs || "",
    marriageType: initialData?.marriageType || "",
    witnessName1: initialData?.witnessName1 || "",
    witnessName2: initialData?.witnessName2 || "",
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
            Marriage Date (BS) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="marriageDateBs"
            required
            placeholder="YYYY-MM-DD"
            value={formData.marriageDateBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Groom */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Groom's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="groomName"
            required
            value={formData.groomName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Groom Citizenship No.
          </label>
          <input
            type="text"
            name="groomCitizenshipNo"
            value={formData.groomCitizenshipNo}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Bride */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bride's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brideName"
            required
            value={formData.brideName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bride Citizenship No.
          </label>
          <input
            type="text"
            name="brideCitizenshipNo"
            value={formData.brideCitizenshipNo}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Marriage Type
          </label>
          <input
            type="text"
            name="marriageType"
            placeholder="e.g. Arranged, Love"
            value={formData.marriageType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="hidden sm:block"></div>

        {/* Witnesses */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Witness 1
          </label>
          <input
            type="text"
            name="witnessName1"
            value={formData.witnessName1}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Witness 2
          </label>
          <input
            type="text"
            name="witnessName2"
            value={formData.witnessName2}
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
