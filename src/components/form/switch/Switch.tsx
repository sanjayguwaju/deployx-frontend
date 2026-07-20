import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useState } from "react";

interface SwitchProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // Added prop to toggle color theme
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  const id = `switch-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const activeColorClass = color === "blue" 
    ? "data-[state=checked]:bg-brand-500" 
    : "data-[state=checked]:bg-gray-800 dark:data-[state=checked]:bg-white/10";

  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-60" : ""}`}>
      <SwitchPrimitive.Root
        id={id}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-white/10 ${activeColorClass}`}
      >
        <SwitchPrimitive.Thumb
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-theme-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
      </SwitchPrimitive.Root>
      <label
        htmlFor={id}
        className={`text-sm font-medium ${
          disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-gray-400 cursor-pointer"
        } select-none`}
      >
        {label}
      </label>
    </div>
  );
};

export default Switch;
