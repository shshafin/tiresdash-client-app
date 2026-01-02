"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllDeals } from "@/src/hooks/deals.hook";
import {
  ArrowRight,
  Loader2,
  ShoppingBag,
  Clock,
  Zap,
  TrendingUp,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Button } from "@heroui/button";
import { useQueryClient } from "@tanstack/react-query";
import { envConfig } from "@/src/config/envConfig";

const ITEMS_PER_PAGE = 8;

const AllDealsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetAllDeals();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDeals, setActiveDeals] = useState<any[]>([]);

  // 1. Process and Filter Deals (তোর অরিজিনাল লজিক)
  useEffect(() => {
    if (data?.data) {
      const now = new Date();
      const filtered = data.data.filter((deal: any) => {
        const expiryDate = new Date(deal.validTo);
        return expiryDate > now;
      });
      setActiveDeals(filtered);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="mt-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-gray-500 text-center">
          Syncing Live Deals...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-[#050505] gap-6">
        <h2 className="text-xl font-black uppercase italic text-red-600 tracking-widest">
          Protocol Failure: Data Unreachable
        </h2>
        <Button
          className="bg-sky-600 text-white font-black uppercase italic px-8 py-6 rounded-none skew-x-[-12deg]"
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ["GET_ALL_DEALS"] })
          }>
          Retry Sync
        </Button>
      </div>
    );

  // 2. Pagination Logic (তোর অরিজিনাল ফাংশনগুলো ফিরিয়ে আনলাম)
  const totalPages = Math.ceil(activeDeals.length / ITEMS_PER_PAGE) || 1;
  const paginatedDeals = activeDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // 3. Empty State
  if (activeDeals.length === 0)
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-gray-100 dark:border-white/5 p-16 bg-gray-50/30 dark:bg-white/5">
          <ShoppingBag className="mb-6 h-20 w-20 text-gray-200 dark:text-white/10" />
          <h2 className="mb-3 text-2xl font-black uppercase italic tracking-tighter dark:text-white">
            No Active Drops Found
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            The garage is empty. All current promotions have ended. Check back
            later for new elite offers.
          </p>
          <Link href="/">
            <Button className="bg-orange-600 text-white font-black uppercase italic px-10 py-7 rounded-2xl tracking-widest shadow-2xl">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-20">
      {/* 🏁 Tactical Header: Sky Blue Aero Gradient */}
      <header className="relative py-20 sm:py-28 px-4 text-center overflow-hidden bg-gradient-to-br from-sky-600 via-sky-900 to-black">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-300/40 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl">
            <Flame
              size={14}
              className="animate-pulse fill-current"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.3em]">
              Flash Deployment
            </span>
          </div>

          <h1 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            HOT{" "}
            <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              DEALS.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-sky-100/70 tracking-[0.2em] leading-relaxed mb-10">
            ELITE TIRES & WHEEL UNITS AT REVOLUTIONARY PRICES.{" "}
            <br className="hidden sm:block" />
            LOCK IN YOUR GEAR BEFORE THE CLOCK HITS ZERO.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-60">
            {[
              { icon: Shield, label: "Warranty" },
              { icon: TrendingUp, label: "Price Lock" },
              { icon: Award, label: "Expert Spec" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">
                <stat.icon
                  size={14}
                  className="text-sky-400"
                />{" "}
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 🛠️ Tactical Grid */}
      <main className="max-w-7xl mx-auto py-12 sm:py-20 px-4">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {paginatedDeals.map((deal: any) => (
            <div
              key={deal._id}
              className="group relative flex flex-col bg-gray-50 dark:bg-[#0f1115] rounded-none sm:rounded-tr-[40px] sm:rounded-bl-[20px] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-sky-500/30 hover:-translate-y-2 shadow-xl overflow-hidden">
              {/* Image Hub */}
              <div className="relative h-52 overflow-hidden bg-gray-900">
                <Image
                  src={`${envConfig.base_url}${deal.image}`}
                  alt={deal.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Discount Badge */}
                <div className="absolute top-4 left-0 z-20 flex flex-col gap-1">
                  <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest italic">
                    ACTIVE DROP
                  </div>
                  {deal.discountPercentage && (
                    <div className="bg-sky-500 text-black text-[9px] font-black px-3 py-1 uppercase tracking-tighter">
                      -{deal.discountPercentage}%
                    </div>
                  )}
                </div>
              </div>

              {/* Content Sector */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black text-sky-500 uppercase tracking-[0.2em] italic">
                    {deal.brand?.name || "Premium Unit"}
                  </span>
                  <div className="flex items-center gap-1 text-[8px] font-black text-gray-500">
                    <Clock
                      size={10}
                      className="text-red-500"
                    />{" "}
                    {new Date(deal.validTo).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-sky-500 transition-colors line-clamp-1">
                  {deal.title}
                </h3>

                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase italic tracking-wider line-clamp-2 mb-6">
                  {deal.description}
                </p>

                {/* Tactical Footer Action */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                  <Link href={`/deals/${deal?._id}`}>
                    <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-black uppercase italic tracking-widest text-[9px] flex items-center justify-center gap-3 transition-all duration-500 hover:bg-sky-600 hover:text-white group/btn shadow-lg">
                      Claim Gear{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 🏁 Pagination Controls (ফিরিয়ে আনা হলো) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="size-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl disabled:opacity-20 hover:border-sky-600 hover:text-white transition-all shadow-xl group">
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <div className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black italic text-xs shadow-2xl">
              {currentPage} <span className="mx-2 text-gray-500">/</span>{" "}
              {totalPages}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="size-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl disabled:opacity-20 hover:border-sky-600 hover:text-white transition-all shadow-xl group">
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
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
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AllDealsPage;
