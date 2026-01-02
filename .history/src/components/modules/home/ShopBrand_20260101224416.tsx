"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBrands } from "@/src/hooks/brand.hook";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";
import { ChevronRight, Zap, Target, Flame } from "lucide-react";

const ShopByBrandSection = () => {
  const { data: brands, isLoading } = useGetBrands({ limit: 12 });

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-44 rounded-[40px] bg-gray-100 dark:bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-[#050505]">
      {/* 🏁 High-Speed Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[2px] bg-orange-600/50 -rotate-45 blur-md animate-pulse" />
        <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[2px] bg-blue-600/50 -rotate-45 blur-md animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏎️ Header: Nitro Injected */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 transform -skew-x-12 mb-6 shadow-2xl border-b-2 border-orange-600">
            <Flame
              size={16}
              className="text-orange-500 animate-bounce"
            />
            <span className="font-black uppercase italic text-xs tracking-[0.4em]">
              World Class Lineup
            </span>
          </div>

          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.85] mb-8">
            SELECT YOUR <br />{" "}
            <span className="text-orange-600 drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              CHAMPION
            </span>
          </h2>
        </div>

        {/* 🛠️ Brand Grid: The Chrome Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {brands?.data?.map((brand: any, index: number) => (
            <Link
              key={brand._id}
              href={`/tire?brand=${encodeURIComponent(brand._id)}`}
              className="group perspective-1000">
              <div className="relative h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] rounded-[40px] border-b-4 border-transparent transition-all duration-500 hover:border-orange-600 hover:shadow-[0_30px_60px_-15px_rgba(234,88,12,0.3)] group-hover:-translate-y-4 group-hover:rotate-x-12 overflow-hidden shadow-xl">
                {/* 🌊 Dynamic Gradient Glow (Default visible) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 opacity-100 transition-opacity" />

                {/* 🖼️ Logo: Always Vibrant */}
                <div className="relative z-10 w-24 h-24 mb-2 transition-all duration-700 group-hover:scale-125">
                  {/* Background Glow Ring */}
                  <div className="absolute inset-0 bg-white dark:bg-white/5 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

                  <Image
                    src={`${envConfig.base_url}${brand.logo}`}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 z-20 drop-shadow-2xl"
                  />
                </div>

                {/* 📄 Info Area */}
                <div className="relative z-10 text-center px-4">
                  <h3 className="font-black text-[10px] sm:text-xs uppercase italic tracking-tighter dark:text-gray-300 text-gray-900 group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h3>
                  {/* Performance Line */}
                  <div className="flex gap-1 mt-2 justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="h-1 w-8 bg-orange-600 rounded-full" />
                    <div className="h-1 w-2 bg-orange-600 rounded-full" />
                  </div>
                </div>

                {/* Shimmer Flash */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 Sporty Command Center CTA */}
        <div className="mt-24">
          <div className="relative bg-gradient-to-br from-gray-900 to-black dark:from-[#0a0a0c] dark:to-black rounded-[50px] p-10 sm:p-16 overflow-hidden border-2 border-orange-600/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            {/* 🌊 Animated Scan Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-600/50 blur-sm animate-[scan_4s_linear_infinite]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-lg text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="bg-orange-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                    <Target
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <h4 className="text-white font-black uppercase italic tracking-[0.3em] text-xs">
                    Search Protocol
                  </h4>
                </div>
                <h3 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
                  STILL SEARCHING <br /> FOR{" "}
                  <span className="text-orange-600">INTEL?</span>
                </h3>
                <p className="text-gray-400 font-bold uppercase italic text-[10px] tracking-widest">
                  Our tactical pit crew will analyze your machine's exact
                  requirements.
                </p>
              </div>

              <Link
                href="/contact"
                className="group/btn relative">
                <div className="absolute inset-0 bg-orange-600 blur-xl opacity-30 group-hover/btn:opacity-60 transition-opacity" />
                <button className="relative bg-white text-black px-12 py-6 rounded-3xl font-black uppercase italic tracking-[0.2em] text-sm flex items-center gap-6 group-hover/btn:bg-orange-600 group-hover/btn:text-white transition-all duration-500 shadow-2xl">
                  Deploy Expert{" "}
                  <ChevronRight
                    size={24}
                    className="group-hover/btn:translate-x-2 transition-transform"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-12 {
          transform: rotateX(10deg);
        }
      `}</style>
    </section>
  );
};

export default ShopByBrandSection;
