import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "../form/input/Checkbox";
import Select from "../../components/form/Select";

export interface RoleFormData {
  name: string;
  slug: string;
  description?: string;
  level: number;
  isSystem?: boolean;
  permissions: { module: string; action: string }[];
}

interface RoleFormProps {
  initialData?: Partial<RoleFormData>;
  onSubmit: (data: RoleFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MODULES = [
  "dashboard", "rbac", "users", "citizens", "complaints", 
  "service_requests", "registration", "correspondence", "documents",
  "notifications", "audit", "health", "education", "infrastructure",
  "agriculture", "finance", "administrative", "disaster_management", "inventory"
];
const ACTIONS = ["read", "create", "update", "delete", "approve", "export"];

// Helper to format strings like "service_requests" to "Service Requests"
const formatLabel = (str: string) => {
  return str.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export const RoleForm: React.FC<RoleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RoleFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    level: initialData?.level !== undefined ? initialData.level : 4,
    isSystem: initialData?.isSystem || false,
    permissions: initialData?.permissions || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Permission handling
  const hasPermission = (module: string, action: string) => {
    return formData.permissions.some(p => p.module === module && p.action === action);
  };

  const handlePermissionToggle = (module: string, action: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, permissions: [...prev.permissions, { module, action }] };
      } else {
        return { ...prev, permissions: prev.permissions.filter(p => !(p.module === module && p.action === action)) };
      }
    });
  };

  const handleModuleToggle = (module: string, checked: boolean) => {
    setFormData((prev) => {
      // Remove all actions for this module
      let newPerms = prev.permissions.filter(p => p.module !== module);
      if (checked) {
        // Add all actions back
        const modulePerms = ACTIONS.map(action => ({ module, action }));
        newPerms = [...newPerms, ...modulePerms];
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSelectAllToggle = (checked: boolean) => {
    if (checked) {
      const allPerms: {module: string, action: string}[] = [];
      MODULES.forEach(module => {
        ACTIONS.forEach(action => {
          allPerms.push({ module, action });
        });
      });
      setFormData(prev => ({ ...prev, permissions: allPerms }));
    } else {
      setFormData(prev => ({ ...prev, permissions: [] }));
    }
  };

  const isModuleFullySelected = (module: string) => {
    return ACTIONS.every(action => hasPermission(module, action));
  };
  
  const isModulePartiallySelected = (module: string) => {
    const selectedCount = ACTIONS.filter(action => hasPermission(module, action)).length;
    return selectedCount > 0 && selectedCount < ACTIONS.length;
  };

  const isAllSelected = () => {
    return MODULES.every(module => isModuleFullySelected(module));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("roles.role_name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={formData.isSystem}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("roles.slug")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            disabled={formData.isSystem}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("roles.description")}
          </label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          ></textarea>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("roles.access_level")}
          </label>
          <Select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value={0}>{t("roles.level_0")}</option>
            <option value={1}>{t("roles.level_1")}</option>
            <option value={2}>{t("roles.level_2")}</option>
            <option value={3}>{t("roles.level_3")}</option>
            <option value={4}>{t("roles.level_4")}</option>
            <option value={5}>{t("roles.level_5")}</option>
            <option value={6}>{t("roles.level_6")}</option>
            <option value={7}>{t("roles.level_7")}</option>
            <option value={8}>{t("roles.level_8")}</option>
            <option value={9}>{t("roles.level_9")}</option>
            <option value={10}>{t("roles.level_10")}</option>
            <option value={99}>{t("roles.level_99")}</option>
          </Select>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">{t("roles.permissions")}</h4>
        </div>
        
        <div className="mb-6 flex items-center gap-3 bg-gray-50 p-4 rounded-lg dark:bg-gray-800/50">
          <Checkbox checked={isAllSelected()} onChange={handleSelectAllToggle} />
          <span className="font-semibold text-gray-800 dark:text-white/90">{t("roles.select_all_permissions")}</span>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {MODULES.map(module => (
            <div key={module} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-5 last:border-0 dark:border-gray-800">
              <div className="md:col-span-1 flex items-start gap-3">
                <Checkbox 
                  checked={isModuleFullySelected(module) || isModulePartiallySelected(module)} 
                  onChange={(val) => handleModuleToggle(module, val)} 
                />
                <span className="font-medium text-gray-800 dark:text-white/90">{formatLabel(module)}</span>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACTIONS.map(action => (
                  <div key={`${module}-${action}`} className="flex items-center gap-2">
                    <Checkbox 
                      checked={hasPermission(module, action)} 
                      onChange={(val) => handlePermissionToggle(module, action, val)} 
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formatLabel(action)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
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
          {isSubmitting ? t("common.saving") : t("roles.save_role")}
        </button>
      </div>
    </form>
  );
};
