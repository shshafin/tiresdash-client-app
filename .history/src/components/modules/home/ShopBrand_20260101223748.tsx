"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBrands } from "@/src/hooks/brand.hook";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";
import { ChevronRight, Star, Shield, Zap, Target } from "lucide-react";

const ShopByBrandSection = () => {
  const { data: brands, isError, isLoading } = useGetBrands({ limit: 12 });

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 rounded-[32px] bg-gray-100 dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-black">
      {/* 🏎️ Racing Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏁 Heading: Pit Stop Style */}
        <div className="mb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-1.5 transform -skew-x-12 mb-6 shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
            <Zap
              size={14}
              className="animate-pulse fill-current"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.4em]">
              Elite Inventory
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-8">
            DOMINATE WITH THE <br />{" "}
            <span className="text-orange-600">BEST BRANDS</span>
          </h2>

          <p className="text-xs sm:text-sm font-bold uppercase italic text-gray-500 tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Engineered for high-velocity. Trusted by world-class pilots. <br />{" "}
            Find your chassis match below.
          </p>
        </div>

        {/* 🛠️ Brand Grid: Neon Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
          {brands?.data?.map((brand: any, index: number) => (
            <Link
              key={brand._id}
              href={`/tire?brand=${encodeURIComponent(brand._id)}`}
              className="group">
              <div className="relative h-44 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] rounded-[32px] border-2 border-transparent transition-all duration-500 hover:border-orange-600 hover:shadow-[0_20px_40px_rgba(234,88,12,0.15)] group-hover:-translate-y-3 overflow-hidden">
                {/* 🌊 Carbon Fiber Texture on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                {/* 🏷️ Serial Number Detail */}
                <span className="absolute top-4 left-6 text-[8px] font-black text-gray-300 dark:text-white/10 uppercase italic">
                  BRD-0{index + 1}
                </span>

                {/* 🖼️ Logo Container */}
                <div className="relative z-10 w-20 h-20 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={`${envConfig.base_url}${brand.logo}`}
                    alt={brand.name}
                    width={100}
                    height={100}
                    className="w-16 h-16 object-contain drop-shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Subtle Glow Behind Logo */}
                  <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 rounded-full blur-xl transition-all" />
                </div>

                {/* 📄 Brand Name */}
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="font-black text-xs uppercase italic tracking-tighter dark:text-white text-gray-900 group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h3>
                  {/* Explore Indicator */}
                  <div className="h-0.5 w-0 bg-orange-600 group-hover:w-full transition-all duration-500 mt-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 Sporty Support CTA */}
        <div className="mt-20">
          <div className="relative overflow-hidden bg-gray-50 dark:bg-[#0f1115] rounded-[40px] p-8 sm:p-12 border border-gray-100 dark:border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-10 rotate-12">
              <Target
                size={150}
                strokeWidth={1}
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="size-2 bg-orange-600 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 italic">
                    24/7 Crew Support
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter dark:text-white leading-none">
                  UNABLE TO LOCATE <br />{" "}
                  <span className="text-orange-600">YOUR UNIT?</span>
                </h3>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest max-w-sm">
                  Our pit-crew experts are standing by to analyze your chassis
                  requirements.
                </p>
              </div>

              <Link
                href="/contact"
                className="w-full md:w-auto">
                <button className="w-full group/btn relative bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-rose-600 transition-all duration-500 shadow-xl overflow-hidden">
                  <span>Contact Expert</span>
                  <ChevronRight
                    size={18}
                    className="group-hover/btn:translate-x-2 transition-transform"
                  />
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByBrandSection;
