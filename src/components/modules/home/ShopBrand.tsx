"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBrands } from "@/src/hooks/brand.hook";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";
import { ChevronRight, Zap, BadgeCheck } from "lucide-react";

const ShopByBrandSection = () => {
  const { data: brands, isLoading } = useGetBrands({ limit: 12 });

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 sm:h-44 rounded-2xl sm:rounded-[40px] bg-gray-100 dark:bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-24 px-4 relative overflow-hidden bg-white dark:bg-[#050505]">
      {/* 🏁 Background Element */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏎️ Marketing Header: Responsive Text Sizes */}
        <div className="mb-10 sm:mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 sm:px-5 sm:py-2 transform -skew-x-12 mb-4 sm:mb-6 shadow-xl border-l-4 border-orange-600">
            <BadgeCheck
              size={14}
              className="text-orange-500 sm:w-4 sm:h-4"
            />
            <span className="font-black uppercase italic text-[8px] sm:text-[10px] tracking-[0.2em]">
              Authorized Dealer
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-4 sm:mb-6">
            SHOP BY <span className="text-orange-600">PREMIUM BRANDS</span>
          </h2>

          <p className="text-[10px] sm:text-base font-bold uppercase italic text-gray-500 tracking-wide max-w-2xl mx-auto leading-relaxed px-2">
            World&apos;s most trusted manufacturers.{" "}
            <br className="hidden sm:block" />
            <span className="text-gray-900 dark:text-gray-300">
              Performance & Safety – Guaranteed.
            </span>
          </p>
        </div>

        {/* 🛠️ Brand Grid: Compact on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          {brands?.data?.map((brand: any) => (
            <Link
              key={brand._id}
              href={`/tire?brand=${encodeURIComponent(brand._id)}`}
              className="group perspective-1000">
              <div className="relative h-32 sm:h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] rounded-2xl sm:rounded-[40px] border border-transparent transition-all duration-500 hover:border-orange-600 hover:shadow-[0_20px_40px_rgba(234,88,12,0.15)] group-hover:-translate-y-2 overflow-hidden">
                {/* 🖼️ Logo: Size Optimized */}
                <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 mb-1 sm:mb-2 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-white dark:bg-white/5 rounded-full blur-xl opacity-40" />
                  <Image
                    src={`${envConfig.base_url}${brand.logo}`}
                    alt={brand.name}
                    fill
                    className="object-contain p-3 sm:p-4 z-20 drop-shadow-lg"
                  />
                </div>

                {/* 📄 Brand Label: Mobile-Specific Text */}
                <div className="relative z-10 text-center px-2">
                  <h3 className="font-black text-[9px] sm:text-xs uppercase italic tracking-tighter dark:text-gray-200 text-gray-900 group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h3>
                  <div className="hidden sm:flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all text-orange-600">
                    <span className="text-[8px] font-black uppercase tracking-tighter">
                      Collection
                    </span>
                    <ChevronRight size={8} />
                  </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 Marketing CTA Section: Responsive Padding & Text */}
        <div className="mt-12 sm:mt-24">
          <div className="relative bg-gray-900 dark:bg-[#0f1115] rounded-[32px] sm:rounded-[48px] p-6 sm:p-16 overflow-hidden border border-orange-600/20">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-5xl font-black uppercase italic tracking-tighter text-white mb-2 sm:mb-4">
                  MISSING A <span className="text-orange-600">BRAND?</span>
                </h3>
                <p className="text-gray-400 font-bold uppercase italic text-[8px] sm:text-[11px] tracking-widest max-w-sm sm:max-w-lg">
                  Access to 100+ manufacturers. Custom orders available via pit
                  crew support.
                </p>
              </div>

              <Link
                href="/contact"
                className="w-full lg:w-auto">
                <button className="w-full bg-orange-600 text-white px-6 py-4 sm:px-12 sm:py-6 rounded-xl sm:rounded-2xl font-black uppercase italic tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-sm flex items-center justify-center gap-2 sm:gap-4 hover:bg-white hover:text-black transition-all duration-500 shadow-xl active:scale-95">
                  <span>Contact Expert</span>{" "}
                  <ChevronRight
                    size={16}
                    className="sm:w-5 sm:h-5"
                  />
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
