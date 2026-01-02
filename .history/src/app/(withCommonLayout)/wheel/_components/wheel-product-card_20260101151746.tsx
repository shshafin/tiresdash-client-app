"use client";

import { useUser } from "@/src/context/user.provider";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Zap, Gauge, ArrowRight } from "lucide-react";
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
    <div className="relative mt-12 mb-2 group h-full max-w-[300px] mx-auto">
      {/* --- ১. ওভারহ্যাংগিং ইমেজ (Size Optimized) --- */}
      <div
        onClick={() => router.push(`/wheel/${wheel?._id}`)}
        className="absolute -top-12 -left-4 z-30 w-32 h-32 sm:w-36 sm:h-36 cursor-pointer transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${wheel.images?.[0]}`}
          alt={wheel.name}
          className="object-contain w-full h-full drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* --- ২. কার্ড বডি --- */}
      <div className="bg-white dark:bg-[#1a1d23] rounded-[36px] p-4 pt-20 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl">
        {/* টেকনিক্যাল ব্যাজ */}
        <div className="absolute top-6 right-6 flex flex-col gap-1 items-end">
          {wheel.finish && (
            <div className="bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 border border-orange-100/50">
              <Zap
                size={10}
                className="text-orange-500 fill-orange-500"
              />
              <span className="text-[8px] font-black uppercase text-orange-600 dark:text-orange-400">
                {wheel.finish}
              </span>
            </div>
          )}
        </div>

        {/* --- ৩. প্রোডাক্ট নেম ও ব্র্যান্ড --- */}
        <div
          className="mt-8 mb-3 cursor-pointer"
          onClick={() => router.push(`/wheel/${wheel?._id}`)}>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
            {wheel.brand?.name}
          </p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight line-clamp-1">
            {wheel?.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 opacity-60">
            <Gauge size={10} />
            <span className="text-[8px] font-bold uppercase">
              PCD: {wheel.boltPattern}
            </span>
          </div>
        </div>

        {/* --- ৪. কুইক প্যাক ডিলস --- */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => onAddToCart(2)}
            className="bg-gradient-to-br from-rose-600 to-rose-900 py-2 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1">
            <span className="text-[8px] font-black text-white uppercase tracking-tighter">
              Pair (2)
            </span>
            <ArrowRight
              size={10}
              className="text-white/50"
            />
          </button>
          <button
            onClick={() => onAddToCart(4)}
            className="bg-gradient-to-br from-emerald-600 to-emerald-900 py-2 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1">
            <span className="text-[8px] font-black text-white uppercase tracking-tighter">
              Set (4)
            </span>
            <ArrowRight
              size={10}
              className="text-white/50"
            />
          </button>
        </div>

        {/* --- ৫. প্রাইসিং ও বাই বাটন --- */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            {wheel?.discountPrice ? (
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic">
                ${wheel?.discountPrice}
              </span>
            ) : (
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic">
                ${wheel?.price}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(1)}
            disabled={isPending}
            className="flex items-center bg-blue-700 text-white rounded-2xl overflow-hidden shadow-lg active:scale-95 transition-all h-11 px-4">
            <span className="text-[9px] font-black uppercase tracking-widest mr-2">
              Buy
            </span>
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WheelCard;
