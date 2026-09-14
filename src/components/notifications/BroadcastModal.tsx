import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: "all", label: "All Agency Users & Contacts" },
  { value: "candidate", label: "Registered Candidates" },
  { value: "employer", label: "Foreign Employers" },
  { value: "agent", label: "Sourcing Agents" },
  { value: "recruiter", label: "Internal Recruiters & Staff" },
];

export default function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const [targetRole, setTargetRole] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Message is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/notifications/broadcast", {
        targetRole,
        subject,
        message,
      });
      if (res.data.success) {
        toast.success("Broadcast sent successfully!");
        setSubject("");
        setMessage("");
        setTargetRole("all");
        onClose();
      } else {
        toast.error("Failed to send broadcast");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error sending broadcast");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-xl dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">Send Broadcast Message</h3>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
              Recipient Group
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white dark:bg-gray-800"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value} className="text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
              Subject (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              placeholder="e.g. Visa Processing Update"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
              Broadcast Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
              placeholder="Type your message to dispatch via SMS, Email, and Push..."
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
