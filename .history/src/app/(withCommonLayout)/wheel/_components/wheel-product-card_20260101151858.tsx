"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Star, Zap, Gauge, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const WheelCard = ({ wheel }: { wheel: any }) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();

  const { mutate: handleAddItemToCart, isPending } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Speeding to your cart!");
      router.push("/cart");
    },
    userId: user?._id,
  });

  const onAddToCart = (qty: number) => {
    if (!user) {
      toast.error("Please login first");
      return router.push("/login?redirect=/wheel");
    }
    handleAddItemToCart({
      productId: wheel?._id,
      productType: "wheel",
      quantity: qty,
    });
  };

  return (
    <div className="relative mt-20 mb-2 group h-full">
      {/* --- ১. সিগনেচার ইমেজ (Size Reduced as requested) --- */}
      <div
        onClick={() => router.push(`/wheel/${wheel?._id}`)}
        className="absolute -top-16 -left-4 z-30 w-32 h-32 sm:w-40 sm:h-40 cursor-pointer transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${wheel.images?.[0]}`}
          alt={wheel.name}
          className="object-contain w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* --- ২. কার্ড বডি (Height/Width kept original/big) --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[48px] p-5 pt-24 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
        {/* টেকনিক্যাল ব্যাজ */}
        <div className="absolute top-8 right-8 flex flex-col gap-1.5 items-end">
          {wheel.finish && (
            <div className="bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-xl flex items-center gap-2 border border-orange-100/50 shadow-sm">
              <Zap
                size={12}
                className="text-orange-500 fill-orange-500"
              />
              <span className="text-[9px] font-black uppercase text-orange-600 dark:text-orange-400">
                {wheel.finish}
              </span>
            </div>
          )}
        </div>

        {/* --- ৩. প্রোডাক্ট নেম ও ব্র্যান্ড --- */}
        <div
          className="mt-14 mb-4 cursor-pointer"
          onClick={() => router.push(`/wheel/${wheel?._id}`)}>
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">
            {wheel.brand?.name}
          </p>
          <h3 className="relative w-fit text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-blue-700 transition-colors">
            {wheel?.name}
            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
          </h3>
          <div className="flex items-center gap-1.5 mt-2 opacity-70">
            <Gauge
              size={12}
              className="text-gray-400"
            />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Offset: {wheel.offset} | PCD: {wheel.boltPattern}
            </span>
          </div>
        </div>

        {/* --- ৪. কুইক প্যাক ডিলস (Keeping Original Large Buttons) --- */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => onAddToCart(2)}
            className="bg-gradient-to-br from-rose-600 to-rose-900 py-3 px-3 rounded-2xl active:scale-95 transition-all flex items-center justify-between shadow-md">
            <span className="text-[10px] font-black text-white uppercase">
              Buy Pair (2)
            </span>
            <ArrowRight
              size={14}
              className="text-white/50"
            />
          </button>
          <button
            onClick={() => onAddToCart(4)}
            className="bg-gradient-to-br from-emerald-600 to-emerald-900 py-3 px-3 rounded-2xl active:scale-95 transition-all flex items-center justify-between shadow-md">
            <span className="text-[10px] font-black text-white uppercase">
              Full Set (4)
            </span>
            <ArrowRight
              size={14}
              className="text-white/50"
            />
          </button>
        </div>

        {/* --- ৫. প্রাইসিং ও বাই বাটন --- */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col shrink-0">
            {wheel?.discountPrice && wheel?.discountPrice < wheel?.price ? (
              <>
                <span className="text-[11px] text-gray-400 line-through font-bold mb-0.5">
                  ${wheel?.price}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                  ${wheel?.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                ${wheel?.price}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="flex items-center bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-[24px] overflow-hidden shadow-lg active:scale-95 transition-all h-14">
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

export default WheelCard;
