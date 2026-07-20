import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import Select from "../../../components/form/Select";

interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
  code: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onSuccess: () => void;
}

export const EditTenantModal: React.FC<EditTenantModalProps> = ({ isOpen, onClose, tenant, onSuccess }) => {
  const [formData, setFormData] = useState({ name: "", subdomain: "", type: "", code: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        subdomain: tenant.subdomain,
        type: tenant.type,
        code: tenant.code || "",
      });
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setIsSaving(true);
    try {
      const res = await api.put(`/system/tenants/${tenant._id}`, formData);
      if (res.data.success) {
        toast.success("Tenant updated successfully");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update tenant");
    } finally {
      setIsSaving(false);
    }
  };

  if (!tenant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Edit Tenant</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
          <input 
            required 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Subdomain</label>
          <div className="flex items-center">
            <input 
              required 
              type="text" 
              value={formData.subdomain} 
              onChange={(e) => setFormData({...formData, subdomain: e.target.value})} 
              className="w-full rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" 
            />
            <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
              .demo.com
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500"
          >
            <option value="Metropolitan">Metropolitan</option>
            <option value="Sub-Metropolitan">Sub-Metropolitan</option>
            <option value="Municipality">Municipality</option>
            <option value="Rural Municipality">Rural Municipality</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Code</label>
          <input 
            type="text" 
            value={formData.code} 
            onChange={(e) => setFormData({...formData, code: e.target.value})} 
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500" 
            placeholder="Optional"
          />
        </div>
        
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
