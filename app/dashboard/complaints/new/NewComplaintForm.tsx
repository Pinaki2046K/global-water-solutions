"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createComplaint } from "../actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
    >
      <Save className="mr-2 h-4 w-4" />
      {pending ? "Saving..." : "Create Ticket"}
    </button>
  );
}

export default function NewComplaintForm({
  customers,
  services,
}: {
  customers: { id: string; name: string; phone: string }[];
  services: { id: string; customerId: string; serviceType: string }[];
}) {
  const [state, setState] = useState<{
    error?: Record<string, string[]>;
    message?: string;
  } | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const filteredServices = services.filter(
    (s) => s.customerId === selectedCustomerId,
  );

  async function clientAction(formData: FormData) {
    const result = await createComplaint(formData);
    if (result?.error || result?.message) {
      setState(result);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/complaints"
          className="group inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 transition-all hover:border-indigo-200 hover:bg-indigo-50"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 transition-colors group-hover:text-indigo-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Add New Complaint
          </h2>
          <p className="text-sm text-gray-500">
            Open a new service request or complaint ticket.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <form action={clientAction} className="p-8">
          {state?.message && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{state.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="space-y-2 col-span-2">
              <label
                htmlFor="customerId"
                className="text-sm font-semibold text-gray-700"
              >
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                id="customerId"
                name="customerId"
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
              {state?.error?.customerId && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.customerId[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <label
                htmlFor="serviceId"
                className="text-sm font-semibold text-gray-700"
              >
                Service Record <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceId"
                name="serviceId"
                required
                disabled={!selectedCustomerId || filteredServices.length === 0}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
              >
                <option value="">
                  {selectedCustomerId
                    ? filteredServices.length === 0
                      ? "No services found for this customer"
                      : "Select a service record"
                    : "Select a customer first"}
                </option>
                {filteredServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.serviceType}
                  </option>
                ))}
              </select>
              {state?.error?.serviceId && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.serviceId[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <label
                htmlFor="status"
                className="text-sm font-semibold text-gray-700"
              >
                Ticket Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue="OPEN"
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              {state?.error?.status && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.status[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700"
              >
                Issue / Request Description{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                placeholder="Please describe the issue in detail..."
              />
              {state?.error?.description && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.description[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100/50 mt-8">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
