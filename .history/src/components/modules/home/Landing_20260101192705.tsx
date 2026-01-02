"use client";

import Image from "next/image";
import ProductsAndServices from "./ProductsAndServices";
import { useGetAllDeals } from "@/src/hooks/deals.hook";
import { ChevronRight, ShieldCheck, Zap } from "lucide-react";

export default function Landing() {
  const { data, isLoading } = useGetAllDeals();
  const deals = data?.data || [];

  // লেটেস্ট ডিল অথবা মার্কেটিং মেসেজ
  const activePromo =
    deals && deals.length > 0
      ? deals[deals.length - 1].title
      : "Uncompromising Quality. Elite Performance.";

  return (
    <div className="pb-20 bg-white dark:bg-black">
      {/* 🏁 Top Dynamic Promo Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden relative border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
            <Zap
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
              className="group flex items-center gap-1 text-xs sm:text-base font-black uppercase italic text-yellow-400 hover:text-white transition-colors">
              Get Exclusive Access{" "}
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
        <div className="relative h-[400px] sm:h-[500px] lg:h-[650px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />{" "}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent z-20" />{" "}
          {/* Bottom Gradient */}
          <video
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000"
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

        {/* Floating Hero Content (Optional but recommended for Sporty look) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full text-center px-4 pointer-events-none">
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
            Tires<span className="text-blue-600">Dash</span>
          </h1>
          <p className="text-white/80 font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm mt-2">
            Engineered for the Fast Lane
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck
                size={14}
                className="text-blue-500"
              />{" "}
              Premium Quality
            </div>
            <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
              <Zap
                size={14}
                className="text-blue-500"
              />{" "}
              Rapid Service
            </div>
          </div>
        </div>

        {/* 🛠️ Action Area (Floating over the video) */}
        <div className="relative z-40 -mt-24 sm:-mt-32 max-w-6xl mx-auto px-4">
          <div className="bg-white/80 dark:bg-[#0f1115]/90 backdrop-blur-2xl rounded-[48px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white dark:border-gray-800 p-2 sm:p-4">
            <ProductsAndServices />
          </div>
        </div>
      </div>

      {/* Sporty Footer Accent */}
      <div className="max-w-5xl mx-auto mt-12 flex justify-center opacity-20 pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
      </div>
    </div>
  );
}
