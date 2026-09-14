import { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

export interface EmployerFormData {
  companyName: string;
  country: string;
  industry?: string;
  logoUrl?: string;
  paymentStatus: "good_standing" | "overdue" | "suspended";
  contactPersons: {
    name: string;
    designation?: string;
    phone?: string;
    email?: string;
  }[];
}

interface EmployerFormProps {
  initialData?: Partial<EmployerFormData>;
  onSubmit: (data: EmployerFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EmployerForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: EmployerFormProps) {
  const [formData, setFormData] = useState<EmployerFormData>({
    companyName: initialData?.companyName || "",
    country: initialData?.country || "",
    industry: initialData?.industry || "",
    logoUrl: initialData?.logoUrl || "",
    paymentStatus: initialData?.paymentStatus || "good_standing",
    contactPersons: initialData?.contactPersons?.length ? initialData.contactPersons : [
      { name: "", designation: "", phone: "", email: "" }
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...formData.contactPersons];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData((prev) => ({ ...prev, contactPersons: newContacts }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        {/* Company Details */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Company Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="e.g. Al Futtaim Group"
              />
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="e.g. UAE"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Construction"
              />
            </div>

            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              >
                <option value="good_standing">Good Standing</option>
                <option value="overdue">Overdue</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Primary Contact Person */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Primary Contact Person
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Contact Name *</Label>
              <Input
                value={formData.contactPersons[0].name}
                onChange={(e) => handleContactChange(0, "name", e.target.value)}
                required
                placeholder="e.g. John Smith"
              />
            </div>

            <div>
              <Label>Designation</Label>
              <Input
                value={formData.contactPersons[0].designation}
                onChange={(e) => handleContactChange(0, "designation", e.target.value)}
                placeholder="e.g. HR Director"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.contactPersons[0].email}
                onChange={(e) => handleContactChange(0, "email", e.target.value)}
                placeholder="e.g. contact@company.com"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={formData.contactPersons[0].phone}
                onChange={(e) => handleContactChange(0, "phone", e.target.value)}
                placeholder="e.g. +971 4 123 4567"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Employer"}
        </Button>
      </div>
    </form>
  );
}
