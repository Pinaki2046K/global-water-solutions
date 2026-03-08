"use client";

import { useState } from "react";
import { Wrench, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceModal } from "./service-modal";

interface Service {
  id: string;
  serviceType: string;
  installationDate: string | Date;
  customer: {
    name: string;
  };
}

interface ServicesGridProps {
  services: Service[];
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

export function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout 
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {services.length === 0 ? (
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
                <Wrench className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                No services found
              </h3>
              <p className="mt-2 text-base text-slate-500 max-w-sm text-center">
                Try adjusting your search filters or add a new service to see it appear here.
              </p>
            </motion.div>
          ) : (
            services.map((service) => (
              /* ── Service Card ── */
              <motion.div
                layout
                variants={itemVariants}
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 min-h-[360px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_40px_rgb(46,52,88,0.08)] hover:-translate-y-2 hover:bg-white/60"
              >
                {/* Decorative inner glow on hover */}
                <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:bg-blue-400/20 pointer-events-none" />

              {/* Changed to items-center for perfect vertical alignment */}
              <div className="relative z-10 mb-8 flex items-center justify-between">
                {/* ── Icon With Sonar Collar Effect ── */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.35] group-hover:border-blue-400/30" />
                  <div className="absolute inset-0 rounded-2xl border border-blue-400/0 transition-all duration-700 delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.7] group-hover:border-blue-300/20 opacity-0 group-hover:opacity-100" />
                  
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-slate-100 text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-md z-10">
                    <Wrench className="h-6 w-6 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-12 group-hover:scale-110" />
                  </div>
                </div>
                
                {/* ── Fixed Clean Status Badge ── */}
                <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
  <span className="relative flex h-1.5 w-1.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
  </span>
  Active
</span>
              </div>

                {/* ── Main Info ── */}
                <div className="relative z-10 flex-1">
                  <h3 className="font-extrabold text-slate-800 line-clamp-1 text-2xl tracking-tight mb-2">
                    {service.serviceType}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Customer:{" "}
                    <span className="font-semibold text-slate-700">
                      {service.customer.name}
                    </span>
                  </p>
                </div>

                {/* ── Data Rows ── */}
                <div className="relative z-10 mt-8 space-y-4 border-t border-slate-200/50 pt-6">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Service ID</span>
                    <span className="font-semibold text-slate-600 font-mono tracking-wide bg-white/80 px-2.5 py-1 rounded-md border border-slate-200/60 shadow-sm">
                      {service.id.split("-")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">
                      Installation
                    </span>
                    <span className="font-bold text-slate-700">
                      {new Date(service.installationDate).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "2-digit", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                {/* ── Action Button - Genie Hover Effect ── */}
                <div className="relative z-10 mt-8 pt-0">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-white/90 border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2e3458] hover:text-white hover:border-[#2e3458] hover:shadow-[0_8px_20px_rgba(46,52,88,0.25)] active:scale-95"
                  >
                    <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-[150%]" />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Details
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 opacity-50 group-hover/btn:opacity-100" />
                    </span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}