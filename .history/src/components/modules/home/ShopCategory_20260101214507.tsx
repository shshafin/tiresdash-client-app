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
    description: "Maximum grip units.",
    bgGradient: "from-[#800000] via-[#e60000] to-[#b30000]",
    ctaText: "Equip Now",
    icon: Gauge,
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Ultra-light chassis.",
    bgGradient: "from-[#001f3f] via-[#0074D9] to-[#001f3f]",
    ctaText: "Upgrade",
    icon: Activity,
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Track-side specials.",
    bgGradient: "from-[#004d40] via-[#26a69a] to-[#004d40]",
    ctaText: "Claim",
    icon: Trophy,
  },
];

const ShopCategory = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
            SELECT YOUR <span className="text-orange-600">MISSION</span>
          </h2>
        </div>

        {/* 🛠️ Compact Animated Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group">
              <div
                className={`
                relative h-[320px] sm:h-[350px] overflow-hidden rounded-[32px] p-6 
                bg-gradient-to-br ${cat.bgGradient}
                transition-all duration-500 ease-out 
                hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
                border border-white/10 flex flex-col justify-between
                group-hover:-translate-y-2
              `}>
                {/* 🌊 Animated Background Watermark */}
                <div className="absolute -right-6 -top-6 opacity-10 text-white group-hover:scale-125 transition-transform duration-[2000ms] group-hover:rotate-12">
                  <cat.icon
                    size={200}
                    strokeWidth={1}
                  />
                </div>

                {/* 🖼️ Compact Image Position */}
                <div className="absolute right-[-20px] top-[40px] w-40 h-40 sm:w-48 sm:h-48 group-hover:scale-110 group-hover:-translate-x-4 transition-all duration-700">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] z-20"
                  />
                </div>

                {/* 📄 Compact Text Content */}
                <div className="relative z-30 text-white max-w-[60%]">
                  <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4">
                    <Zap
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      Active
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-2 leading-none drop-shadow-md">
                    {cat.name}
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-tight italic opacity-80 leading-tight">
                    {cat.description}
                  </p>
                </div>

                {/* 🚀 Marketing CTA - Clean & Sharp */}
                <div className="relative z-30 mt-auto">
                  <div className="inline-flex items-center justify-between bg-white text-black rounded-xl py-3 px-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-95">
                    <span className="text-[10px] font-black uppercase italic tracking-widest mr-4">
                      {cat.ctaText}
                    </span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>

                {/* Shimmer Scan Line Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style
        jsx
        global>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default ShopCategory;
