import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  ShieldCheck, 
  Settings, 
  MapPin, 
  Download, 
  Edit2, 
  Clock 
} from "lucide-react";
import Link from "next/link";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  return (
    <div 
      className="relative min-h-screen max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'DM Sans', 'Sora', sans-serif" }}
    >
      {/* ── Ambient Background ──────────────────────────────────── */}
      <div className="fixed inset-0 z-[-1] bg-slate-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-50" />
      </div>

      {/* ── Top Navigation / Breadcrumb ─────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/services"
          className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#2e3458] transition-colors bg-white/40 hover:bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </Link>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white/60 hover:bg-white backdrop-blur-md border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="group relative overflow-hidden flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#2e3458] rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]" />
            <Edit2 className="relative z-10 w-4 h-4" />
            <span className="relative z-10">Edit Service</span>
          </button>
        </div>
      </div>

      {/* ── Hero Banner / Service Identity ──────────────────────── */}
      <div className="relative mb-8 rounded-3xl overflow-hidden border border-white/60 shadow-lg backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/50">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
        
        <div className="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Contract
              </span>
              <span className="text-sm font-medium text-slate-400">
                Created Oct 24, 2023
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
              Service Overview
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="w-4 h-4" />
              <p className="font-mono text-sm font-medium bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                ID: {serviceId}
              </p>
            </div>
          </div>

          {/* Quick Stats Highlight */}
          <div className="flex gap-4 sm:gap-8 border-t md:border-t-0 md:border-l border-slate-200/60 pt-6 md:pt-0 md:pl-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Service Type</p>
              <p className="text-lg font-bold text-slate-700">Split AC - 1.5 Ton</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Next Service</p>
              <p className="text-lg font-bold text-[#2e3458]">Nov 15, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Details Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Details Card */}
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:bg-white/70">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/60 text-blue-600 border border-blue-200/40">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Customer Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Name</p>
              <p className="text-sm font-medium text-slate-700">Acme Corporation Ltd.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
              <p className="text-sm font-medium text-slate-700">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
              <div className="flex items-start gap-1.5 text-sm font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Level 4, Tech Park, Cyber City, Bangalore 560001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Card */}
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:bg-white/70">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100/60 text-indigo-600 border border-indigo-200/40">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Specifications</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Brand & Model</p>
              <p className="text-sm font-medium text-slate-700">Daikin Inverter X-Series</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Serial Number</p>
              <p className="text-sm font-mono font-medium text-slate-600 bg-slate-100/50 inline-block px-2 py-0.5 rounded border border-slate-200/50">SN-982374982</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Installation Date</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>October 15, 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* AMC / Contract Card */}
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:bg-white/70">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/60 text-emerald-600 border border-emerald-200/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Contract Status</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contract Type</p>
              <p className="text-sm font-medium text-slate-700">Comprehensive AMC</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Validity</p>
              <p className="text-sm font-medium text-slate-700">Oct 2023 — Oct 2024</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Frequency</p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Quarterly (4 visits/year)</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}