"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPayment } from "../actions";
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
      {pending ? "Saving..." : "Record Payment"}
    </button>
  );
}

export default function NewPaymentForm({
  customers,
  amcs,
}: {
  customers: { id: string; name: string; phone: string }[];
  amcs: { id: string; customerId: string; service: { serviceType: string } }[];
}) {
  const [state, setState] = useState<{
    error?: Record<string, string[]>;
    message?: string;
  } | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const filteredAmcs = amcs.filter(
    (amc) => amc.customerId === selectedCustomerId,
  );

  async function clientAction(formData: FormData) {
    const result = await createPayment(formData);
    if (result?.error || result?.message) {
      setState(result);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/payments"
          className="group inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 transition-all hover:border-indigo-200 hover:bg-indigo-50"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 transition-colors group-hover:text-indigo-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Record New Payment
          </h2>
          <p className="text-sm text-gray-500">
            Enter details to record a new payment transaction.
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
                htmlFor="amcId"
                className="text-sm font-semibold text-gray-700"
              >
                AMC Contract (Optional)
              </label>
              <select
                id="amcId"
                name="amcId"
                disabled={!selectedCustomerId || filteredAmcs.length === 0}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
              >
                <option value="">
                  {selectedCustomerId
                    ? filteredAmcs.length === 0
                      ? "No AMCs found for this customer"
                      : "Optional: Select an AMC"
                    : "Select a customer first"}
                </option>
                {filteredAmcs.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.service.serviceType}
                  </option>
                ))}
              </select>
              {state?.error?.amcId && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.amcId[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-semibold text-gray-700"
              >
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                min="1"
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="Ex. 1500"
              />
              {state?.error?.amount && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.amount[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-semibold text-gray-700"
              >
                Payment Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue="PAID"
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              >
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              {state?.error?.status && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.status[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="paymentMode"
                className="text-sm font-semibold text-gray-700"
              >
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentMode"
                name="paymentMode"
                required
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              >
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
              {state?.error?.paymentMode && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.paymentMode[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="paymentDate"
                className="text-sm font-semibold text-gray-700"
              >
                Payment Date
              </label>
              <input
                id="paymentDate"
                name="paymentDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              {state?.error?.paymentDate && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                  {state.error.paymentDate[0]}
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
