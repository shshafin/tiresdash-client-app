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
} from "lucide-react";
import { Button } from "@heroui/button";
import { useQueryClient } from "@tanstack/react-query";
import { envConfig } from "@/src/config/envConfig";

const ITEMS_PER_PAGE = 8; // Optimized for grid layout

const AllDealsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetAllDeals();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDeals, setActiveDeals] = useState<any[]>([]);

  // 1. Process and Filter Deals whenever data changes
  useEffect(() => {
    if (data?.data) {
      const now = new Date();
      // Filter out deals where current date is past validTo (Safety Guard)
      const filtered = data.data.filter((deal: any) => {
        const expiryDate = new Date(deal.validTo);
        return expiryDate > now;
      });
      setActiveDeals(filtered);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-medium">Loading live deals...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-destructive">
          Failed to load deals
        </p>
        <Button
          onPress={() =>
            queryClient.invalidateQueries({ queryKey: ["GET_ALL_DEALS"] })
          }>
          Try Again
        </Button>
      </div>
    );
  }

  // 2. Pagination Logic based on Active Deals
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

  // 3. Empty State (No Active Deals)
  if (activeDeals.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-16">
          <ShoppingBag className="mb-6 h-20 w-20 text-gray-300" />
          <h2 className="mb-3 text-2xl font-bold">No Active Deals Found</h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            All our current promotions have ended. Please check back later for
            new offers on premium tires and wheels!
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 font-bold">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-red-600 fill-red-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
            Flash Sale: Tires & Wheels
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-medium">
          Grab the best discounts on top-tier brands before they expire. Limited
          time offers for limited stock.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" /> Warranty Included
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Price Match
          </span>
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" /> Expert Setup
          </span>
        </div>
      </div>

      {/* Deals Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedDeals.map((deal: any) => (
          <div
            key={deal._id}
            className="group flex flex-col bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={`${envConfig.base_url}${deal.image}`}
                alt={deal.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                  Active Deal
                </span>
                {deal.discountPercentage && (
                  <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                    {deal.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
              <span className="text-xs font-bold text-red-600 uppercase mb-2 tracking-widest">
                {deal.brand?.name || "Premium Brand"}
              </span>
              <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-red-600 transition-colors">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                {deal.description}
              </p>

              {/* Expiry Timer Display */}
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>
                    Ends {new Date(deal.validTo).toLocaleDateString()}
                  </span>
                </div>

                <Link href={`/deals/${deal?._id}`}>
                  <button className="bg-black dark:bg-white dark:text-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all">
                    CLAIM DEAL
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16 pb-8">
          <Button
            variant="flat"
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
            className="font-bold">
            Previous
          </Button>
          <span className="text-sm font-bold px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="flat"
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
            className="font-bold">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllDealsPage;
