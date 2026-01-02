"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Gauge,
  Activity,
  Trophy,
  ShieldCheck,
} from "lucide-react";

const categories = [
  {
    name: "Tires",
    image: "/t.webp",
    link: "/tire",
    description: "Maximum grip units for extreme terrain.",
    // 🔴 Deep Fire/Crimson
    bgGradient: "from-[#991b1b] via-[#ef4444] to-[#b91c1c]",
    ctaText: "Equip Now",
    icon: Gauge,
    pattern: "https://www.transparenttextures.com/patterns/asphalt-dark.png",
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Ultra-light alloy chassis configurations.",
    // 🔵 Deep Navy/Electric Blue
    bgGradient: "from-[#1e3a8a] via-[#3b82f6] to-[#1e40af]",
    ctaText: "Upgrade Build",
    icon: Activity,
    pattern: "https://www.transparenttextures.com/patterns/carbon-fibre.png",
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Limited-run track-side special offers.",
    // 🟢 Deep Forest/Emerald
    bgGradient: "from-[#064e3b] via-[#10b981] to-[#047857]",
    ctaText: "Claim Offer",
    icon: Trophy,
    pattern: "https://www.transparenttextures.com/patterns/diagmonds-light.png",
  },
];

const ShopCategory = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Header Section */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-5 py-2 rounded-full mb-6">
            <Zap
              size={14}
              className="text-orange-600 fill-current"
            />
            <span className="text-gray-900 dark:text-gray-200 font-black uppercase italic text-[10px] tracking-[0.3em]">
              Fleet Grade Gear
            </span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
            GEAR UP FOR <span className="text-orange-600">VICTORY</span>
          </h2>
        </div>

        {/* 🛠️ Deep Color Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group perspective-1000">
              <div
                className={`
                relative h-full overflow-hidden rounded-[48px] p-10 
                bg-gradient-to-br ${cat.bgGradient}
                transition-all duration-700 ease-out 
                hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]
                transform-gpu group-hover:-translate-y-4 group-hover:scale-[1.03]
                border border-white/10
              `}>
                {/* 🏎️ High-End Texture Overlay */}
                <div
                  className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url(${cat.pattern})` }}
                />

                {/* 🌊 Deep Watermark */}
                <div className="absolute -right-10 -top-10 opacity-10 text-white group-hover:opacity-20 transition-all duration-1000 group-hover:scale-150">
                  <cat.icon
                    size={280}
                    strokeWidth={1.5}
                  />
                </div>

                {/* 🖼️ Main Image with Dynamic Glow */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-12 group-hover:scale-110 transition-transform duration-700 ease-out">
                    {/* Concentric Glow */}
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-[60px] opacity-50 group-hover:opacity-80 transition-all" />

                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] z-20"
                    />
                  </div>

                  {/* 📄 Marketing Content */}
                  <div className="w-full relative z-30 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[2px] w-10 bg-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">
                        Pro Unit
                      </span>
                    </div>

                    <h3 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none drop-shadow-lg">
                      {cat.name}
                    </h3>

                    <p className="text-xs font-bold uppercase tracking-wide mb-10 italic leading-relaxed opacity-70 max-w-[90%]">
                      {cat.description}
                    </p>

                    {/* 🚀 Marketing CTA Buttons */}
                    <div className="relative flex items-center justify-between bg-white text-black rounded-[20px] py-5 px-8 transition-all duration-500 hover:shadow-[0_0_30px_white] active:scale-95">
                      <span className="text-xs font-black uppercase italic tracking-[0.2em]">
                        {cat.ctaText}
                      </span>
                      <div className="flex items-center gap-1">
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-2 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-20 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🛣️ Bottom Brand Seal */}
        <div className="mt-20 flex justify-center opacity-30">
          <div className="flex items-center gap-4 border border-gray-400 dark:border-gray-700 px-6 py-2 rounded-full">
            <ShieldCheck
              size={16}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] dark:text-white">
              Authentic Component Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCategory;
