import React, { useState } from "react";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import NepaliDate from "nepali-date-converter";

type PropsType = {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string; // BS Date in YYYY-MM-DD
  onChange?: (bsDate: string, adDate: Date | null) => void;
};

export default function NepaliDatePicker({
  id,
  label,
  placeholder = "YYYY-MM-DD",
  value,
  onChange,
}: PropsType) {
  const [localValue, setLocalValue] = useState(value || "");
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    setLocalValue(val);

    if (val.length === 10) {
      try {
        // Validate format YYYY-MM-DD
        const parts = val.split("-");
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // 0-indexed in nepali-date-converter
          const day = parseInt(parts[2], 10);
          
          const bsDateObj = new NepaliDate(year, month, day);
          const adDate = bsDateObj.toJsDate();
          setError(false);
          
          if (onChange) {
            onChange(val, adDate);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    } else {
      setError(val.length > 0 && val.length < 10);
    }
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={10}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 ${
            error 
              ? "border-red-300 focus:border-red-300 focus:ring-red-500/20 dark:border-red-700"
              : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
          }`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">Invalid BS Date (YYYY-MM-DD)</p>}
    </div>
  );
}
