import Link from "next/link";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { getCustomers } from "./actions";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";
  const customers = await getCustomers(query);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Customers
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your customer base and view their history.
          </p>
        </div>
        <Link
          href="/dashboard/customers/new"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <form className="w-full">
            <input
              name="query"
              className="block w-full rounded-xl border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              placeholder="Search by name, phone or email..."
              defaultValue={query}
            />
          </form>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="h-12 px-6 align-middle font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Name & Email
                </th>
                <th className="h-12 px-6 align-middle font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="h-12 px-6 align-middle font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Address
                </th>
                <th className="h-12 px-6 align-middle font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">
                  Services
                </th>
                <th className="h-12 px-6 align-middle font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500 italic"
                  >
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-gray-50/50 group"
                  >
                    <td className="p-6 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {customer.name}
                          </Link>
                          <div className="text-xs text-gray-500">
                            {customer.email || "No email provided"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-middle text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="p-6 align-middle text-gray-600 max-w-[250px] truncate">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate" title={customer.address}>
                          {customer.address}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-middle text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {customer._count.services} Active
                      </span>
                    </td>
                    <td className="p-6 align-middle text-right">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
