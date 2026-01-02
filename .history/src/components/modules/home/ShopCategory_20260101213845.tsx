"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Trophy, Target } from "lucide-react";

const categories = [
  {
    name: "Tires",
    image: "/t.webp",
    link: "/tire",
    description: "All-terrain performance units",
    tag: "High Velocity",
    accent: "from-orange-600 to-rose-600",
    shadow: "shadow-orange-500/20",
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Elite alloy configurations",
    tag: "Precision Build",
    accent: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Exclusive track-ready offers",
    tag: "Limited Mission",
    accent: "from-emerald-600 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
];

const ShopCategory = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-white dark:bg-black">
      {/* 🏎️ Racing Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 High-Octane Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white/5 border border-white/10 px-5 py-2 rounded-sm transform -skew-x-12 mb-6 shadow-xl">
            <Zap className="size-4 text-orange-600 fill-current" />
            <span className="text-white font-black uppercase italic text-xs tracking-[0.3em]">
              Select Your Mission
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none mb-6">
            Master the <span className="text-orange-600">Terrain</span>
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-sm font-bold uppercase italic text-gray-400 tracking-widest leading-relaxed">
            Equip your machine with championship-grade components.{" "}
            <br className="hidden sm:block" /> Engineered for total control.
          </p>
        </div>

        {/* 🛠️ Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group relative">
              {/* Card Container */}
              <div
                className={`relative h-full bg-gray-50 dark:bg-[#0f1115] rounded-[40px] p-8 overflow-hidden border-2 border-transparent group-hover:border-orange-600/50 transition-all duration-500 flex flex-col items-center text-center shadow-2xl hover:shadow-orange-600/20`}>
                {/* 🌊 Background Watermark */}
                <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-125 transition-transform duration-1000">
                  <Target size={200} />
                </div>

                {/* 🏷️ Top Tag */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-600 opacity-60 group-hover:opacity-100 transition-opacity">
                    {cat.tag}
                  </span>
                </div>

                {/* 🏎️ Image Container with Dynamic Glow */}
                <div className="relative mt-8 mb-10 w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  {/* Glow layer */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.accent} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700`}
                  />

                  <div className="relative w-full h-full p-6 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </div>

                {/* 📄 Text Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-3xl sm:text-4xl font-black dark:text-white uppercase italic tracking-tighter mb-2 leading-none group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold uppercase italic text-gray-500 dark:text-gray-400 tracking-wider mb-8">
                    {cat.description}
                  </p>

                  {/* 🚀 Sporty Button */}
                  <div className="relative inline-flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-8 py-3 rounded-xl overflow-hidden group-hover:bg-orange-600 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase italic tracking-widest group-hover:text-white dark:text-white">
                      Enter Garage
                    </span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform group-hover:text-white dark:text-white"
                    />
                    {/* Hover Stripe */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange-400 group-hover:w-full transition-all duration-500" />
                  </div>
                </div>

                {/* Corner Racing Decal */}
                <div className="absolute bottom-0 right-0 p-2 opacity-10">
                  <Trophy
                    size={40}
                    className="-rotate-12"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🏁 Bottom Racing Stripe */}
        <div className="mt-20 flex items-center gap-4 opacity-20">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
          <Zap
            size={20}
            className="text-orange-600"
          />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-400 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ShopCategory;
