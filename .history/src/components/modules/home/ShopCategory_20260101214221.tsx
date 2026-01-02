"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Target, Gauge, Fuel, Activity } from "lucide-react";

const categories = [
  {
    name: "Tires",
    image: "/t.webp",
    link: "/tire",
    description: "Maximum Grip Terrain Units",
    accent: "from-orange-600 to-red-600",
    icon: Gauge,
    bgPattern: "https://www.transparenttextures.com/patterns/asphalt-dark.png",
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Ultra-Light Alloy Config",
    accent: "from-blue-600 to-cyan-600",
    icon: Activity,
    bgPattern: "https://www.transparenttextures.com/patterns/carbon-fibre.png",
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Limited Mission Specials",
    accent: "from-emerald-600 to-teal-600",
    icon: Zap,
    bgPattern:
      "https://www.transparenttextures.com/patterns/diagmonds-light.png",
  },
];

const ShopCategory = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Dashboard Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-1.5 transform -skew-x-12 mb-6 shadow-lg">
            <Fuel
              size={14}
              className="animate-pulse"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.3em]">
              Performance Hub
            </span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
            CHOOSE YOUR <span className="text-orange-600">GEAR</span>
          </h2>
        </div>

        {/* 🛠️ Sporty Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group perspective-1000">
              {/* Card Container with Internal BG */}
              <div
                className={`
                relative h-full overflow-hidden rounded-[32px] p-8 
                bg-[#111318] border-2 border-transparent 
                transition-all duration-500 ease-out 
                group-hover:border-orange-600 group-hover:shadow-[0_20px_50px_rgba(234,88,12,0.3)]
                transform-gpu group-hover:-translate-y-2
              `}>
                {/* 🏎️ Internal Asphalt/Carbon Texture (Always Dark for Sporty Look) */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundImage: `url(${cat.bgPattern})` }}
                />

                {/* 🌊 Floating Watermark */}
                <div className="absolute -right-6 -top-6 opacity-5 text-white group-hover:opacity-10 transition-all duration-1000 group-hover:scale-125">
                  <cat.icon
                    size={220}
                    strokeWidth={1}
                  />
                </div>

                {/* 🖼️ Image Display with Neon Glow */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-10 group-hover:scale-110 transition-transform duration-700">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.accent} rounded-full blur-[45px] opacity-20 group-hover:opacity-60 transition-all duration-700`}
                    />
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20"
                    />
                  </div>

                  {/* 📊 Content Area */}
                  <div className="w-full relative z-30">
                    <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-4">
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {cat.name}
                      </h3>
                      <div className="size-2 bg-orange-600 rounded-full animate-ping" />
                    </div>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 italic leading-relaxed">
                      {cat.description}
                    </p>

                    {/* 🏎️ Technical Progress Bars (Sporty Detail) */}
                    <div className="space-y-2 mb-8">
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.accent} w-0 group-hover:w-full transition-all duration-1000 delay-300`}
                        />
                      </div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.accent} w-0 group-hover:w-[70%] transition-all duration-1000 delay-500`}
                        />
                      </div>
                    </div>

                    {/* 🚀 Sporty Button */}
                    <div className="relative flex items-center justify-between bg-white/5 group-hover:bg-orange-600 border border-white/10 rounded-xl py-4 px-6 transition-all duration-300">
                      <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-white">
                        Enter Catalog
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-white group-hover:translate-x-2 transition-transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style
        jsx
        global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default ShopCategory;
