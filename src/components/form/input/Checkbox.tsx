import type React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`flex items-center space-x-3 ${disabled ? "opacity-60" : ""}`}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(checkedState) => onChange(checkedState === true)}
        disabled={disabled}
        className={`peer relative flex h-5 w-5 shrink-0 appearance-none items-center justify-center rounded-md border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:border-gray-700 dark:bg-gray-800 dark:data-[state=checked]:border-brand-500 dark:data-[state=checked]:bg-brand-500 ${className}`}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check size={14} strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
