"use client";

import {
  ShoppingBag,
  Wrench,
  ArrowRight,
  Zap,
  ShieldCheck,
  Trophy,
  Gauge,
} from "lucide-react";
import Link from "next/link";

const CTA = ({ setStep }: any) => {
  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto relative">
        {/* 🏎️ Section Header: Racing Spirit */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-black dark:bg-orange-600 text-white px-4 py-1 rounded-sm text-[9px] sm:text-[11px] font-black uppercase italic tracking-[0.3em] mb-4 transform -skew-x-12">
            <Trophy
              size={14}
              className="text-orange-500 dark:text-white"
            />
            <span>Championship Grade Service</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4 uppercase italic tracking-tighter leading-none">
            Ignite Your <span className="text-orange-600">Drive</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-widest max-w-lg mx-auto italic">
            Select your mission: Equip with premium gear or book master-class
            maintenance.
          </p>
        </div>

        {/* 🛠️ Dual Mission Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch">
          {/* Mission 1: SHOPPING (Fire Orange) */}
          <div className="group relative flex-1 max-w-md mx-auto w-full">
            <div className="relative h-full bg-white dark:bg-[#111318] rounded-2xl p-8 border-b-4 border-orange-600 shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 overflow-hidden">
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-orange-600/20 transition-all" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-orange-600 rounded-xl shadow-[0_10px_20px_rgba(234,88,12,0.4)]">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-orange-600/50 to-transparent" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3">
                  Browse <span className="text-orange-600">Catalog</span>
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase italic mb-8 leading-tight">
                  Premium selection of tires & wheels. Engineered for high-speed
                  stability and safety.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    "Next-Gen Tire Tech",
                    "Custom Alloy Wheels",
                    "Performance Fitment",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3">
                      <Zap
                        size={14}
                        className="text-orange-600"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider dark:text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-xl font-black uppercase italic tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3 shadow-xl group/btn">
                  <span>Start Shopping</span>
                  <ArrowRight
                    size={20}
                    className="group-hover/btn:translate-x-2 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 🏁 Divider (Racing Stripe Style) */}
          <div className="flex flex-row md:flex-col items-center justify-center gap-2 py-4 md:py-0">
            <div className="h-1 w-8 md:h-8 md:w-1 bg-orange-600" />
            <span className="text-xs font-black italic text-gray-400">VS</span>
            <div className="h-1 w-8 md:h-8 md:w-1 bg-blue-600" />
          </div>

          {/* Mission 2: SERVICE (Mechanical Blue) */}
          <div className="group relative flex-1 max-w-md mx-auto w-full">
            <div className="relative h-full bg-white dark:bg-[#111318] rounded-2xl p-8 border-b-4 border-blue-600 shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-600 rounded-xl shadow-[0_10px_20px_rgba(37,99,235,0.4)]">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-600/50 to-transparent" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3">
                  Book <span className="text-blue-600">Appointment</span>
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase italic mb-8 leading-tight">
                  Professional service & repairs. Trust our master mechanics for
                  your vehicle's safety.
                </p>

                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    "Expert Alignment",
                    "Brake Diagnostics",
                    "Full Safety Check",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3">
                      <Gauge
                        size={14}
                        className="text-blue-600"
                      />
                      <span className="text-[10px] font-black uppercase tracking-wider dark:text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/appointment"
                  className="w-full">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-5 px-6 rounded-xl font-black uppercase italic tracking-[0.1em] sm:tracking-[0.15em] text-xs sm:text-base transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl group/btn active:scale-95">
                    <span>Schedule Service</span>
                    <ArrowRight
                      size={18}
                      className="sm:w-5 sm:h-5 group-hover/btn:translate-x-2 transition-transform"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 🛡️ Performance Indicators */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-10">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={20}
              className="text-orange-600"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black dark:text-white italic uppercase tracking-tighter">
                Certified Safety
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                100% Quality Assurance
              </span>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-3">
            <Zap
              size={20}
              className="text-orange-600"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black dark:text-white italic uppercase tracking-tighter">
                Rapid Response
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Same-Day Availability
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
