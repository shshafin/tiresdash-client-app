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
    stats: { performance: "100%", durability: "95%" },
    accent: "from-orange-600 to-red-600",
    icon: Gauge,
  },
  {
    name: "Wheels",
    image: "/w.webp",
    link: "/wheel",
    description: "Ultra-Light Alloy Config",
    stats: { performance: "98%", durability: "90%" },
    accent: "from-blue-600 to-cyan-600",
    icon: Activity,
  },
  {
    name: "Deals",
    image: "/d.webp",
    link: "/deals",
    description: "Limited Mission Specials",
    stats: { performance: "HOT", durability: "ELITE" },
    accent: "from-emerald-600 to-teal-600",
    icon: Zap,
  },
];

const ShopCategory = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-[#0a0a0c]">
      {/* 🛣️ Dynamic Asphalt Background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/asphalt-dark.png")`,
        }}
      />

      {/* ⚡ Moving Racing Stripes Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[20%] bg-orange-600/10 -rotate-12 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[120%] h-[20%] bg-blue-600/10 -rotate-12 blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Dashboard Header */}
        <div className="mb-20 text-center relative">
          <div className="inline-flex items-center gap-3 bg-orange-600 text-white px-6 py-1.5 transform -skew-x-12 mb-6 shadow-[0_0_20px_rgba(234,88,12,0.5)]">
            <Fuel
              size={14}
              className="animate-bounce"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.4em]">
              Engineered for Speed
            </span>
          </div>

          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            CHOOSE YOUR{" "}
            <span className="text-orange-600 drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">
              GEAR
            </span>
          </h2>

          {/* Decorative scanner line */}
          <div className="w-40 h-1 bg-orange-600 mx-auto relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-white w-1/2 animate-slide-infinite" />
          </div>
        </div>

        {/* 🛠️ Modern Tech Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat, index) => (
            <Link
              href={cat.link}
              key={index}
              className="group perspective-1000">
              <div
                className={`
                relative h-full bg-[#111318] border border-white/5 rounded-[20px] p-8 
                transition-all duration-500 ease-out 
                hover:border-orange-600/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                transform-gpu group-hover:rotate-x-2 group-hover:rotate-y-2
              `}>
                {/* Parallax Watermark */}
                <div className="absolute -right-8 -top-8 opacity-5 text-white group-hover:opacity-10 transition-opacity duration-700 group-hover:-translate-x-4">
                  <cat.icon
                    size={240}
                    strokeWidth={1}
                  />
                </div>

                {/* 🏎️ Image Display with Radial "Neon" Background */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 group-hover:scale-110 transition-transform duration-700">
                    {/* Core Glow */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.accent} rounded-full blur-[60px] opacity-20 group-hover:opacity-50 transition-all`}
                    />

                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-20"
                    />
                  </div>

                  {/* 📄 Tech Specs Overlay */}
                  <div className="w-full space-y-4 mb-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-black text-orange-600 uppercase italic">
                        Active_Unit
                      </span>
                    </div>

                    {/* Mini Stats Bar */}
                    <div className="flex gap-4">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.accent} w-0 group-hover:w-full transition-all duration-1000 delay-300`}
                        />
                      </div>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.accent} w-0 group-hover:w-[80%] transition-all duration-1000 delay-500`}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {cat.description}
                    </p>
                  </div>

                  {/* 🚀 Interactive "Shifter" Button */}
                  <div className="w-full group/btn relative py-4 px-6 rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300 hover:bg-orange-600">
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-white">
                        Engage Catalog
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-white group-hover/btn:translate-x-2 transition-transform"
                      />
                    </div>
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 group-hover/btn:animate-shimmer" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style
        jsx
        global>{`
        @keyframes slide-infinite {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        .animate-slide-infinite {
          animation: slide-infinite 2s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-2 {
          transform: rotateX(5deg);
        }
        .rotate-y-2 {
          transform: rotateY(-5deg);
        }
      `}</style>
    </section>
  );
};

export default ShopCategory;
