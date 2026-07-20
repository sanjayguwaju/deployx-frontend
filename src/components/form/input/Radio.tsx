import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export const RadioGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) => {
  return <RadioGroupPrimitive.Root className={className} {...props} />;
};

interface RadioProps {
  id: string; // Unique ID for the radio button
  value: string; // Value of the radio button
  label: string; // Label for the radio button
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state
}

export const Radio: React.FC<RadioProps> = ({
  id,
  value,
  label,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-60" : ""} ${className}`}>
      <RadioGroupPrimitive.Item
        id={id}
        value={value}
        disabled={disabled}
        className="peer h-5 w-5 rounded-full border border-gray-300 bg-white text-brand-500 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:data-[state=checked]:border-brand-500 dark:data-[state=checked]:bg-brand-500 flex items-center justify-center"
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-white block" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <label
        htmlFor={id}
        className={`text-sm font-medium ${
          disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-gray-400 cursor-pointer"
        }`}
      >
        {label}
      </label>
    </div>
  );
};
