import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ServicesGrid } from "@/components/dashboard/services/services-grid";
import { SearchInput } from "@/components/ui/search-input";
import { FilterDialog, FilterCategory } from "@/components/ui/filter-dialog";
import { Prisma } from "@/generated/prisma/client";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    type?: string;
    status?: string;
  }>;
}) {
  const query = (await searchParams)?.query || "";
  const sort = (await searchParams)?.sort || "date_desc";
  const typeFilter = (await searchParams)?.type || "";
  const statusFilter = (await searchParams)?.status || "";

  // Build Where Clause
  const where: Prisma.ServiceWhereInput = {
    AND: [],
  };

  if (query) {
    (where.AND as Prisma.ServiceWhereInput[]).push({
      OR: [
        { serviceType: { contains: query, mode: "insensitive" } },
        { customer: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
  }

  if (typeFilter) {
    (where.AND as Prisma.ServiceWhereInput[]).push({
      serviceType: { contains: typeFilter, mode: "insensitive" },
    });
  }

  if (statusFilter === "active") {
    (where.AND as Prisma.ServiceWhereInput[]).push({
      amcContracts: { some: { status: "ACTIVE" } },
    });
  } else if (statusFilter === "inactive") {
    // If user specifically requests inactive, we might want services WITHOUT an active AMC
    (where.AND as Prisma.ServiceWhereInput[]).push({
      amcContracts: { none: { status: "ACTIVE" } },
    });
  }

  // Build Order By
  let orderBy: Prisma.ServiceOrderByWithRelationInput = {
    installationDate: "desc",
  };
  if (sort === "date_asc") orderBy = { installationDate: "asc" };
  if (sort === "date_desc") orderBy = { installationDate: "desc" };

  const services = await prisma.service.findMany({
    where,
    include: {
      customer: true,
      _count: {
        select: {
          amcContracts: true,
          complaints: true,
        },
      },
    },
    orderBy,
  });

  const serviceFilters: FilterCategory[] = [
    {
      id: "sort",
      label: "Sort By",
      type: "radio",
      options: [
        { label: "Newest Installation", value: "date_desc" },
        { label: "Oldest Installation", value: "date_asc" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "radio",
      options: [
        { label: "All", value: "" },
        { label: "Active (Has Active AMC)", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      id: "type",
      label: "Service Type",
      type: "text",
      placeholder: "e.g. Split AC, Model X...",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Services
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer service installations.
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#2e3458] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-[#232846] transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full max-w-md">
          <SearchInput placeholder="Search services..." />
        </div>
        <FilterDialog filters={serviceFilters} />
      </div>

      <ServicesGrid services={services} />
    </div>
  );
}
