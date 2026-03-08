"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { AMCModal } from "./amc-modal";

interface AMCPayment {
  status: string;
  amount: number;
}

interface AMC {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  amount: number;
  payments: AMCPayment[];
  customer: {
    name: string;
  };
  service: {
    serviceType: string;
  };
  [key: string]: unknown;
}

interface AMCsGridProps {
  amcs: AMC[];
  referenceDate?: Date;
}

// ── Framer Motion Variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  },
};

export function AMCsGrid({ amcs, referenceDate }: AMCsGridProps) {
  const [selectedAMC, setSelectedAMC] = useState<AMC | null>(null);

  const now = referenceDate || new Date();

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout 
        className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {amcs.length === 0 ? (
            /* ── Empty State ── */
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="col-span-full py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/60 shadow-sm border border-slate-100 mb-5 text-slate-400">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                No Contracts Found
              </h3>
              <p className="mt-2 text-base text-slate-500 max-w-sm text-center">
                There are currently no active or pending AMC contracts matching your criteria.
              </p>
            </motion.div>
          ) : (
            amcs.map((amc) => {
              const startDate = new Date(amc.startDate);
              const endDate = new Date(amc.endDate);
              const totalDuration = endDate.getTime() - startDate.getTime();
              const elapsed = now.getTime() - startDate.getTime();
              let progress = (elapsed / totalDuration) * 100;
              progress = Math.min(Math.max(progress, 0), 100);

              const isExpired = endDate < now || amc.status === "EXPIRED";

              // Payment Calculations
              const paidAmount = amc.payments
                .filter((p) => p.status === "PAID")
                .reduce((sum, p) => sum + p.amount, 0);
              const pendingAmount = amc.amount - paidAmount;

              // Display Logic
              const displayStatus = isExpired
                ? "Expired"
                : pendingAmount > 0
                  ? "Payment Pending"
                  : "Active";

              return (
                /* ── AMC Card ── */
                <motion.div
                  layout
                  variants={itemVariants}
                  key={amc.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 min-h-[380px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_40px_rgb(46,52,88,0.08)] hover:-translate-y-2 hover:bg-white/60"
                >
                  {/* Decorative inner glow on hover */}
                  <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:bg-blue-400/20 pointer-events-none" />

                  <div className="relative z-10 mb-6 flex items-center justify-between">
                    {/* Icon With Sonar Collar Effect */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.35] group-hover:border-indigo-400/30" />
                      <div className="absolute inset-0 rounded-2xl border border-indigo-400/0 transition-all duration-700 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.7] group-hover:border-indigo-300/20 opacity-0 group-hover:opacity-100" />
                      
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-slate-100 text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:shadow-md z-10">
                        <Shield className="h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110" />
                      </div>
                    </div>
                    
                    {/* Dynamic Glassy Status Badge */}
                    <span
                      className={cn(
                        "inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm transition-colors",
                        isExpired
                          ? "bg-red-50 border-red-200/60 text-red-700"
                          : pendingAmount > 0
                            ? "bg-amber-50 border-amber-200/60 text-amber-700"
                            : "bg-emerald-50 border-emerald-200/60 text-emerald-700"
                      )}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          isExpired ? "bg-red-400" : pendingAmount > 0 ? "bg-amber-400" : "bg-emerald-400"
                        )}></span>
                        <span className={cn(
                          "relative inline-flex rounded-full h-1.5 w-1.5",
                          isExpired ? "bg-red-500" : pendingAmount > 0 ? "bg-amber-500" : "bg-emerald-500"
                        )}></span>
                      </span>
                      {displayStatus}
                    </span>
                  </div>

                  {/* Main Info */}
                  <div className="relative z-10">
                    <h3 className="font-extrabold text-slate-800 line-clamp-1 text-2xl tracking-tight mb-1">
                      {amc.customer.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-6">
                      {amc.service.serviceType}
                    </p>
                  </div>

                  {/* Contract Progress Bar */}
                  <div className="relative z-10 mb-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 font-semibold tracking-wide uppercase">Duration</span>
                      <span className="font-bold text-slate-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                          isExpired ? "bg-red-500" : "bg-[#2e3458]"
                        )}
                        style={{ width: `${progress}%` }}
                      >
                         {/* Subtle shine on the progress bar */}
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>

                  {/* Data Rows */}
                  <div className="relative z-10 grid grid-cols-2 gap-y-5 gap-x-4 border-t border-slate-200/50 pt-5 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</p>
                      <p className="text-sm font-bold text-slate-700">
                        {startDate.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">End Date</p>
                      <p className="text-sm font-bold text-slate-700">
                        {endDate.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contract Value</p>
                      <p className="text-sm font-extrabold text-[#2e3458]">
                        ₹{amc.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Dues</p>
                      <p className={cn(
                        "text-sm font-extrabold",
                        pendingAmount > 0 ? "text-amber-600" : "text-emerald-600"
                      )}>
                        ₹{pendingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="relative z-10 mt-auto grid grid-cols-2 gap-3">
                    {/* Secondary Button */}
                    <button
                      onClick={() => setSelectedAMC(amc)}
                      className="flex items-center justify-center rounded-xl bg-white/80 border border-slate-200 px-3 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                    >
                      Details
                    </button>

                    {/* Primary Button - Dynamic based on status */}
                    {isExpired ? (
                      <Link
                        href={`/dashboard/amcs/${amc.id}/renew`}
                        className="group/btn relative overflow-hidden flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-3 py-3 text-sm font-bold text-white shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-red-600 hover:shadow-lg active:scale-95"
                      >
                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-[150%]" />
                        <Clock className="w-4 h-4" />
                        <span className="relative z-10">Renew</span>
                      </Link>
                    ) : pendingAmount > 0 ? (
                      <Link
                        href={`/dashboard/payments/new?amcId=${amc.id}`}
                        className="group/btn relative overflow-hidden flex items-center justify-center gap-1.5 rounded-xl bg-[#2e3458] px-3 py-3 text-sm font-bold text-white shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#232846] hover:shadow-lg active:scale-95"
                      >
                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-[150%]" />
                        <AlertCircle className="w-4 h-4" />
                        <span className="relative z-10">Pay Dues</span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50/50 border border-emerald-200/50 px-3 py-3 text-sm font-bold text-emerald-600 backdrop-blur-sm cursor-default">
                        <CheckCircle2 className="w-4 h-4" />
                        Up to Date
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Render the Framer Motion Modal */}
      {selectedAMC && (
        <AMCModal
          amc={selectedAMC}
          isOpen={!!selectedAMC}
          onClose={() => setSelectedAMC(null)}
        />
      )}
    </>
  );
}