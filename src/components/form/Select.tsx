import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'defaultValue'> {
  options?: Option[];
  placeholder?: string;
  onChange?: (e: any) => void;
  className?: string;
  defaultValue?: string | number;
  value?: string | number;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  options = [],
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue,
  value,
  name,
  required,
  children
}) => {
  // Parse children to extract options if `options` prop is not provided or empty
  const parsedOptions = [...options];
  let extractedPlaceholder = placeholder;

  if (children) {
    React.Children.toArray(children).forEach((child: any) => {
      if (React.isValidElement(child) && child.type === "option") {
        const props = (child as any).props;
        const childValue = props.value;
        const childLabel = props.children;
        if ((childValue === "" || childValue === undefined) && props.disabled) {
          extractedPlaceholder = childLabel as string;
        } else if (childValue !== undefined) {
          parsedOptions.push({ value: String(childValue), label: String(childLabel) });
        }
      } else if (React.isValidElement(child) && child.type === React.Fragment) {
         const props = (child as any).props;
         const fragChildren = props.children;
         React.Children.toArray(fragChildren).forEach((subChild: any) => {
            if (React.isValidElement(subChild) && subChild.type === "option") {
              const subProps = (subChild as any).props;
              const subChildValue = subProps.value;
              const subChildLabel = subProps.children;
              if (subChildValue !== undefined && subChildValue !== "") {
                parsedOptions.push({ value: String(subChildValue), label: String(subChildLabel) });
              }
            }
         });
      }
    });
  }

  const handleValueChange = (val: string) => {
    if (onChange) {
      // Mock event object for existing onChange handlers that expect e.target.value
      const e = {
        target: { name, value: val },
        currentTarget: { name, value: val },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(e as any);
    }
  };

  return (
    <SelectPrimitive.Root
      defaultValue={defaultValue !== undefined ? String(defaultValue) : undefined}
      value={value !== undefined ? String(value) : undefined}
      onValueChange={handleValueChange}
      name={name}
      required={required}
    >
      <SelectPrimitive.Trigger
        className={`flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
      >
        <SelectPrimitive.Value placeholder={extractedPlaceholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-10050 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="max-h-[300px] w-full min-w-(--radix-select-trigger-width) p-1">
            {parsedOptions.map((option, index) => (
              <SelectPrimitive.Item
                key={`${option.value}-${index}`}
                value={option.value}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

export default Select;
