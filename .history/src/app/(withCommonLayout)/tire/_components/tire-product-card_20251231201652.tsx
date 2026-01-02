"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useAddItemToWishlist } from "@/src/hooks/wishlist.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useKeenSlider } from "keen-slider/react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProductCard = ({ tire }: { tire: any }) => {
  const queryClient = useQueryClient();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const { mutate: handleAddItemToCart, isPending } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Added to collection");
    },
    userId: user?._id,
  });

  const { mutate: handleAddItemToWishlist } = useAddItemToWishlist({
    onSuccess: () => {
      toast.success("Added to wishlist");
    },
  });

  const onAddToCart = (qty: number) => {
    if (!user) {
      toast.error("Please login first");
      return redirect("/login?redirect=/tire");
    }
    handleAddItemToCart({
      productId: tire?._id,
      productType: "tire",
      quantity: qty,
    });
  };

  return (
    <div className="group relative bg-white dark:bg-[#1a1d23] rounded-[32px] p-4 border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col">
      {/* --- Image Section: Priority 1 --- */}
      <div className="relative rounded-[24px] overflow-hidden bg-[#f8f9fb] dark:bg-[#242933] aspect-[4/3] flex items-center justify-center">
        <div
          ref={sliderRef}
          className="keen-slider w-full h-full">
          {tire.images?.length > 0 ? (
            tire.images.map((image: string, index: number) => (
              <div
                key={index}
                className="keen-slider__slide flex items-center justify-center p-6">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                  alt={tire.name}
                  className="object-contain w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-400 font-medium">
              No Image
            </div>
          )}
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {tire.discountPrice < tire.price && (
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              -
              {(((tire.price - tire.discountPrice) / tire.price) * 100).toFixed(
                0
              )}
              % OFF
            </div>
          )}
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md text-gray-800 dark:text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
            {tire.brand?.name}
          </div>
        </div>

        {/* Quick Wishlist */}
        <button
          onClick={() =>
            handleAddItemToWishlist({ product: tire?._id, productType: "tire" })
          }
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-white/20 group/heart">
          <Heart className="h-4 w-4 group-hover:fill-current" />
        </button>

        {/* Navigation Arrows (Only on Hover) */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              instanceRef.current?.prev();
            }}
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              instanceRef.current?.next();
            }}
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- Product Info Section --- */}
      <div className="mt-5 flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
            <span className="text-xs font-black text-gray-900 dark:text-gray-100">
              4.9
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {tire.year?.year} MODEL
          </span>
        </div>

        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight line-clamp-2 uppercase italic tracking-tighter">
          {tire?.name}
        </h3>

        {/* Tech Specs: Automobile Style (Ref image style) */}
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#242933] p-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
            <Zap className="h-3 w-3 text-orange-500" />
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
              High Performance
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#242933] p-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
            <ShieldCheck className="h-3 w-3 text-blue-500" />
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">
              85k mi Warranty
            </span>
          </div>
        </div>
      </div>

      {/* --- Action Section: Modern & Functional --- */}
      <div className="mt-6 space-y-3">
        {/* Bulk Deals Buttons (Small & Clean) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(2)}
            className="text-[9px] font-black py-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all uppercase">
            Buy Pair (x2)
          </button>
          <button
            onClick={() => onAddToCart(4)}
            className="text-[9px] font-black py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all uppercase">
            Full Set (x4)
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through font-bold">
              ${tire?.price}
            </span>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              ${tire?.discountPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart(1)}
              disabled={isPending}
              className="h-12 w-12 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <Link
              href={`/tire/${tire?._id}`}
              className="flex-grow">
              <button className="h-12 w-full px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group/btn">
                LEARN MORE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
