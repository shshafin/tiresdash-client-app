"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Gauge, Fuel, Activity, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Tires",
    image: "/t.webp",
    link: "/tire",
    description: "Maximum Grip Terrain Units",
    // 🟠 Fire Orange Energy
    bgGradient: "from-orange-600 via-orange-500 to-red-600",
    icon: Gauge,
    pattern: "https://www.transparenttextures.com/patterns/asphalt-dark.png",
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Ultra-Light Alloy Config",
    // 🔵 Electric Blue Energy
    bgGradient: "from-blue-600 via-cyan-500 to-indigo-600",
    icon: Activity,
    pattern: "https://www.transparenttextures.com/patterns/carbon-fibre.png",
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Limited Mission Specials",
    // 🟢 Hyper Green/Emerald Energy
    bgGradient: "from-emerald-600 via-teal-500 to-green-600",
    icon: Zap,
    pattern: "https://www.transparenttextures.com/patterns/diagmonds-light.png",
  },
];

const ShopCategory = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-5 py-2 rounded-full mb-6 shadow-sm">
            <Sparkles
              size={14}
              className="text-orange-600 animate-pulse"
            />
            <span className="text-gray-900 dark:text-gray-200 font-black uppercase italic text-[10px] tracking-[0.3em]">
              Performance Hub
            </span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
            SELECT YOUR <span className="text-orange-600">MISSION</span>
          </h2>
        </div>

        {/* 🛠️ Energetic Colorful Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group perspective-1000">
              <div
                className={`
                relative h-full overflow-hidden rounded-[40px] p-8 
                bg-gradient-to-br ${cat.bgGradient}
                transition-all duration-500 ease-out 
                hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]
                transform-gpu group-hover:-translate-y-3 group-hover:scale-[1.02]
                border border-white/20
              `}>
                {/* 🏎️ Background Texture Overlay */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url(${cat.pattern})` }}
                />

                {/* 🌊 Animated Watermark */}
                <div className="absolute -right-8 -top-8 opacity-20 text-white group-hover:opacity-30 transition-all duration-1000 group-hover:scale-125 group-hover:-rotate-12">
                  <cat.icon
                    size={250}
                    strokeWidth={1}
                  />
                </div>

                {/* 🖼️ Product Image with Internal Glow */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-10 group-hover:scale-110 transition-transform duration-700">
                    {/* Glowing Aura */}
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-[50px] opacity-40 group-hover:opacity-70 transition-all" />

                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] z-20"
                    />
                  </div>

                  {/* 📄 Card Content */}
                  <div className="w-full relative z-30 text-white">
                    <div className="flex justify-between items-center border-b border-white/30 pb-4 mb-4">
                      <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none drop-shadow-md">
                        {cat.name}
                      </h3>
                      <Zap
                        size={24}
                        className="animate-bounce text-white/80"
                      />
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-8 italic leading-snug opacity-90">
                      {cat.description}
                    </p>

                    {/* 🏎️ Animated Progress Accent */}
                    <div className="flex gap-2 mb-8">
                      <div className="h-1 flex-[2] bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-1000 delay-300" />
                      </div>
                      <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-1000 delay-500" />
                      </div>
                    </div>

                    {/* 🚀 Sporty Button */}
                    <div className="relative flex items-center justify-between bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-6 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                      <span className="text-[11px] font-black uppercase italic tracking-[0.2em]">
                        Launch Intel
                      </span>
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Shimmer/Flash Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategory;
