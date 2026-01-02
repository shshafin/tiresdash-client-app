"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Star, ShieldCheck, CloudSun, Car } from "lucide-react";
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
    <div className="relative mt-16 mb-6 group">
      {/* --- ১. ওভারফ্লোয়িং টায়ার ইমেজ (No Slider, No Hover Change) --- */}
      <div
        onClick={() => router.push(`/tire/${tire?._id}`)}
        className="absolute -top-16 -left-4 z-30 w-52 h-52 cursor-pointer transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.images?.[0]}`}
          alt={tire.name}
          className="object-contain w-full h-full drop-shadow-[0_25px_30px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* --- ২. মেইন কার্ড বডি --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[48px] p-6 pt-24 border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)]">
        {/* টেকনিক্যাল চিপস (Top Right) */}
        <div className="absolute top-8 right-8 flex flex-col gap-1.5 items-end">
          <div className="bg-gray-100 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200/50">
            <CloudSun className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">
              All-Season
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-[#242933] px-3 py-1.5 rounded-xl flex items-center gap-2 border border-gray-200/50">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">
              85k Warranty
            </span>
          </div>
        </div>

        {/* ব্র্যান্ড এবং নাম (ইমেজের নিচে ক্লিয়ারলি) */}
        <div
          className="mt-8 mb-6 cursor-pointer"
          onClick={() => router.push(`/tire/${tire?._id}`)}>
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] mb-1">
            {tire.brand?.name}
          </p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight">
            {tire?.name}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
            <span className="text-[10px] font-bold text-gray-400">
              5.0 (PREMIUM TIRE)
            </span>
          </div>
        </div>

        {/* --- ৩. হাইলাইটেড বাল্ক ডিলস (Highlighting Set of 2 & 4) --- */}
        <div className="space-y-3 mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Special Bulk Offers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onAddToCart(2)}
              className="flex flex-col items-center justify-center py-4 rounded-[24px] bg-[#FFF7ED] dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/20 hover:bg-orange-500 group/pair transition-all">
              <span className="text-[9px] font-black text-orange-500 group-hover:text-white uppercase mb-1 tracking-tighter">
                Buy Pair (Set of 2)
              </span>
              <span className="text-lg font-black text-gray-900 dark:text-orange-400 group-hover:text-white">
                ${tire.twoSetDiscountPrice?.toFixed(0)}
                <span className="text-xs font-normal">/ea</span>
              </span>
            </button>

            <button
              onClick={() => onAddToCart(4)}
              className="flex flex-col items-center justify-center py-4 rounded-[24px] bg-[#ECFDF5] dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-500 group/set transition-all">
              <span className="text-[9px] font-black text-emerald-600 group-hover:text-white uppercase mb-1 tracking-tighter">
                Full Set (Set of 4)
              </span>
              <span className="text-lg font-black text-gray-900 dark:text-emerald-400 group-hover:text-white">
                ${tire.fourSetDiscountPrice?.toFixed(0)}
                <span className="text-xs font-normal">/ea</span>
              </span>
            </button>
          </div>
        </div>

        {/* --- ৪. প্রাইসিং এবং অ্যাড টু কার্ট (Responsive & Themed) --- */}
        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center sm:items-start leading-none">
            <span className="text-xs text-gray-400 line-through font-bold mb-1">
              ${tire?.price}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">
                ${tire?.discountPrice}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                /Unit
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="w-full sm:w-auto bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-10 h-16 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_15px_30px_rgba(30,64,175,0.3)] group/btn">
            <span className="text-sm font-black uppercase tracking-widest">
              Buy Now
            </span>
            <ShoppingCart className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
