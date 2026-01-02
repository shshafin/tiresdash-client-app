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
  ShieldCheck,
  CloudSun,
  Car,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProductCard = ({ tire }: { tire: any }) => {
  const queryClient = useQueryClient();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();
  const router = useRouter();

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
    onSuccess: () => toast.success("Saved to wishlist"),
  });

  const onAddToCart = (qty: number) => {
    if (!user) {
      toast.error("Please login first");
      return router.push("/login?redirect=/tire");
    }
    handleAddItemToCart({
      productId: tire?._id,
      productType: "tire",
      quantity: qty,
    });
  };

  return (
    <div className="relative mt-12 mb-4 group h-full">
      {/* --- Floating Product Image: Clicks to Details --- */}
      <div
        onClick={() => router.push(`/tire/${tire?._id}`)}
        className="absolute -top-12 -left-6 z-20 w-48 h-48 cursor-pointer drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
        <div
          ref={sliderRef}
          className="keen-slider w-full h-full">
          {tire.images?.map((image: string, index: number) => (
            <div
              key={index}
              className="keen-slider__slide flex items-center justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                alt={tire.name}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Card --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[40px] p-6 pt-16 border border-gray-100 dark:border-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.05)] h-full flex flex-col transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
        {/* Top Right Info: Tech Specs */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
          <div className="bg-gray-100 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200/50 dark:border-gray-700">
            <CloudSun className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
              All-Season
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200/50 dark:border-gray-700">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
              85k mi Warranty
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200/50 dark:border-gray-700">
            <Car className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
              Commuter
            </span>
          </div>
        </div>

        {/* Brand & Name: Clicks to Details */}
        <div
          onClick={() => router.push(`/tire/${tire?._id}`)}
          className="mt-16 mb-4 cursor-pointer">
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            {tire.brand?.name}
          </p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
            {tire?.name}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="h-3 w-3 fill-orange-500 text-orange-500"
              />
            ))}
            <span className="text-[10px] font-bold text-gray-400 ml-1">
              5.0 (Review)
            </span>
          </div>
        </div>

        {/* Bulk Deals Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onAddToCart(2)}
            className="group/btn relative overflow-hidden flex flex-col items-center justify-center py-3 rounded-2xl border-2 border-orange-50 dark:border-orange-500/10 hover:border-orange-500 transition-all bg-orange-50/30 dark:bg-orange-500/5">
            <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1">
              Buy Pair (x2)
            </span>
            <span className="text-sm font-black text-orange-600 dark:text-orange-400 tracking-tighter">
              ${tire.twoSetDiscountPrice?.toFixed(0)}
              <span className="text-[9px] font-normal">/ea</span>
            </span>
          </button>
          <button
            onClick={() => onAddToCart(4)}
            className="group/btn relative overflow-hidden flex flex-col items-center justify-center py-3 rounded-2xl border-2 border-emerald-50 dark:border-emerald-500/10 hover:border-emerald-500 transition-all bg-emerald-50/30 dark:bg-emerald-500/5">
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">
              Full Set (x4)
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
              ${tire.fourSetDiscountPrice?.toFixed(0)}
              <span className="text-[9px] font-normal">/ea</span>
            </span>
          </button>
        </div>

        {/* Final Price & CTA */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-gray-400 line-through font-bold mb-1">
              ${tire?.price}
            </span>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              ${tire?.discountPrice}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-8 h-14 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20 group/add">
            <span className="text-sm font-black uppercase tracking-widest">
              Add to Cart
            </span>
            <div className="bg-white/20 p-1.5 rounded-lg">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Wishlist Floating Button */}
      <button
        onClick={() =>
          handleAddItemToWishlist({ product: tire?._id, productType: "tire" })
        }
        className="absolute bottom-6 right-6 hidden group-hover:flex h-10 w-10 bg-white dark:bg-gray-800 rounded-full items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 hover:text-red-500 transition-all z-30">
        <Heart className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductCard;
