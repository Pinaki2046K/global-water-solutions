import {
  Users,
  FileText,
  AlertTriangle,
  MessageSquare,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import {
  getDashboardStats,
  getExpiringAMCs,
  getRecentComplaints,
  getMonthlyRevenue,
} from "@/app/dashboard/actions";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const expiringAMCs = await getExpiringAMCs();
  const recentComplaints = await getRecentComplaints();
  const revenueData = await getMonthlyRevenue();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Check your business performance and potential issues.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add DateRangePicker here if needed later */}
          <Link
            href="/dashboard/customers/new"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:pointer-events-none disabled:opacity-50"
          >
            + Add Customer
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </span>
              </div>
            </div>
            <div className="rounded-full bg-indigo-50 p-3">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[70%]" />
          </div>
        </div>

        {/* Active AMCs Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active AMCs</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.activeAMCs}
                </span>
              </div>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[85%]" />
          </div>
        </div>

        {/* Pending Dues Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Dues</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{stats.pendingAmount}
                </span>
              </div>
              <p className="text-xs text-red-500 mt-1 font-medium">
                {stats.pendingAMCsCount} contracts pending
              </p>
            </div>
            <div className="rounded-full bg-red-50 p-3">
              <IndianRupee className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[30%]" />
          </div>
        </div>

        {/* Open Complaints Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Open Complaints
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.openComplaintsCount}
                </span>
                <span className="text-xs font-medium text-orange-600 flex items-center bg-orange-50 px-1.5 py-0.5 rounded-full">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Action Needed
                </span>
              </div>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[45%]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart Section */}
        <div className="col-span-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500">
                Monthly income form AMCs and Services.
              </p>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View Report
            </button>
          </div>
          <div className="pl-2 h-[300px]">
            <OverviewChart data={revenueData} />
          </div>
        </div>

        {/* Recent Activity / Side Panel */}
        <div className="col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-medium leading-none">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Expiring AMCs & New Complaints
            </p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {/* Expiring AMCs Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                AMCs Expiring Soon
              </h4>
              {expiringAMCs.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No AMCs expiring in next 30 days.
                </p>
              ) : (
                <div className="space-y-3">
                  {expiringAMCs.map((amc) => (
                    <div
                      key={amc.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {amc.customer.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Exp: {amc.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/customers/${amc.customer.id}`}
                        className="rounded-full bg-gray-50 p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 my-4" />

            {/* Recent Complaints Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
                Recent Complaints
              </h4>
              {recentComplaints.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No recent complaints.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {c.customer.name}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                              c.status === "OPEN"
                                ? "bg-red-50 text-red-700 ring-red-600/10"
                                : "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
                            )}
                          >
                            {c.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {c.description}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/customers/${c.customer.id}`}
                        className="rounded-full bg-gray-50 p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
