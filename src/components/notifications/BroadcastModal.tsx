import React, { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: "all", label: "All Users" },
  { value: "ward_officer", label: "Ward Officers" },
  { value: "mayor", label: "Mayors" },
  { value: "citizen", label: "Citizens" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Send Broadcast</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value} className="text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
              placeholder="e.g. System Update"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
              placeholder="Type your message here..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
