"use client";

import { useFormStatus } from "react-dom";
import { addService, createAMC, logComplaint, recordPayment } from "./actions";
import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        label
      )}
    </button>
  );
}

const inputClasses =
  "mt-1 block w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

export function AddServiceForm({
  customerId,
  onClose,
}: {
  customerId: string;
  onClose: () => void;
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg ring-4 ring-indigo-50/50 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">New Service</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Add a newly installed device.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        action={async (formData) => {
          await addService(customerId, formData);
          onClose(); // In real app, check for success
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="serviceType" className={labelClasses}>
            Service Type
          </label>
          <div className="relative">
            <select
              name="serviceType"
              id="serviceType"
              className={inputClasses}
            >
              <option value="RO System">RO System</option>
              <option value="Water Purifier">Water Purifier</option>
              <option value="Industrial Plant">Industrial Plant</option>
              <option value="Softener">Softener</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="installationDate" className={labelClasses}>
            Installation Date
          </label>
          <input
            type="date"
            name="installationDate"
            required
            className={inputClasses}
          />
        </div>
        <div className="pt-2">
          <SubmitButton label="Add Service" />
        </div>
      </form>
    </div>
  );
}

export function AddAMCForm({
  customerId,
  services,
  onClose,
}: {
  customerId: string;
  services: any[];
  onClose: () => void;
}) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 mb-6 flex items-center">
        <span className="bg-red-100 p-1 rounded-full mr-2">
          {" "}
          <X className="h-3 w-3" />{" "}
        </span>
        Please add a service first before creating an AMC contract.
        <button
          onClick={onClose}
          className="ml-auto text-red-700 underline font-medium"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-lg ring-4 ring-green-50/50 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">New AMC Contract</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Create a maintenance contract for a service.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        action={async (formData) => {
          await createAMC(customerId, formData);
          onClose();
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="serviceId" className={labelClasses}>
            Select Service
          </label>
          <select name="serviceId" className={inputClasses}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.serviceType} (Installed:{" "}
                {new Date(s.installationDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className={labelClasses}>
              AMC Start Date
            </label>
            <input
              type="date"
              name="startDate"
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="amount" className={labelClasses}>
              Contract Amount
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                className={cn(inputClasses, "pl-8")}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <SubmitButton label="Create Contract" />
        </div>
      </form>
    </div>
  );
}

export function AddComplaintForm({
  customerId,
  services,
  onClose,
}: {
  customerId: string;
  services: any[];
  onClose: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-lg ring-4 ring-red-50/50 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Log Complaint</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Register a customer issue or request.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        action={async (formData) => {
          await logComplaint(customerId, formData);
          onClose();
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="serviceId" className={labelClasses}>
            Affected Service <span className="text-red-500">*</span>
          </label>
          <select name="serviceId" required className={inputClasses}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.serviceType} (Installed:{" "}
                {new Date(s.installationDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className={labelClasses}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={3}
            className={cn(inputClasses, "resize-none")}
            placeholder="Describe the issue..."
          />
        </div>
        <div className="pt-2">
          <SubmitButton label="Log Complaint" />
        </div>
      </form>
    </div>
  );
}

export function AddPaymentForm({
  customerId,
  services,
  onClose,
}: {
  customerId: string;
  services: any[];
  onClose: () => void;
}) {
  // Flatten AMCs from services
  const amcs = services.flatMap((s) => s.amcContracts || []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg ring-4 ring-gray-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Record Payment</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Log a received payment manually.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form
        action={async (formData) => {
          await recordPayment(customerId, formData);
          onClose();
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className={labelClasses}>
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 sm:text-sm">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                required
                className={cn(inputClasses, "pl-8")}
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label htmlFor="paymentMode" className={labelClasses}>
              Payment Mode
            </label>
            <select name="paymentMode" className={inputClasses}>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="UPI">UPI</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="amcId" className={labelClasses}>
            Link to AMC (Optional)
          </label>
          <select name="amcId" className={inputClasses}>
            <option value="">-- None --</option>
            {amcs.map((amc: any) => (
              <option key={amc.id} value={amc.id}>
                AMC {new Date(amc.startDate).toLocaleDateString()} (₹
                {amc.amount}) - {amc.status}
              </option>
            ))}
          </select>
        </div>
        <div className="pt-2">
          <SubmitButton label="Record Payment" />
        </div>
      </form>
    </div>
  );
}
