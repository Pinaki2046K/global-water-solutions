"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface StatusFilterProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  paramName?: string; // e.g. "status"
}

export function StatusFilter({
  options,
  placeholder = "Filter by status",
  paramName = "status",
}: StatusFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    // Reset page to 1
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      className="rounded-md border border-gray-200 py-[9px] pl-3 pr-8 text-sm outline-2 placeholder:text-gray-500"
      onChange={(e) => handleSelect(e.target.value)}
      defaultValue={searchParams.get(paramName)?.toString()}
    >
      <option value="all">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
