"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Star, ShieldCheck, CloudSun, Zap } from "lucide-react";
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
      {/* --- ১. সিগনেচার ওভারফ্লোয়িং টায়ার (Fixed Index) --- */}
      <div
        onClick={() => router.push(`/tire/${tire?._id}`)}
        className="absolute -top-16 -left-6 z-30 w-48 h-48 sm:w-56 sm:h-56 cursor-pointer transition-transform duration-500 group-hover:scale-105">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.images?.[0]}`}
          alt={tire.name}
          className="object-contain w-full h-full drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* --- ২. কার্ড বডি (Reduced Extra Spacing) --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[48px] p-5 pt-24 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col  transition-all duration-500 hover:shadow-2xl">
        {/* টেকনিক্যাল ব্যাজ (Top Right) */}
        <div className="absolute top-8 right-8 flex flex-col gap-1.5 items-end">
          <div className="bg-gray-50/80 dark:bg-[#242933] px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200/50">
            <CloudSun
              size={14}
              className="text-orange-500"
            />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">
              All-Season
            </span>
          </div>
          <div className="bg-gray-50/80 dark:bg-[#242933] px-3 py-1 rounded-xl flex items-center gap-2 border border-gray-200/50">
            <ShieldCheck
              size={14}
              className="text-blue-600"
            />
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tight">
              85k mi Warranty
            </span>
          </div>
        </div>

        {/* --- ৩. প্রোডাক্ট নেম ও ব্র্যান্ড (Marketing Optimized) --- */}
        <div
          className="mt-14 mb-4 cursor-pointer"
          onClick={() => router.push(`/tire/${tire?._id}`)}>
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
            {tire.brand?.name}
          </p>
          <h3 className="relative w-fit text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {tire?.name}

            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <Star
              size={12}
              className="fill-orange-500 text-orange-500"
            />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Premium Performance Gear
            </span>
          </div>
        </div>

        {/* --- ৪. হাইলাইটেড বাল্ক ডিলস (Default Gradients & Better Text) --- */}
        {(tire.twoSetDiscountPrice || tire.fourSetDiscountPrice) && (
          <div className="grid grid-cols-2 gap-3 mb-0">
            {" "}
            {/* Reduced bottom margin to fix your red border space */}
            {tire.twoSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(2)}
                className="relative overflow-hidden group/btn bg-gradient-to-br from-rose-600 to-rose-900 py-2.5 px-3 rounded-2xl shadow-md active:scale-95 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-black text-white uppercase leading-none">
                    Buy Pair (2)
                  </span>
                  <Zap
                    size={12}
                    className="text-rose-300"
                  />
                </div>
              </button>
            )}
            {tire.fourSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(4)}
                className="relative overflow-hidden group/btn bg-gradient-to-br from-emerald-600 to-emerald-900 py-2.5 px-3 rounded-2xl shadow-md active:scale-95 transition-all">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-black text-white uppercase leading-none">
                    Full Set (4)
                  </span>
                  <Zap
                    size={12}
                    className="text-emerald-400"
                  />
                </div>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-5 border-t border-gray-100 dark:border-gray-800"></div>

        {/* --- ৫. প্রাইসিং ও বাই বাটন (Mobile Fixed & Clean) --- */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col shrink-0">
            <span className="text-[11px] text-gray-400 line-through font-bold mb-0.5">
              ${tire?.price}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
              ${tire?.discountPrice}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="flex items-center bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-[24px] overflow-hidden shadow-lg active:scale-95 transition-all h-14">
            <span className="pl-6 pr-3 text-[11px] font-black uppercase tracking-widest">
              Buy Now
            </span>
            <div className="bg-white/20 h-full w-12 flex items-center justify-center border-l border-white/10">
              <ShoppingCart size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
