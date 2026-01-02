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
  Layers,
  Trophy,
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
      <div className="relative py-12 px-4 overflow-hidden min-h-[350px] flex items-center justify-center">
        
        {/* 🏎️ Racing Background Elements */}
        <div className="absolute inset-0 bg-white dark:bg-black opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl w-full mx-auto group">
          {/* 🏁 The Sporty Compact Card */}
          <div className="relative bg-gradient-to-br from-orange-600 via-rose-600 to-red-700 rounded-[32px] p-8 sm:p-12 shadow-[0_30px_60px_-15px_rgba(234,88,12,0.3)] overflow-hidden border border-white/20 transition-transform duration-500 hover:scale-[1.01]">
            
            {/* 🌊 Animated Watermarks (Floating Logic) */}
            <div className="absolute -right-6 -bottom-6 opacity-5 text-white animate-pulse pointer-events-none">
              <Zap size={250} className="animate-bounce" style={{ animationDuration: '4s' }} />
            </div>
            <div className="absolute -left-10 -top-10 opacity-5 text-white pointer-events-none animate-pulse">
              <Layers size={180} className="animate-spin-slow" style={{ animationDuration: '10s' }} />
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col items-center text-center text-white">
              
              {/* Compact Icon Section with Orbit Glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative size-16 sm:size-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-xl">
                  <Trophy className="size-8 sm:size-10 text-white drop-shadow-md animate-wiggle" />
                </div>
              </div>

              {/* Text Highlights */}
              <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-4 shadow-inner">
                 <div className="size-1.5 bg-yellow-400 rounded-full animate-ping" />
                 <span className="text-[9px] font-black uppercase italic tracking-[0.3em]">Garage Optimization</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-tight mb-4 drop-shadow-xl">
                UPGRADING <br /> <span className="text-black/30">THE VAULT</span>
              </h2>

              <p className="text-xs sm:text-lg font-bold uppercase italic text-orange-50/80 max-w-sm mx-auto leading-snug tracking-wide">
                Something huge is under construction. <br />
                <span className="text-white">Keep your eyes on the track.</span>
              </p>

              {/* Bottom Status (Meaningful Text) */}
              <div className="mt-8 inline-flex items-center gap-3 bg-black/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md group-hover:bg-black/20 transition-colors">
                <Gauge className="size-4 text-yellow-300 animate-pulse" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Status</span>
                  <span className="text-xs font-black uppercase italic tracking-tighter">Tuning Elite Offers...</span>
                </div>
              </div>

            </div>

            {/* Subtle Festive Lines */}
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-6" />
            <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-6" />
          </div>
        </div>
        
        {/* Custom Keyframes in global or component styles */}
        <style jsx>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          .animate-wiggle {
            animation: wiggle 2s ease-in-out infinite;
          }
          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }
        `}</style>
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
