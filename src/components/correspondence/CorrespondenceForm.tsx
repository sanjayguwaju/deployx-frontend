import React, { useState, useEffect } from "react";
import Select from "../../components/form/Select";

export interface CorrespondenceFormData {
  _id?: string;
  type: "letter" | "memo" | "notice" | "order" | "report";
  direction: "incoming" | "outgoing" | "internal";
  subject: string;
  subjectNp?: string;
  body?: string;
  fromEntity?: string;
  toEntity?: string;
  dateBs: string;
  deadlineBs?: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "draft" | "sent" | "received" | "acknowledged" | "closed";
}

interface CorrespondenceFormProps {
  initialData?: Partial<CorrespondenceFormData>;
  activeTab: "incoming" | "outgoing";
  onSubmit: (data: CorrespondenceFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CorrespondenceForm: React.FC<CorrespondenceFormProps> = ({
  initialData,
  activeTab,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<CorrespondenceFormData>({
    type: initialData?.type || "letter",
    direction: initialData?.direction || activeTab,
    subject: initialData?.subject || "",
    subjectNp: initialData?.subjectNp || "",
    body: initialData?.body || "",
    fromEntity: initialData?.fromEntity || "",
    toEntity: initialData?.toEntity || "",
    dateBs: initialData?.dateBs || "",
    deadlineBs: initialData?.deadlineBs || "",
    priority: initialData?.priority || "normal",
    status: initialData?.status || "draft",
  });

  useEffect(() => {
    // When activeTab changes, update the direction if we are not editing
    if (!initialData?._id) {
      setFormData((prev) => ({ ...prev, direction: activeTab }));
    }
  }, [activeTab, initialData]);

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
            Subject (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject (Nepali)
          </label>
          <input
            type="text"
            name="subjectNp"
            value={formData.subjectNp}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type <span className="text-red-500">*</span>
          </label>
          <Select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="letter">Letter</option>
            <option value="memo">Memo</option>
            <option value="notice">Notice</option>
            <option value="order">Order</option>
            <option value="report">Report</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date (BS) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dateBs"
            required
            placeholder="YYYY-MM-DD"
            value={formData.dateBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {formData.direction === "incoming" ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              From Entity (Sender)
            </label>
            <input
              type="text"
              name="fromEntity"
              value={formData.fromEntity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Entity (Receiver)
            </label>
            <input
              type="text"
              name="toEntity"
              value={formData.toEntity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deadline (BS)
          </label>
          <input
            type="text"
            name="deadlineBs"
            placeholder="YYYY-MM-DD"
            value={formData.deadlineBs}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="closed">Closed</option>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Body Details
          </label>
          <textarea
            name="body"
            rows={3}
            value={formData.body}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          ></textarea>
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
