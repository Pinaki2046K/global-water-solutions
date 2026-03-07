import { prisma } from "@/lib/db";
import { Plus, Search, Wrench, Activity, CheckCircle2, XCircle } from "lucide-react";
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

  const where: Prisma.ServiceWhereInput = { AND: [] };

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
    (where.AND as Prisma.ServiceWhereInput[]).push({
      amcContracts: { none: { status: "ACTIVE" } },
    });
  }

  let orderBy: Prisma.ServiceOrderByWithRelationInput = { installationDate: "desc" };
  if (sort === "date_asc") orderBy = { installationDate: "asc" };
  if (sort === "date_desc") orderBy = { installationDate: "desc" };

  const services = await prisma.service.findMany({
    where,
    include: {
      customer: true,
      _count: { select: { amcContracts: true, complaints: true } },
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

  const activeCount = services.filter((s) => s._count.amcContracts > 0).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div
      className="min-h-screen max-w-7xl mx-auto"
      style={{ fontFamily: "'DM Sans', 'Sora', sans-serif" }}
    >
      {/* ── Hero Header with gradient banner ─────────────────────── */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1e2a5e 0%, #2e3458 40%, #3b4a8a 70%, #4f5fa8 100%)",
          }}
        />
        {/* Dot-grid texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-blue-400 opacity-10 blur-3xl" />
        <div className="absolute -bottom-8 left-16 h-40 w-40 rounded-full bg-indigo-300 opacity-10 blur-2xl" />

        <div className="relative px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Icon badge */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 shadow-lg">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200 mb-1">
                Service Management
              </p>
              <h1
                className="text-3xl font-bold text-white leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Services
              </h1>
              <p className="mt-1 text-sm text-blue-200/80">
                {services.length} installations &mdash; manage customer service records
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/services/new"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2e3458] shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            Add Service
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Total */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-slate-50 -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Activity className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Services
              </p>
              <p
                className="text-2xl font-bold text-slate-800"
                style={{ letterSpacing: "-0.03em" }}
              >
                {services.length}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">All service installations</p>
        </div>

        {/* Active AMC */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-5 shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-100/60 -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Active AMC
              </p>
              <p
                className="text-2xl font-bold text-emerald-700"
                style={{ letterSpacing: "-0.03em" }}
              >
                {activeCount}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-emerald-500">Under active contracts</p>
        </div>

        {/* Inactive */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-5 shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-orange-100/60 -translate-y-8 translate-x-8" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <XCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                Inactive
              </p>
              <p
                className="text-2xl font-bold text-orange-600"
                style={{ letterSpacing: "-0.03em" }}
              >
                {inactiveCount}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-orange-400">No active AMC contract</p>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center z-10">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <div className="[&_input]:pl-10 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-white [&_input]:text-sm [&_input]:shadow-sm [&_input]:ring-1 [&_input]:ring-slate-200 [&_input:focus]:ring-2 [&_input:focus]:ring-[#2e3458]/40 [&_input:focus]:border-[#2e3458]/40 [&_input:focus]:outline-none">
            <SearchInput placeholder="Search by type or customer name…" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FilterDialog filters={serviceFilters} />
        </div>
      </div>

      {/* ── Services Grid ─────────────────────────────────────────── */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 shadow-sm">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}
          >
            <Wrench className="h-9 w-9 text-indigo-300" />
          </div>
          <p className="text-slate-600 text-sm font-semibold mb-1">
            No services found
          </p>
          <p className="text-slate-400 text-xs mb-6">
            Try adjusting your filters or add a new service.
          </p>
          <Link
            href="/dashboard/services/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e3458] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#232846] hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first service
          </Link>
        </div>
      ) : (
        <ServicesGrid services={services} />
      )}
    </div>
  );
}