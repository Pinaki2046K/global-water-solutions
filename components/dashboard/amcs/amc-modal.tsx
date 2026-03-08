"use client";

import { 
  X, 
  ShieldCheck, 
  User, 
  Wrench, 
  Calendar, 
  CreditCard, 
  AlertCircle 
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AMC {
  payments?: { status: string; amount: number }[];
  amount: number;
  status: string;
  customer: { name: string; phone?: string };
  service: { serviceType: string };
  startDate: string | Date;
  endDate: string | Date;
}

interface AMCModalProps {
  amc: AMC;
  isOpen: boolean;
  onClose: () => void;
}

export function AMCModal({ amc, isOpen, onClose }: AMCModalProps) {
  // Handle Escape Key & Scroll Lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Calculate financials & status
  const paidAmount = amc?.payments
    ? amc.payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0)
    : 0;
  
  const pendingAmount = amc ? amc.amount - paidAmount : 0;
  
  const isExpired = amc ? (amc.status === "EXPIRED" || new Date(amc.endDate) < new Date()) : false;

  const displayStatus = isExpired
    ? "Expired"
    : pendingAmount > 0
      ? "Payment Pending"
      : "Active";

  return (
    <AnimatePresence>
      {isOpen && amc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 perspective-[2000px]">
          
          {/* ── Backdrop Animation ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* ── The Modal (Genie Effect) ── */}
          <motion.div
            initial={{ y: "80vh", scaleX: 0.3, scaleY: 0.1, opacity: 0, rotateX: 30 }}
            animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1, rotateX: 0 }}
            exit={{ y: "100vh", scaleX: 0.1, scaleY: 0.1, opacity: 0, transition: { duration: 0.4, ease: "anticipate" } }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className="relative w-full max-w-lg transform rounded-[2.5rem] bg-white/75 backdrop-blur-3xl border border-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] origin-bottom"
          >
            {/* Ambient Inner Glow */}
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400">
                Contract Details
              </h3>
              <button
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/60 border border-slate-200/50 text-slate-400 shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100 hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Content Box (Staggered Children) ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative z-10 space-y-6"
            >
              
              {/* ── Hero / Status Section ── */}
              <div className="flex items-start gap-5 pb-2">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-md transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg border border-white/20 text-white">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="text-3xl font-black text-[#2e3458] tracking-tight leading-none">
                      ₹{amc.amount.toLocaleString()}
                    </h4>
                    
                    {/* Glowing Radar Status Badge */}
                    <span
                      className={cn(
                        "inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm",
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
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Total Contract Value
                  </p>
                </div>
              </div>

              {/* ── Pending Amount Banner ── */}
              {pendingAmount > 0 && !isExpired && (
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 border border-amber-200/60 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/80 text-amber-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mb-0.5">
                        Outstanding Balance
                      </p>
                      <p className="text-lg font-black text-amber-700 leading-tight">
                        ₹{pendingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Info Grid ── */}
              <div className="grid grid-cols-2 gap-4">
                {/* Customer */}
                <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-sm transition-all hover:bg-white/70">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <User className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-wider">Customer</p>
                  </div>
                  <div className="font-extrabold text-slate-800 text-lg leading-tight line-clamp-1 mb-1">
                    {amc.customer.name}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {amc.customer.phone || "+91 87654 32109"}
                  </div>
                </div>

                {/* Service */}
                <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-sm transition-all hover:bg-white/70">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Wrench className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-wider">Service</p>
                  </div>
                  <div className="font-extrabold text-slate-800 text-lg leading-tight">
                    {amc.service.serviceType}
                  </div>
                </div>
              </div>

              {/* ── Dates Grid ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-sm text-center transition-all hover:bg-white/70">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</p>
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700 text-base">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(amc.startDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-sm text-center transition-all hover:bg-white/70">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">End Date</p>
                  <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700 text-base">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(amc.endDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              {/* ── Close Button (Genie Shine Effect) ── */}
              <div className="pt-2">
                <button
                  type="button"
                  className="group relative w-full overflow-hidden rounded-xl bg-[#2e3458] px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(46,52,88,0.3)] active:scale-95"
                  onClick={onClose}
                >
                  {/* Sweeping Shine Effect */}
                  <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]" />
                  <span className="relative z-10">Close</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}