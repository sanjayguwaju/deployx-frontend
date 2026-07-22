import { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  passportNumber?: string;
  phone?: string;
  email?: string;
  profession?: string;
  status: string;
  gender?: "male" | "female" | "other";
}

interface CandidateFormProps {
  initialData?: Partial<CandidateFormData>;
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CandidateForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CandidateFormProps) {
  const [formData, setFormData] = useState<CandidateFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    passportNumber: initialData?.passportNumber || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    profession: initialData?.profession || "",
    status: initialData?.status || "registered",
    gender: initialData?.gender || "male",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passportNumber">Passport Number</Label>
            <Input
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            >
              <option value="registered">Registered</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="selected">Selected</option>
              <option value="medical">Medical</option>
              <option value="visa_processing">Visa Processing</option>
              <option value="ticket_booked">Ticket Booked</option>
              <option value="deployed">Deployed</option>
              <option value="rejected">Rejected</option>
            </select>
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
          {isSubmitting ? "Saving..." : "Save Candidate"}
        </Button>
      </div>
    </form>
  );
}
