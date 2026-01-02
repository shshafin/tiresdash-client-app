"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBrands } from "@/src/hooks/brand.hook";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";
import { ChevronRight, Zap, Target, Flame, BadgeCheck } from "lucide-react";

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
      {/* 🏁 Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏎️ Clear Marketing Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 transform -skew-x-12 mb-6 shadow-xl border-l-4 border-orange-600">
            <BadgeCheck
              size={16}
              className="text-orange-500"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.2em]">
              Authorized Dealer
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-6">
            SHOP BY <span className="text-orange-600">PREMIUM BRANDS</span>
          </h2>

          <p className="text-sm sm:text-base font-bold uppercase italic text-gray-500 tracking-wide max-w-2xl mx-auto leading-relaxed">
            We only stock the world&apos;s most trusted tire manufacturers.{" "}
            <br className="hidden sm:block" />
            <span className="text-gray-900 dark:text-gray-300">
              Guaranteed performance, safety, and long-lasting tread life.
            </span>
          </p>
        </div>

        {/* 🛠️ Brand Grid: Vibrant & Shimmery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {brands?.data?.map((brand: any, index: number) => (
            <Link
              key={brand._id}
              href={`/tire?brand=${encodeURIComponent(brand._id)}`}
              className="group perspective-1000">
              <div className="relative h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] rounded-[40px] border-2 border-transparent transition-all duration-500 hover:border-orange-600 hover:shadow-[0_30px_60px_-15px_rgba(234,88,12,0.25)] group-hover:-translate-y-4 overflow-hidden">
                {/* 🖼️ Logo: Full Color & Large */}
                <div className="relative z-10 w-24 h-24 mb-2 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-white dark:bg-white/5 rounded-full blur-2xl opacity-40" />
                  <Image
                    src={`${envConfig.base_url}${brand.logo}`}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 z-20 drop-shadow-xl"
                  />
                </div>

                {/* 📄 Brand Label */}
                <div className="relative z-10 text-center px-4">
                  <h3 className="font-black text-xs uppercase italic tracking-tighter dark:text-gray-200 text-gray-900 group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all text-orange-600">
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      View Collection
                    </span>
                    <ChevronRight size={10} />
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

        {/* 🚀 Marketing CTA Section */}
        <div className="mt-24">
          <div className="relative bg-gray-900 dark:bg-[#0f1115] rounded-[48px] p-10 sm:p-16 overflow-hidden border-2 border-orange-600/10">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left">
                <h3 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
                  CAN&apos;T FIND YOUR{" "}
                  <span className="text-orange-600">FAVORITE BRAND?</span>
                </h3>
                <p className="text-gray-400 font-bold uppercase italic text-[11px] tracking-widest max-w-lg">
                  We have access to 100+ manufacturers. Talk to our tire experts
                  for custom orders and special sizing.
                </p>
              </div>

              <Link
                href="/contact"
                className="w-full lg:w-auto">
                <button className="w-full bg-orange-600 text-white px-12 py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_rgba(234,88,12,0.3)]">
                  Contact Tire Expert <ChevronRight size={20} />
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
