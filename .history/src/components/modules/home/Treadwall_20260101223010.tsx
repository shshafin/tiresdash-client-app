"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Trophy,
  Gauge,
  Target,
  ChevronRight,
  Star,
} from "lucide-react";

const TreadWallSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white dark:bg-[#050505]">
      {/* 🏎️ Animated Asphalt & Track Lines */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-orange-600/50 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 📊 Left: Performance Metrics (The Dashboard) */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1 rounded-sm transform -skew-x-12 text-[10px] font-black uppercase italic tracking-widest mb-4">
              <Zap
                size={12}
                className="fill-current"
              />{" "}
              Live Performance Data
            </div>

            <h2 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.85] mb-8">
              PROVEN ON <br />{" "}
              <span className="text-orange-600">THE TRACK.</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Precision Handling", val: "99.2%", icon: Target },
                { label: "Tread Longevity", val: "+15K Miles", icon: Gauge },
                { label: "Driver Satisfaction", val: "4.9/5.0", icon: Star },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border-l-4 border-transparent hover:border-orange-600 transition-all duration-500">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center shadow-inner">
                        <item.icon
                          size={20}
                          className="text-orange-600"
                        />
                      </div>
                      <span className="text-xs font-black uppercase italic dark:text-gray-400 text-gray-600 tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-2xl font-black dark:text-white italic tracking-tighter">
                      {item.val}
                    </span>
                  </div>
                  {/* Progress Bar Glow */}
                  <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600 w-0 group-hover:w-full transition-all duration-1000" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🏎️ Center: The "Hero" Unit (Action Shot) */}
          <div className="lg:col-span-7 relative order-1 lg:order-2">
            <div className="relative rounded-[40px] overflow-hidden border-2 border-gray-100 dark:border-white/10 group shadow-2xl">
              {/* Image with Dark Tint Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <Image
                src="/tread.jpg"
                alt="High Performance"
                width={800}
                height={1000}
                className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />

              {/* Floating Trust Badges on Image */}
              <div className="absolute top-10 right-10 z-20 space-y-3">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                  <ShieldCheck
                    className="text-orange-600"
                    size={32}
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Safety Grade
                    </span>
                    <span className="text-lg font-black text-white italic tracking-tighter uppercase">
                      Elite Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Overlay Content */}
              <div className="absolute bottom-10 left-10 z-20 max-w-sm">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                  ENGINEERED FOR <br />{" "}
                  <span className="text-orange-600 text-4xl">
                    TOTAL CONTROL
                  </span>
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Battle-tested in rain, snow, and extreme heat. 75,000+ drivers
                  have switched to TyresDash for uncompromised safety.
                </p>
              </div>
            </div>

            {/* 🏁 CTA Parallelogram */}
            <div className="absolute -bottom-6 -right-6 z-30 hidden sm:block">
              <Link
                href="/tire"
                className="group flex items-center">
                <div className="bg-orange-600 text-white px-10 py-8 transform -skew-x-12 shadow-2xl group-hover:bg-rose-600 transition-all">
                  <div className="transform skew-x-12 flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Start Mission
                      </span>
                      <span className="text-xl font-black uppercase italic tracking-tighter">
                        Scan Your Fit
                      </span>
                    </div>
                    <ArrowRight
                      size={32}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 🏆 Brand Logos / Social Proof Footer */}
        <div className="mt-24 pt-12 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 font-black italic text-xl dark:text-white uppercase tracking-tighter">
              <Trophy className="text-orange-600" /> Grand Prix 2026
            </div>
            <div className="flex items-center gap-2 font-black italic text-xl dark:text-white uppercase tracking-tighter">
              <Zap className="text-orange-600" /> Nitro Tech
            </div>
            <div className="flex items-center gap-2 font-black italic text-xl dark:text-white uppercase tracking-tighter">
              <Target className="text-orange-600" /> Apex Grade
            </div>
            <div className="flex items-center gap-2 font-black italic text-xl dark:text-white uppercase tracking-tighter">
              <ShieldCheck className="text-orange-600" /> Armor Spec
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreadWallSection;
