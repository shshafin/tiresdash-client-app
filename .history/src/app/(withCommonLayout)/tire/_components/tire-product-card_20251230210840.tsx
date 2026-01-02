"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useAddItemToWishlist } from "@/src/hooks/wishlist.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useKeenSlider } from "keen-slider/react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  ShoppingCart,
  Star,
  Tags,
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
      toast.success("Cart updated successfully");
    },
    userId: user?._id,
  });

  const { mutate: handleAddItemToWishlist } = useAddItemToWishlist({
    onSuccess: () => {
      toast.success("Item added to wishlist successfully");
    },
  });

  // Helper function to handle cart addition with specific quantity
  const onAddToCart = (qty: number) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return redirect("/login?redirect=/tire");
    }
    handleAddItemToCart({
      productId: tire?._id,
      productType: "tire",
      quantity: qty,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      {/* --- Image Slider Section (Same as before) --- */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="keen-slider h-[220px] bg-gray-100 dark:bg-gray-900">
          {tire.images?.length > 0 ? (
            tire.images.map((image: string, index: number) => (
              <div
                key={index}
                className="keen-slider__slide flex items-center justify-center p-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                  alt={tire.name}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            ))
          ) : (
            <div className="keen-slider__slide flex items-center justify-center">
              <span className="text-gray-400">No Images Available</span>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() =>
              handleAddItemToWishlist({
                product: tire?._id,
                productType: "tire",
              })
            }
            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <Heart className="h-4 w-4 text-gray-700 hover:text-pink-500" />
          </button>
        </div>

        {/* Instant Discount Badge */}
        {tire.discountPrice < tire.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
            Save ${(tire.price - tire.discountPrice).toFixed(0)}
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        {/* Rating and Year */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs text-gray-500 font-bold">5.0</span>
          </div>
          <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md uppercase">
            {tire.year?.year}
          </span>
        </div>

        <h3 className="font-bold text-base line-clamp-2 mb-1 text-gray-900 dark:text-gray-100 uppercase tracking-tight">
          {tire?.name}
        </h3>
        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
          {tire.brand?.name}
        </p>

        {/* --- ✅ NEW: Bulk Discount Tiers --- */}
        <div className="space-y-2 mb-4">
          {/* 2 Set Option */}
          {tire.twoSetDiscountPrice && (
            <button
              onClick={() => onAddToCart(2)}
              className="w-full flex items-center justify-between p-2 rounded-xl border border-dashed border-orange-200 bg-orange-50/30 hover:bg-orange-50 transition-colors group/btn">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white text-[10px] font-black h-5 w-5 rounded-lg flex items-center justify-center">
                  2
                </div>
                <span className="text-[11px] font-bold text-gray-600 uppercase">
                  Buy Pair (Set of 2)
                </span>
              </div>
              <span className="text-xs font-black text-orange-600">
                ${tire.twoSetDiscountPrice.toFixed(2)}
                <span className="text-[9px] text-gray-400 font-normal ml-0.5">
                  /ea
                </span>
              </span>
            </button>
          )}

          {/* 4 Set Option */}
          {tire.fourSetDiscountPrice && (
            <button
              onClick={() => onAddToCart(4)}
              className="w-full flex items-center justify-between p-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 text-white text-[10px] font-black h-5 w-5 rounded-lg flex items-center justify-center">
                  4
                </div>
                <span className="text-[11px] font-bold text-gray-600 uppercase">
                  Full Set (Set of 4)
                </span>
              </div>
              <span className="text-xs font-black text-emerald-600">
                ${tire.fourSetDiscountPrice.toFixed(2)}
                <span className="text-[9px] text-gray-400 font-normal ml-0.5">
                  /ea
                </span>
              </span>
            </button>
          )}
        </div>

        {/* Pricing and Standard Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through font-bold">
              ${tire?.price.toFixed(2)}
            </span>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
              ${tire?.discountPrice?.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={isPending}
              onClick={() => onAddToCart(1)}
              className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-xl transition-all"
              title="Add 1 to Cart">
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-white" />
            </button>
            <Link href={`/tire/${tire?._id}`}>
              <button className="h-10 px-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-orange-200 transition-all">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
