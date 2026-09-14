import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import api from "../../api/axios";

export interface DemandFormData {
  employerId: string;
  profession: string;
  country: string;
  quantityRequired: number;
  salary?: {
    amount: number;
    currency: string;
  };
  accommodation?: {
    provided: boolean;
    details?: string;
  };
  food?: {
    provided: boolean;
    details?: string;
  };
  contract?: {
    durationMonths: number;
  };
  interviewDate?: string;
  notes?: string;
}

interface DemandFormProps {
  initialData?: Partial<DemandFormData>;
  onSubmit: (data: DemandFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface EmployerOption {
  _id: string;
  companyName: string;
  country: string;
}

export function DemandForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: DemandFormProps) {
  const [employers, setEmployers] = useState<EmployerOption[]>([]);
  const [loadingEmployers, setLoadingEmployers] = useState(false);

  const [formData, setFormData] = useState<DemandFormData>({
    employerId: initialData?.employerId || "",
    profession: initialData?.profession || "",
    country: initialData?.country || "",
    quantityRequired: initialData?.quantityRequired || 1,
    salary: {
      amount: initialData?.salary?.amount || 0,
      currency: initialData?.salary?.currency || "USD",
    },
    accommodation: {
      provided: initialData?.accommodation?.provided ?? false,
      details: initialData?.accommodation?.details || "",
    },
    food: {
      provided: initialData?.food?.provided ?? false,
      details: initialData?.food?.details || "",
    },
    contract: {
      durationMonths: initialData?.contract?.durationMonths || 24,
    },
    interviewDate: initialData?.interviewDate ? new Date(initialData.interviewDate).toISOString().split("T")[0] : "",
    notes: initialData?.notes || "",
  });

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoadingEmployers(true);
        const res = await api.get("/employers?pageSize=100");
        if (res.data.success) {
          const raw = res.data.data;
          setEmployers(Array.isArray(raw) ? raw : raw.employers || raw.data || []);
        }
      } catch (err) {
        console.error("Failed to load employers:", err);
      } finally {
        setLoadingEmployers(false);
      }
    };
    fetchEmployers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (parent: "salary" | "accommodation" | "food" | "contract", field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
  };

  const handleEmployerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employerId = e.target.value;
    const selected = employers.find((emp) => emp._id === employerId);
    setFormData((prev) => ({
      ...prev,
      employerId,
      country: selected?.country || prev.country,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Demand & Employer Info */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/5 dark:bg-white/3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          General Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="employerId">Foreign Employer *</Label>
            <select
              id="employerId"
              name="employerId"
              value={formData.employerId}
              onChange={handleEmployerSelect}
              required
              disabled={loadingEmployers}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">{loadingEmployers ? "Loading employers..." : "Select foreign employer"}</option>
              {employers.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.companyName} ({emp.country})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="profession">Job Position / Profession *</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              placeholder="e.g. Scaffolder, Pipe Fitter, Nurse"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="country">Destination Country *</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="e.g. UAE, Saudi Arabia, Qatar, Malaysia"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="quantityRequired">Quota / Required Pax *</Label>
            <Input
              id="quantityRequired"
              name="quantityRequired"
              type="number"
              min={1}
              value={formData.quantityRequired ? String(formData.quantityRequired) : "1"}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantityRequired: parseInt(e.target.value) || 1 }))}
              required
              placeholder="e.g. 50"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Compensation & Terms */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-white/5 dark:bg-white/3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
          Salary & Contract Terms
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="salaryAmount">Basic Salary</Label>
            <Input
              id="salaryAmount"
              name="salaryAmount"
              type="number"
              min={0}
              value={formData.salary?.amount ? String(formData.salary.amount) : ""}
              onChange={(e) => handleNestedChange("salary", "amount", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 1500"
              className="h-9 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="salaryCurrency">Currency</Label>
            <select
              id="salaryCurrency"
              value={formData.salary?.currency || "USD"}
              onChange={(e) => handleNestedChange("salary", "currency", e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="USD">USD ($)</option>
              <option value="AED">AED (Dirham)</option>
              <option value="SAR">SAR (Riyal)</option>
              <option value="QAR">QAR (Riyal)</option>
              <option value="KWD">KWD (Dinar)</option>
              <option value="OMR">OMR (Rial)</option>
              <option value="BHD">BHD (Dinar)</option>
              <option value="MYR">MYR (Ringgit)</option>
              <option value="EUR">EUR (€)</option>
              <option value="NPR">NPR (Rs)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="contractDuration">Contract Duration (Months)</Label>
            <Input
              id="contractDuration"
              type="number"
              min={1}
              value={formData.contract?.durationMonths ? String(formData.contract.durationMonths) : "24"}
              onChange={(e) => handleNestedChange("contract", "durationMonths", parseInt(e.target.value) || 24)}
              placeholder="e.g. 24"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Perks: Accommodation & Food */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.accommodation?.provided ?? false}
                onChange={(e) => handleNestedChange("accommodation", "provided", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400 dark:border-gray-700"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Accommodation</span>
            </label>
            {formData.accommodation?.provided && (
              <Input
                value={formData.accommodation.details || ""}
                onChange={(e) => handleNestedChange("accommodation", "details", e.target.value)}
                placeholder="Details e.g. Sharing room with utilities"
                className="h-8 text-xs"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.food?.provided ?? false}
                onChange={(e) => handleNestedChange("food", "provided", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400 dark:border-gray-700"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Food Provided / Allowance</span>
            </label>
            {formData.food?.provided && (
              <Input
                value={formData.food.details || ""}
                onChange={(e) => handleNestedChange("food", "details", e.target.value)}
                placeholder="Details e.g. 3 meals or 300 allowance"
                className="h-8 text-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Schedule & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="interviewDate">Tentative Interview / Selection Date</Label>
          <Input
            id="interviewDate"
            name="interviewDate"
            type="date"
            value={formData.interviewDate}
            onChange={handleChange}
            className="h-9 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="notes">Special Requirements / Notes</Label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Height, age limit, medical restrictions, or specific certifications required"
            className="w-full rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Demand"}
        </Button>
      </div>
    </form>
  );
}
