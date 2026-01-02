"use client";

import Image from "next/image";
import ProductsAndServices from "./ProductsAndServices";
import { useGetAllDeals } from "@/src/hooks/deals.hook";
import { ChevronRight, Zap, Flame } from "lucide-react";

export default function Landing() {
  const { data, isLoading } = useGetAllDeals();
  const deals = data?.data || [];

  // ✅ ডিলস না থাকলে স্পোর্টি মার্কেটিং মেসেজ
  const activePromo =
    deals && deals.length > 0
      ? deals[deals.length - 1].title
      : "Ignite Your Performance. Track-Ready Tires.";

  return (
    <div className="pb-20 bg-white dark:bg-black">
      {/* 🏁 Fire Orange Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white overflow-hidden relative border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-full animate-bounce">
            <Flame
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs sm:text-base font-black uppercase italic tracking-wider">
              {activePromo}
            </span>
            <span className="hidden sm:inline-block opacity-50">|</span>
            <a
              href="/deals"
              className="group flex items-center gap-1 text-xs sm:text-base font-black uppercase italic text-yellow-300 hover:text-white transition-colors">
              Claim Hot Deals{" "}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>

      {/* 🏎️ Sporty Hero Section */}
      <div className="relative w-full overflow-hidden group">
        {/* Cinematic Video Background */}
        <div className="relative h-[480px] sm:h-[550px] lg:h-[680px] w-full overflow-hidden">
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-black/60 z-20" />

          <video
            className="w-full h-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline>
            <source
              src="/banner.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* ⚡ High-Speed Hero Text (Optimized for Mobile Visibility) */}
        <div className="absolute top-[22%] sm:top-[22%] md:top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full text-center px-4 pointer-events-none">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            Tires<span className="text-orange-600">Dash</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-1 sm:mt-3">
            <div className="h-[1.5px] w-6 sm:w-12 bg-orange-600 shadow-[0_0_12px_#ea580c]" />
            <p className="text-white font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-xs md:text-sm italic opacity-90">
              Where Speed Meets Safety
            </p>
            <div className="h-[1.5px] w-6 sm:w-12 bg-orange-600 shadow-[0_0_12px_#ea580c]" />
          </div>
        </div>

        {/* 🛠️ Action Area (Responsive Position & Style) */}
        <div className="relative z-40 -mt-28 sm:-mt-48 max-w-6xl mx-auto px-4">
          <div
            className="bg-white/95 dark:bg-[#0f1115]/98 backdrop-blur-3xl 
            rounded-t-[40px] sm:rounded-t-[56px] rounded-b-none 
            shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] 
            border-t border-x border-white/20 dark:border-gray-800 
            p-1 sm:p-4 transition-all duration-500">
            <ProductsAndServices />
          </div>
        </div>
      </div>

      {/* 🛣️ Bottom Racing Accent */}
      <div className="max-w-4xl mx-auto mt-16 px-6 flex items-center gap-4 opacity-30">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-500" />
        <Zap
          size={20}
          className="text-orange-600"
        />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-500" />
      </div>
    </div>
  );
}
