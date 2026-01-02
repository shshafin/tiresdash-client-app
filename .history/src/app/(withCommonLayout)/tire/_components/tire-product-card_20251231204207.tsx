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
    <div className="relative mt-12 mb-2 group h-full">
      {/* --- ১. ওভারফ্লোয়িং ইমেজ (সর্বদা প্রথম আপলোড করা ইমেজটি দেখাবে) --- */}
      <div
        onClick={() => router.push(`/tire/${tire?._id}`)}
        className="absolute -top-12 -left-4 z-30 w-44 h-44 sm:w-48 sm:h-48 cursor-pointer transition-transform duration-500 group-hover:scale-105">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.images?.[0]}`} // ✅ সর্বদা প্রথম ইমেজ
          alt={tire.name}
          className="object-contain w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* --- ২. মেইন কার্ড বডি (হাইট কমানো হয়েছে) --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[35px] p-5 pt-20 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full transition-all duration-500 hover:shadow-xl">
        {/* টেকনিক্যাল চিপস (Top Right - ছোট করা হয়েছে) */}
        <div className="absolute top-6 right-6 flex flex-col gap-1 items-end">
          <div className="bg-gray-50 dark:bg-[#242933] px-2 py-1 rounded-lg flex items-center gap-1.5 border border-gray-100/50">
            <CloudSun
              size={12}
              className="text-orange-500"
            />
            <span className="text-[9px] font-black uppercase text-gray-500">
              All-Season
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-[#242933] px-2 py-1 rounded-lg flex items-center gap-1.5 border border-gray-100/50">
            <ShieldCheck
              size={12}
              className="text-blue-600"
            />
            <span className="text-[9px] font-black uppercase text-gray-500">
              Warranty
            </span>
          </div>
        </div>

        {/* ৩. ব্র্যান্ড এবং নাম (যথেষ্ট স্পেস সহ) */}
        <div
          className="mt-12 mb-4 cursor-pointer"
          onClick={() => router.push(`/tire/${tire?._id}`)}>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">
            {tire.brand?.name}
          </p>{" "}
          {/* ✅ গ্যাপ বাড়ানো হয়েছে */}
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight relative w-fit group-hover:text-blue-700 transition-colors">
            {tire?.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>{" "}
            {/* ✅ হোভার আন্ডারলাইন */}
          </h3>
        </div>

        {/* --- ৪. কন্ডিশনাল বাল্ক ডিলস (হাইট কমানো হয়েছে এবং ডিফল্ট বিজি) --- */}
        {(tire.twoSetDiscountPrice || tire.fourSetDiscountPrice) && ( // ✅ কন্ডিশনাল রেন্ডারিং
          <div className="grid grid-cols-2 gap-2 mb-4">
            {tire.twoSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(2)}
                className="flex flex-col items-center justify-center py-2 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 transition-transform active:scale-95">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-tighter">
                  Pair (x2)
                </span>
                <span className="text-sm font-black text-gray-900 dark:text-orange-400">
                  ${tire.twoSetDiscountPrice?.toFixed(0)}
                </span>
              </button>
            )}
            {tire.fourSetDiscountPrice && (
              <button
                onClick={() => onAddToCart(4)}
                className="flex flex-col items-center justify-center py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 transition-transform active:scale-95">
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">
                  Set (x4)
                </span>
                <span className="text-sm font-black text-gray-900 dark:text-emerald-400">
                  ${tire.fourSetDiscountPrice?.toFixed(0)}
                </span>
              </button>
            )}
          </div>
        )}

        {/* --- ৫. প্রাইসিং এবং গ্র্যাডিয়েন্ট বাটন (Responsive) --- */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-gray-400 line-through font-bold mb-1">
              ${tire?.price}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
              ${tire?.discountPrice}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="flex-grow sm:flex-none bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-5 sm:px-8 h-12 sm:h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md group/btn">
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest">
              Buy Now
            </span>
            <ShoppingCart
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
