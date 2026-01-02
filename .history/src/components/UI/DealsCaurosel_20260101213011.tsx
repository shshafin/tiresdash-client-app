"use client";

import React, { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import Slider from "react-slick";
import "keen-slider/keen-slider.min.css";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Percent,
  Sparkles,
  Star,
  Clock,
  ArrowRight,
  Gift,
  Zap,
} from "lucide-react";
import { envConfig } from "@/src/config/envConfig";

const DealsCarousel = ({ data }: { data: any[] }) => {
  const hasDeals = data && data.length > 0;

  // Slider settings
  const settings = {
    dots: true,
    infinite: hasDeals && data.length > 1,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: hasDeals && data.length > 1,
    autoplaySpeed: 4000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet & below
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Custom Arrows
  function SampleNextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-2 border-white/60 dark:border-gray-700/60 rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 hover:border-red-200 dark:hover:border-red-700">
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-2 border-white/60 dark:border-gray-700/60 rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 hover:border-red-200 dark:hover:border-red-700">
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300" />
        </div>
      </div>
    );
  }
if (!hasDeals) {
    return (
      <div className="relative py-24 px-4 overflow-hidden min-h-[500px] flex items-center justify-center">
        
        {/* 🏎️ Racing Background Elements */}
        <div className="absolute inset-0 bg-white dark:bg-black opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl w-full mx-auto group">
          {/* 🏁 The Sporty Festive Card */}
          <div className="relative bg-gradient-to-br from-orange-600 via-rose-600 to-red-700 rounded-[48px] p-10 sm:p-20 shadow-[0_40px_100px_-15px_rgba(234,88,12,0.4)] overflow-hidden border border-white/20">
            
            {/* 🌊 Automotive Watermark (Large Wheel Icon) */}
            <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 pointer-events-none">
              <Zap size={400} className="text-white font-black" />
            </div>
            <div className="absolute -left-20 -top-20 opacity-10 transform -rotate-12 pointer-events-none">
              <Layers size={300} className="text-white" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col items-center text-center text-white">
              
              {/* Icon Section with Pulse Glow */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative size-24 sm:size-28 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="size-12 sm:size-14 text-white drop-shadow-lg" />
                </div>
                {/* Small floating sparkles */}
                <Sparkles className="absolute -top-2 -right-2 size-6 text-yellow-300 animate-bounce" />
              </div>

              {/* Text Highlights */}
              <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 mb-6">
                 <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                 <span className="text-[10px] font-black uppercase italic tracking-[0.3em]">System Update</span>
              </div>

              <h2 className="text-4xl sm:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
                VAULT IS <br /> <span className="text-black/20">LOCKED</span>
              </h2>

              <p className="text-sm sm:text-xl font-bold uppercase italic text-orange-50/80 max-w-md mx-auto leading-relaxed tracking-wide">
                Our team is recalibrating next-gen offers. <br />
                <span className="text-white underline decoration-yellow-400 decoration-2 underline-offset-8">Elite savings incoming.</span>
              </p>

              {/* Bottom Countdown Indicator */}
              <div className="mt-12 flex items-center gap-4 bg-white/10 px-8 py-4 rounded-3xl border border-white/10 backdrop-blur-lg">
                <Clock className="size-5 text-yellow-300 animate-spin-slow" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
                  <span className="text-sm font-black uppercase italic tracking-tighter">Preparing Mission 04</span>
                </div>
              </div>

            </div>

            {/* Festive Confetti Lines (Subtle) */}
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12" />
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white to-red-50/40 dark:from-black dark:via-black dark:to-black">
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-20 left-20 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-1/4 w-4 h-4 bg-red-400/40 rotate-45 animate-bounce delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-orange-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-20 w-2 h-8 bg-yellow-400/40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 px-6 py-3 rounded-full mb-6 border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
            <span className="font-black uppercase text-sm tracking-wider text-red-700 dark:text-red-300">
              Limited Time Offers
            </span>
            <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400 animate-pulse delay-500" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Exclusive
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent animate-pulse">
              Deals & Savings
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Don't miss out on these incredible offers.
            <br />
            <span className="font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Save big on premium tires and wheels today!
            </span>
          </p>
        </div>

        {/* Deals Slider */}
        <div className="relative">
          <Slider {...settings}>
            {data.map((deal) => (
              <div
                key={deal._id}
                className="px-2">
                <div className="group relative h-full  backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02] overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        <span className="font-black text-sm">
                          {deal.discountPercentage}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative w-full h-64 overflow-hidden ">
                    <img
                      src={
                        deal.image
                          ? `${envConfig.base_url}${deal.image}`
                          : "https://images.pexels.com/photos/1170187/pexels-photo-1170187.jpeg?auto=compress&cs=tinysrgb&w=800"
                      }
                      alt={deal.title || "Deal offer"}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full mb-4 border border-red-200/50 dark:border-red-700/50">
                        <Star className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="font-black text-red-700 dark:text-red-300 text-sm uppercase tracking-wider">
                          Instant Savings
                        </span>
                      </div>

                      <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-500">
                        {deal.discountPercentage}% Off Premium Products
                      </h3>
                    </div>

                    {deal.description && (
                      <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                          {deal.description}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          Expires:
                        </span>{" "}
                        {new Date(deal.validTo).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-center pt-4">
                      <a href={`/deals/${deal?._id}`}>
                        <button className="group/btn relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

                          <div className="relative flex items-center gap-2">
                            <span className="text-lg">See Full Details</span>
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
                          </div>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center mt-16">
          <a href="/deals">
            <button className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white font-black px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              {/* Button background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative flex items-center gap-3">
                <Gift className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-lg uppercase tracking-wider">
                  View All Current Deals
                </span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DealsCarousel;
