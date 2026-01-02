"use client";

import {
  ShoppingBag,
  Wrench,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const CTA = ({ setStep }: any) => {
  return (
    <div className="relative py-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto relative">
        {/* 🏎️ Section Header: Sporty & Centered */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase italic tracking-[0.2em] mb-4 shadow-lg shadow-orange-600/20">
            <Zap className="w-3 h-3 fill-current animate-pulse" />
            <span>Race to Perfection</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-3 leading-tight uppercase italic tracking-tighter">
            Choose Your <span className="text-orange-600">Performance</span>{" "}
            Path
          </h2>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium uppercase tracking-wide">
            Elite products or professional track-side service.{" "}
            <br className="hidden sm:block" /> Select your gear today.
          </p>
        </div>

        {/* 🛠️ Main Cards Container */}
        <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch">
          {/* Card 1: Shop Products (Fire Orange Theme) */}
          <div className="group relative flex-1 max-w-md mx-auto w-full">
            <div className="relative h-full bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border-2 border-gray-100 dark:border-gray-800 group-hover:border-orange-600 transition-all duration-500 flex flex-col shadow-xl hover:shadow-orange-600/10">
              {/* Icon & Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-orange-600/10 rounded-2xl group-hover:bg-orange-600 transition-colors duration-500">
                  <ShoppingBag className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <Sparkles
                  className="text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  size={20}
                />
              </div>

              {/* Text Info */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2 group-hover:text-orange-600 transition-colors">
                  Shop Products
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase italic">
                  Premium tire & wheel selection with professional fitment
                  options.
                </p>
              </div>

              {/* Bullet Points (Compact for mobile) */}
              <div className="space-y-2 mb-8 flex-grow">
                {[
                  "Elite Brands",
                  "Guaranteed Fitment",
                  "Track Performance",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-gray-400 italic">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Dynamic Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-black group-hover:bg-orange-600 group-hover:text-white px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                <span>Enter Store</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* 🏁 Divider (Sporty AND) */}
          <div className="flex items-center justify-center py-2 md:py-0">
            <div className="bg-gray-100 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-800 rounded-full px-4 py-1.5">
              <span className="text-[10px] font-black italic text-gray-400 uppercase tracking-widest">
                OR
              </span>
            </div>
          </div>

          {/* Card 2: Schedule Service (Sporty Dark/Blue Theme) */}
          <div className="group relative flex-1 max-w-md mx-auto w-full">
            <div className="relative h-full bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border-2 border-gray-100 dark:border-gray-800 group-hover:border-blue-600 transition-all duration-500 flex flex-col shadow-xl hover:shadow-blue-600/10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-600/10 rounded-2xl group-hover:bg-blue-600 transition-colors duration-500">
                  <Wrench className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <ShieldCheck
                  className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  size={20}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">
                  Book Service
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase italic">
                  Expert repairs & inspections at our professional pit-stop
                  centers.
                </p>
              </div>

              <div className="space-y-2 mb-8 flex-grow">
                {[
                  "Master Mechanics",
                  "Rapid Inspection",
                  "Service Warranty",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase text-gray-400 italic">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/appointment"
                className="w-full">
                <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black group-hover:bg-blue-600 group-hover:text-white px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                  <span>Pit Stop</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 🛡️ Bottom Trust Strip (Clean & Sporty) */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">
              Trusted by 50K+ Drivers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap
              size={14}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">
              Same-Day Pit Stop
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap
              size={14}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">
              Warranty Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
