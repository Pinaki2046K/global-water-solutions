"use client";

import { X, Wrench, ShieldCheck, AlertCircle } from "lucide-react";
import { useEffect } from "react";
// 1. Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

interface ServiceModalProps {
  service: {
    id: string;
    serviceType: string;
    installationDate: string | Date;
    customer: {
      name: string;
      phone?: string;
    };
    _count?: {
      amcContracts: number;
      complaints: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
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

  return (
    // 2. Wrap the conditional render in AnimatePresence
    <AnimatePresence>
      {isOpen && service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 perspective-[2000px]">
          
          {/* 3. The Backdrop Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* 4. The Modal (Genie Effect) Animation */}
          <motion.div
            // Start State (squished and at the bottom)
            initial={{ y: "80vh", scaleX: 0.3, scaleY: 0.1, opacity: 0, rotateX: 30 }}
            // Active State (full size, center screen)
            animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1, rotateX: 0 }}
            // Exit State (sucks back down exactly like macOS)
            exit={{ y: "100vh", scaleX: 0.1, scaleY: 0.1, opacity: 0, transition: { duration: 0.4, ease: "anticipate" } }}
            // The Physics (Apple Spring Settings)
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            className="relative w-full max-w-lg transform rounded-[2.5rem] bg-white/75 backdrop-blur-3xl border border-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] origin-bottom"
          >
            {/* Ambient Inner Glow */}
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400">
                Service Details
              </h3>
              <button
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/60 border border-slate-200/50 text-slate-400 shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100 hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Content Box ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="relative z-10"
            >
              <div className="flex items-start gap-5 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-md transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg border border-white/20 text-white">
                    <Wrench className="h-8 w-8" />
                  </div>
                </div>
                <div className="pt-1">
                  <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none mb-2">
                    {service.serviceType}
                  </h4>
                  <span className="inline-flex items-center bg-white/60 backdrop-blur-sm border border-slate-200/60 px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-slate-500 shadow-sm">
                    ID: {service.id.split("-")[0]}
                  </span>
                </div>
              </div>

              {/* ── Info Grid ── */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Customer
                  </p>
                  <div className="font-extrabold text-slate-800 text-lg leading-tight line-clamp-1">
                    {service.customer.name}
                  </div>
                  <div className="text-sm font-medium text-slate-500 mt-1">
                    {service.customer.phone || "+91 98765 43210"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Installed
                  </p>
                  <div className="font-extrabold text-slate-800 text-lg">
                    {new Date(service.installationDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* AMC Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-md p-5 border border-white/60 shadow-sm transition-all hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5">
                  <ShieldCheck className="absolute -bottom-4 -right-4 h-20 w-20 text-emerald-100/50" />
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-emerald-600 mb-1 tracking-tighter">
                      {service._count?.amcContracts || 0}
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      AMC Contracts
                    </div>
                  </div>
                </div>
                
                {/* Complaints Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-md p-5 border border-white/60 shadow-sm transition-all hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5">
                  <AlertCircle className="absolute -bottom-4 -right-4 h-20 w-20 text-orange-100/50" />
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-orange-500 mb-1 tracking-tighter">
                      {service._count?.complaints || 0}
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Complaints
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Close Button ── */}
              <button
                type="button"
                className="group relative w-full overflow-hidden rounded-xl bg-[#2e3458] px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(46,52,88,0.3)] active:scale-95"
                onClick={onClose}
              >
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]" />
                <span className="relative z-10">Close Modal</span>
              </button>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}