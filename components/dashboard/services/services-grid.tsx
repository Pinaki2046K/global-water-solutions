"use client";

import { useState } from "react";
import { Wrench, ChevronRight } from "lucide-react";
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

export function ServicesGrid({ services }: ServicesGridProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          /* Empty State (Glassmorphic) */
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 shadow-sm border border-slate-100 mb-4 text-slate-400">
              <Wrench className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No services found
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm text-center">
              Get started by creating a new service installation to see it appear here.
            </p>
          </div>
        ) : (
          services.map((service) => (
            /* Service Card */
            <div
              key={service.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 hover:bg-white/60"
            >
              {/* Decorative inner glow on hover */}
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:bg-blue-400/20 pointer-events-none" />

              <div className="relative z-10 mb-5 flex items-start justify-between">
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm border border-slate-100 text-slate-500 transition-all duration-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 group-hover:shadow-md">
                  <Wrench className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-12" />
                </div>
                
                {/* Glassy Status Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/50 backdrop-blur-sm shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Main Info */}
              <div className="relative z-10 flex-1">
                <h3 className="font-extrabold text-slate-800 line-clamp-1 text-xl tracking-tight mb-1">
                  {service.serviceType}
                </h3>
                <p className="text-sm text-slate-500">
                  Customer:{" "}
                  <span className="font-semibold text-slate-700">
                    {service.customer.name}
                  </span>
                </p>
              </div>

              {/* Data Rows */}
              <div className="relative z-10 mt-6 space-y-3 border-t border-slate-200/50 pt-4">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Service ID</span>
                  <span className="font-semibold text-slate-600 font-mono tracking-wide bg-white/60 px-2 py-0.5 rounded border border-slate-200/60 shadow-sm">
                    {service.id.split("-")[0]}
                  </span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">
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

              {/* Action Button - Genie Effect */}
              <div className="relative z-10 mt-6 pt-0">
                <button
                  onClick={() => setSelectedService(service)}
                  className="group/btn relative w-full overflow-hidden rounded-xl bg-white/80 border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#2e3458] hover:text-white hover:border-[#2e3458] hover:shadow-lg active:scale-95"
                >
                  {/* Sweeping Shine Effect */}
                  <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-[150%]" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    View Details
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 opacity-50 group-hover/btn:opacity-100" />
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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