"use client";

import React from "react";
import DealsCarousel from "../../UI/DealsCaurosel";
import { useGetAllDeals } from "@/src/hooks/deals.hook";
import {
  ShieldCheck,
  Zap,
  Award,
  Clock,
  Star,
  ArrowRight,
  Gauge,
  Cog,
} from "lucide-react";
import Link from "next/link";

const Deals = () => {
  const { data, isLoading } = useGetAllDeals();
  const deals = data?.data || [];

  const services = [
    { icon: Gauge, text: "Precision Rotation", desc: "Balance your wear" },
    { icon: Zap, text: "High-Speed Balancing", desc: "Vibration-free drive" },
    { icon: Cog, text: "Air Pressure Tuning", desc: "Optimal fuel economy" },
    { icon: ShieldCheck, text: "Pro Flat Repair", desc: "Track-safe patching" },
    { icon: Award, text: "Elite Inspection", desc: "32-point safety check" },
  ];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black">
      {/* 🏎️ 1. Low Price Promise: High-Octane Banner */}
      <div className="relative z-10 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white overflow-hidden shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
        {/* Abstract racing lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,white_20px,white_21px)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Promise Left */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="size-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 rotate-3 group-hover:rotate-0 transition-transform">
                <ShieldCheck className="size-10 text-white shadow-lg" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full border border-white/20 mb-3">
                  <Star
                    size={14}
                    className="fill-yellow-300 text-yellow-300"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                    Precision Pricing
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  Low Price <span className="text-black/30">Promise</span>
                </h2>
                <p className="text-orange-100 font-bold uppercase italic text-sm mt-2 tracking-widest">
                  Found it lower?{" "}
                  <span className="underline decoration-2 underline-offset-4 decoration-black/40">
                    We'll Price Match It.
                  </span>
                </p>
              </div>
            </div>

            {/* Online/Store Right */}
            <div className="flex flex-col items-center sm:items-end gap-3">
              <div className="flex gap-4 bg-black/20 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
                {["Online", "In-Store"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2">
                    <div className="size-2 bg-green-400 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase italic tracking-widest">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-bold uppercase opacity-60 tracking-[0.2em]">
                Verified Championship Grade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ 2. Premium Services: The Pit Stop Grid */}
      <div className="relative z-10 py-20 px-4 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-[2px] w-8 bg-orange-600" />
              <span className="text-orange-600 font-black uppercase italic text-xs tracking-[0.4em]">
                Service Standards
              </span>
              <div className="h-[2px] w-8 bg-orange-600" />
            </div>
            <h3 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Lifetime <span className="text-orange-600">Support</span>
            </h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] sm:text-xs tracking-[0.2em] mt-4 max-w-xl mx-auto italic">
              Professional tire care solutions engineered for longevity and
              track-ready performance.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-[#0f1115] border-2 border-gray-100 dark:border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-orange-600 hover:-translate-y-2 overflow-hidden shadow-xl hover:shadow-orange-600/10">
                {/* Slanted Background Accent */}
                <div className="absolute top-0 right-0 size-24 bg-gray-50 dark:bg-white/5 rounded-bl-[60px] transition-colors group-hover:bg-orange-600/10" />

                <div className="relative z-10">
                  <div className="size-14 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-500 shadow-inner">
                    <service.icon className="size-7 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                  </div>

                  <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2">
                    {service.text}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Progress bar accent on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>

          {/* Trust Footer */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-gray-100 dark:border-white/5 pt-10">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Clock
                size={18}
                className="text-orange-600"
              />
              <span className="text-[11px] font-black uppercase italic tracking-widest">
                Life-of-Tire Maintenance
              </span>
            </div>
            <div className="hidden sm:block size-1 bg-gray-300 dark:bg-white/10 rounded-full" />
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <Zap
                size={18}
                className="text-orange-600"
              />
              <span className="text-[11px] font-black uppercase italic tracking-widest">
                Rapid Response Service
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ 3. Deals Carousel: The Showroom */}
      <div className="relative z-10 py-10 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col leading-none">
              <span className="text-orange-600 font-black italic uppercase text-[10px] tracking-widest">
                Limited Time
              </span>
              <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter">
                Current <span className="text-orange-600">Specials</span>
              </h3>
            </div>
            <Link
              href="/deals"
              
          </div>
          <DealsCarousel data={deals} />
        </div>
      </div>
    </section>
  );
};

export default Deals;
