"use client";

import { useState } from "react";
import { useGetSingleWheel } from "@/src/hooks/wheel.hook";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useUser } from "@/src/context/user.provider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  ArrowLeft,
  Plus,
  Minus,
  Zap,
  Activity,
  Package,
  X,
  ChevronRight,
  ShieldAlert,
  Trash2,
  Trophy,
  Gauge,
  Palette,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProductReview,
  useCreateReview,
  useDeleteReview,
} from "@/src/hooks/review.hook";
import { useRouter } from "next/navigation";

const SingleWheelPage = ({ params }: { params: { id: string } }) => {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetSingleWheel(params.id);
  const wheel = data?.data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wheelSet, setWheelSet] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Speeding to your cart...");
      router.push("/cart"); // ✅ মিশন ৩: ডিরেক্ট কার্ট
    },
    userId: user?._id,
  });

  const { data: reviewsData } = useGetProductReview({
    id: params.id,
    productType: "wheel",
  });
  const reviews = reviewsData?.data || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const { mutate: addReview } = useCreateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review posted!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
    },
  });

  const { mutate: deleteReview } = useDeleteReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review deleted!");
    },
  });

  // ✅ প্রাইসিং লজিক (Wheel Set অনুযায়ী)
  const getUnitPrice = () => {
    if (wheelSet === 2 && wheel?.twoSetDiscountPrice)
      return wheel.twoSetDiscountPrice / 2;
    if (wheelSet === 4 && wheel?.fourSetDiscountPrice)
      return wheel.fourSetDiscountPrice / 4;
    return wheel?.discountPrice || wheel?.price || 0;
  };

  const unitPrice = getUnitPrice();
  const finalQuantity = quantity * wheelSet;
  const totalPrice = unitPrice * finalQuantity;

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Zap
          className="animate-spin text-blue-600"
          size={48}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors mb-6">
          <ArrowLeft size={16} /> BACK TO SHOWROOM
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800 group">
              <Image
                src={
                  wheel?.images?.[selectedImage]
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${wheel.images[selectedImage]}`
                    : "/fallback.png"
                }
                alt={wheel?.name}
                fill
                priority
                className="object-contain p-6 md:p-12 group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {wheel?.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${selectedImage === index ? "border-blue-600 scale-105" : "border-transparent opacity-60"}`}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt="wheel thumb"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Side */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${wheel?.brand?.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h4 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
                  {wheel?.brand?.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star
                    size={12}
                    className="fill-orange-500 text-orange-500"
                  />
                  <span className="text-xs font-bold">
                    {averageRating.toFixed(1)} Alloy Rating
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
              {wheel?.name}
            </h1>

            {/* Total Price Card */}
            <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white rounded-[32px] p-8 mb-8 relative overflow-hidden group">
              <Settings
                className="absolute -right-8 -top-8 text-white/5 group-hover:rotate-90 transition-transform duration-1000"
                size={150}
              />
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Total Upgrade Value
                </p>
                <span className="text-5xl md:text-7xl font-black tracking-tighter italic">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Wheel Set Buttons (Original Colors/Logic) */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setWheelSet(2);
                    setQuantity(1);
                  }}
                  className={`flex-1 min-w-[140px] py-5 rounded-[24px] transition-all border-2 flex flex-col items-center gap-1 shadow-lg ${wheelSet === 2 ? "bg-gradient-to-br from-rose-600 to-rose-900 border-rose-500 text-white scale-[1.02]" : "bg-gradient-to-br from-rose-600 to-rose-900 border-rose-500 text-white opacity-60 hover:opacity-100"}`}>
                  <span className="font-black text-sm uppercase italic">
                    Buy Pair (2 PC)
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">
                    Safety & Fitment
                  </span>
                </button>

                <button
                  onClick={() => {
                    setWheelSet(4);
                    setQuantity(1);
                  }}
                  className={`flex-1 min-w-[140px] py-5 rounded-[24px] transition-all border-2 flex flex-col items-center gap-1 shadow-lg ${wheelSet === 4 ? "bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-500 text-white scale-[1.02]" : "bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-500 text-white opacity-60 hover:opacity-100"}`}>
                  <span className="font-black text-sm uppercase italic">
                    Full Set (4 PC)
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">
                    Complete Transformation
                  </span>
                </button>

                {(wheelSet === 2 || wheelSet === 4) && (
                  <button
                    onClick={() => {
                      setWheelSet(1);
                      setQuantity(1);
                    }}
                    className="w-full mt-2 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 font-black uppercase italic text-[11px] tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all">
                    <div className="flex items-center justify-center gap-2">
                      <Zap size={14} /> RETURN TO SINGLE UNIT
                    </div>
                  </button>
                )}
              </div>

              {/* Action Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[24px] w-full md:w-fit border border-gray-100 dark:border-gray-800 justify-between px-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-all">
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-black">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(wheel?.stockQuantity || 100, quantity + 1)
                      )
                    }
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-all">
                    <Plus size={18} />
                  </button>
                </div>
                <Button
                  onPress={() =>
                    addToCart({
                      productType: "wheel",
                      productId: wheel._id,
                      quantity: finalQuantity,
                    })
                  }
                  className="w-full md:flex-1 h-20 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all group">
                  <span className="flex items-center gap-3 italic">
                    ENGAGE BUY NOW{" "}
                    <ChevronRight
                      size={22}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Highlights */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-sm">
            <Gauge
              className="text-blue-600 mb-3"
              size={28}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Bolt Pattern
            </p>
            <p className="font-black italic text-gray-900 dark:text-white uppercase">
              {wheel?.boltPattern}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-sm">
            <Palette
              className="text-blue-600 mb-3"
              size={28}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Finish
            </p>
            <p className="font-black italic text-gray-900 dark:text-white uppercase line-clamp-1">
              {wheel?.finish}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-sm">
            <Trophy
              className="text-blue-600 mb-3"
              size={28}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Offset
            </p>
            <p className="font-black italic text-gray-900 dark:text-white uppercase">
              {wheel?.offset}mm
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-sm">
            <ShieldCheck
              className="text-blue-600 mb-3"
              size={28}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Load Rating
            </p>
            <p className="font-black italic text-gray-900 dark:text-white uppercase">
              {wheel?.loadRating}
            </p>
          </div>
        </div>

        {/* Specs Tabs */}
        <div className="mt-16">
          <Tabs
            aria-label="Wheel Specs"
            variant="underlined"
            classNames={{
              cursor: "bg-blue-600 h-1",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
            }}>
            <Tab
              key="specs"
              title="Technical Specs">
              <Card className="mt-6 rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-900 dark:text-white">
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Activity size={16} /> Dimensions
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Diameter
                          </span>{" "}
                          {wheel?.diameter?.diameter}"
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Rim Width
                          </span>{" "}
                          {wheel?.width?.width}"
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Hub Bore
                          </span>{" "}
                          {wheel?.hubBoreSize}mm
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Package size={16} /> Weight & Load
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Load Capacity
                          </span>{" "}
                          {wheel?.loadCapacity} lbs
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Gross Weight
                          </span>{" "}
                          {wheel?.grossWeight}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Bolts
                          </span>{" "}
                          {wheel?.numberOFBolts} qty
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Settings size={16} /> Construction
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Material
                          </span>{" "}
                          {wheel?.materialType}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Type
                          </span>{" "}
                          {wheel?.wheelType}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Accent
                          </span>{" "}
                          {wheel?.wheelAccent}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="description"
              title="Brand Story">
              <Card className="mt-6 rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23] p-8 md:p-12 leading-relaxed italic font-medium">
                "{wheel?.description}"
              </Card>
            </Tab>
            {/* Reviews Tab Logic here (same as tire) */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SingleWheelPage;
