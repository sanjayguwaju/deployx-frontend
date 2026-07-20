import React, { useState } from 'react';
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility function to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxSelectProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  hideSearchIcon?: boolean;
}

export const ComboboxSelect: React.FC<ComboboxSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
  name,
  hideSearchIcon = false
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover.Root open={open} onOpenChange={(isOpen) => {
      if (!disabled) setOpen(isOpen);
    }}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "relative w-full flex items-center justify-between cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 py-2.5 pl-3 pr-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 transition-colors",
            disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : "cursor-pointer",
            className
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            {!hideSearchIcon && (
              <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" aria-hidden="true" />
            )}
            <span className={cn("block truncate text-sm text-gray-900 dark:text-white", !selectedOption && "text-gray-500 dark:text-gray-400")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          
          <div className="flex items-center ml-2 shrink-0">
            {selectedOption && (
              <div
                className="p-1 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!disabled) onChange('');
                }}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            )}
            <ChevronDown
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-10050 w-(--radix-popover-trigger-width) rounded-md border border-gray-200 bg-white p-0 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900"
        >
          <Command className="w-full rounded-md" loop>
            <div className="flex items-center border-b border-gray-200 px-3 py-2 dark:border-gray-800" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
              <Command.Input
                placeholder="Search..."
                className="flex h-6 w-full rounded-md bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
              />
            </div>
            
            <Command.List className="max-h-60 overflow-y-auto p-1">
              <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Nothing found.
              </Command.Empty>
              <Command.Group>
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <Command.Item
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-10 pr-4 text-sm outline-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                        "data-[selected=true]:bg-brand-50 data-[selected=true]:text-brand-900 dark:data-[selected=true]:bg-brand-900/30 dark:data-[selected=true]:text-white",
                        "text-gray-900 dark:text-gray-200"
                      )}
                    >
                      <span className={cn("block truncate", isSelected ? 'font-medium' : 'font-normal')}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-600 dark:text-brand-400 group-data-[selected=true]:text-brand-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    </>
  );
};
