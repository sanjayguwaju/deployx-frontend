import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { ComboboxSelect } from "../ui/form/ComboboxSelect";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  designation?: string;
  isActive: boolean;
  roles?: string[];
  wardId?: string;
}

interface Role {
  _id: string;
  name: string;
  slug: string;
}

interface Ward {
  _id: string;
  nameNp?: string;
  wardNumber: number;
}

const DESIGNATIONS = [
  "Chairperson / Mayor",
  "Vice-Chairperson / Deputy Mayor",
  "Chief Administrative Officer (CAO)",
  "Section Chief",
  "Officer",
  "Assistant Officer",
  "Senior Assistant",
  "Assistant",
  "Junior Assistant",
  "Support Staff",
  "Ward Officer",
  "Other"
];

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    phone: initialData?.phone || "",
    designation: initialData?.designation || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    roles: initialData?.roles || [],
    wardId: initialData?.wardId || "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const randomString = Math.random().toString(36).slice(-6);
    const generated = `User@${randomString}#1`;
    setFormData((prev) => ({ ...prev, password: generated }));
    setShowPassword(true);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [rolesRes, wardsRes] = await Promise.all([
          api.get("/roles"),
          api.get("/wards"),
        ]);
        if (rolesRes.data.success) {
          const rolesData = rolesRes.data.data;
          setRoles(Array.isArray(rolesData) ? rolesData : rolesData.roles || rolesData.data || []);
        }
        if (wardsRes.data.success) {
          const wardsData = wardsRes.data.data;
          setWards(Array.isArray(wardsData) ? wardsData : wardsData.wards || wardsData.data || []);
        }
      } catch (err) {
        // Silently ignore — dropdowns will just be empty
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => {
      const current = prev.roles || [];
      if (current.includes(roleId)) {
        return { ...prev, roles: current.filter((r) => r !== roleId) };
      } else {
        return { ...prev, roles: [...current, roleId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) delete dataToSubmit.password;
    if (!dataToSubmit.wardId) delete dataToSubmit.wardId;
    onSubmit(dataToSubmit);
  };

  const isEditMode = !!initialData?.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{t("users.full_name")} <span className="text-red-500">*</span></label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("users.email")} <span className="text-red-500">*</span></label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("users.password")} {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <button
              type="button"
              onClick={generatePassword}
              className="text-xs flex items-center text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium transition-colors"
            >
              <RefreshCw size={12} className="mr-1" /> {t("users.generate", "Generate")}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required={!isEditMode}
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? t("users.password_placeholder", "Leave blank to keep current") : ""}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>{t("users.phone")}</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("users.designation")}</label>
          <ComboboxSelect
            options={DESIGNATIONS.map(d => ({ value: d, label: d }))}
            value={formData.designation || ""}
            onChange={(val) => setFormData((prev) => ({ ...prev, designation: val }))}
            placeholder="— Select Designation —"
            hideSearchIcon={true}
          />
        </div>
        <div>
          <label className={labelClass}>{t("users.ward_assignment")}</label>
          <ComboboxSelect
            options={wards.map((ward) => ({
              value: ward._id,
              label: t("users.ward_option", { number: ward.wardNumber, name: ward.nameNp || "" }) as string
            }))}
            value={formData.wardId || ""}
            onChange={(val) => setFormData((prev) => ({ ...prev, wardId: val }))}
            placeholder={t("users.no_ward") as string}
            disabled={loadingDropdowns}
            hideSearchIcon={true}
          />
        </div>
      </div>

      {/* Role Assignment */}
      <div>
        <label className={labelClass}>{t("users.roles")} {loadingDropdowns && <span className="text-gray-400 text-xs ml-1">({t("common.loading")})</span>}</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {roles.map((role) => {
            const isSelected = (formData.roles || []).includes(role._id);
            return (
              <button
                key={role._id}
                type="button"
                onClick={() => handleRoleToggle(role._id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium text-left transition-colors ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                {role.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Account */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{t("users.active_account")}</label>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t("common.cancel")}
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">
          {isSubmitting ? t("common.saving") : t("users.save_user")}
        </button>
      </div>
    </form>
  );
};
