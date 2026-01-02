"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  CloudSun,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductCard = ({ tire }: { tire: any }) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();

  const { mutate: handleAddItemToCart, isPending } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Added to collection");
    },
    userId: user?._id,
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
    <div className="relative mt-20 mb-2 group h-full">
      {/* --- ১. সিগনেচার ওভারফ্লোয়িং ইমেজ (সর্বদা প্রথম ইমেজ) --- */}
      <div
        onClick={() => router.push(`/tire/${tire?._id}`)}
        className="absolute -top-16 -left-6 z-30 w-48 h-48 sm:w-56 sm:h-56 cursor-pointer transition-transform duration-500 group-hover:scale-105">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.images?.[0]}`}
          alt={tire.name}
          className="object-contain w-full h-full drop-shadow-[0_25px_30px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* --- ২. মেইন কার্ড বডি --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[40px] p-6 pt-24 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-2xl">
        {/* টেকনিক্যাল চিপস (Top Right) */}
        <div className="absolute top-8 right-8 flex flex-col gap-1.5 items-end">
          <div className="bg-gray-50 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100/50">
            <CloudSun
              size={14}
              className="text-orange-500"
            />
            <span className="text-[10px] font-black uppercase text-gray-400">
              All-Season
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-100/50">
            <ShieldCheck
              size={14}
              className="text-blue-600"
            />
            <span className="text-[10px] font-black uppercase text-gray-400">
              85k mi Warranty
            </span>
          </div>
        </div>

        {/* --- ৩. ব্র্যান্ড এবং নাম (যথেষ্ট গ্যাপ সহ) --- */}
        <div
          className="mt-20 mb-6 cursor-pointer"
          onClick={() => router.push(`/tire/${tire?._id}`)}>
          {" "}
          {/* ✅ mt-20 দিয়ে অনেক নিচে নামানো হয়েছে */}
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 opacity-80">
            {tire.brand?.name}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight relative w-fit group-hover:text-blue-700 transition-colors">
            {tire?.name}
            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>{" "}
            {/* ✅ স্পোর্টি আন্ডারলাইন */}
          </h3>
          <div className="flex items-center gap-1 mt-3">
            <Star
              size={12}
              className="fill-orange-500 text-orange-500"
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Premium Performance Gear
            </span>
          </div>
        </div>

        {/* --- ৪. প্রফেশনাল বাল্ক ডিলস (Medium-Dark Gradients) --- */}
        {(tire.twoSetDiscountPrice || tire.fourSetDiscountPrice) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {tire.twoSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(2)}
                className="relative overflow-hidden group/btn bg-gradient-to-br from-gray-800 to-gray-900 hover:from-orange-600 hover:to-orange-500 py-3 px-4 rounded-2xl transition-all duration-300 shadow-lg active:scale-95">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                    Upgrade to Pair
                  </span>{" "}
                  {/* ✅ মার্কেটিং টেক্সট */}
                  <Zap
                    size={14}
                    className="text-orange-400 group-hover/btn:text-white"
                  />
                </div>
              </button>
            )}
            {tire.fourSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(4)}
                className="relative overflow-hidden group/btn bg-gradient-to-br from-gray-800 to-gray-900 hover:from-emerald-600 hover:to-emerald-500 py-3 px-4 rounded-2xl transition-all duration-300 shadow-lg active:scale-95">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                    Full Road Set
                  </span>{" "}
                  {/* ✅ মার্কেটিং টেক্সট */}
                  <Zap
                    size={14}
                    className="text-emerald-400 group-hover/btn:text-white"
                  />
                </div>
              </button>
            )}
          </div>
        )}

        {/* --- ৫. আল্টিমেট মার্কেটিং প্রাইসিং ও বাটন --- */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-rose-500 font-black bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">
                Hot Deal
              </span>{" "}
              {/* ✅ মার্কেটিং হাইলাইট */}
              <span className="text-[10px] text-gray-400 line-through font-bold">
                ${tire?.price}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                ${tire?.discountPrice}
              </span>
              <span className="text-[10px] font-black text-gray-400 ml-1 uppercase">
                Starting
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white px-8 h-16 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_15px_30px_-10px_rgba(30,64,175,0.5)] group/buy">
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Buy Now
            </span>
            <div className="bg-white/20 p-2 rounded-xl group-hover/buy:translate-x-1 transition-transform">
              <ShoppingCart size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
