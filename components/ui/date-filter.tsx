"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function DateFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleDateChange(param: "startDate" | "endDate", value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 text-gray-500"
        onChange={(e) => handleDateChange("startDate", e.target.value)}
        defaultValue={searchParams.get("startDate")?.toString()}
        placeholder="Start Date"
      />
      <span className="text-gray-400">-</span>
      <input
        type="date"
        className="rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 text-gray-500"
        onChange={(e) => handleDateChange("endDate", e.target.value)}
        defaultValue={searchParams.get("endDate")?.toString()}
        placeholder="End Date"
      />
    </div>
  );
}
