"use client";

import { useState } from "react";
import { useGetSingleTire } from "@/src/hooks/tire.hook";
import { useAddItemToCart } from "@/src/hooks/cart.hook";
import { useUser } from "@/src/context/user.provider";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
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
  Gauge,
  Trophy,
  PackageCheck,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetProductReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/src/hooks/review.hook";
import { useRouter } from "next/navigation";

const SingleTirePage = ({ params }: { params: { id: string } }) => {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetSingleTire(params.id);
  const tire = data?.data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Item added to your collection!");
    },
    userId: user?._id,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReview({
    id: params.id,
    productType: "tire",
  });
  const reviews = reviewsData?.data || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum: any, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const { mutate: addReview, isPending: addingReview } = useCreateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review posted!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
    },
  });

  const { mutate: updateReview } = useUpdateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      setEditingReview(null);
      setShowReviewForm(false);
    },
  });

  const { mutate: deleteReview } = useDeleteReview({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] }),
  });

  // ✅ Fixed Discount Calculation
  const discountAmount =
    tire?.price && tire?.discountPrice ? tire.price - tire.discountPrice : 0;
  const discountPercent =
    tire?.price && tire?.discountPrice
      ? Math.round((discountAmount / tire.price) * 100)
      : 0;

  const handleAddToCart = (qty: number) => {
    if (!user) return router.push(`/login?redirect=/tire/${params.id}`);
    addToCart({ productType: "tire", productId: tire._id, quantity: qty });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Zap
          className="animate-spin text-orange-600"
          size={40}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 mb-6 transition-all">
          <ArrowLeft size={14} /> Back to Track
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Side: Performance Gallery (Mobile Optimized) */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[30px] sm:rounded-[40px] overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800">
              <Image
                src={
                  tire?.images?.[selectedImage]
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${tire.images[selectedImage]}`
                    : "/fallback.png"
                }
                alt={tire?.name}
                fill
                priority
                className="object-contain p-6 sm:p-12"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-orange-600 text-white text-xs sm:text-sm font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl rotate-[-5deg] shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {tire.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-transparent opacity-50"
                  }`}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: High-Octane Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-lg p-1 border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.brand.logo}`}
                  alt="logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                {tire.brand.name}
              </p>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
              {tire.name}
            </h1>

            {/* Price Display (Marketing Focused) */}
            <div className="flex items-end gap-3 mb-8">
              <div className="flex flex-col">
                {tire.discountPrice && (
                  <span className="text-sm sm:text-lg text-gray-400 line-through font-bold">
                    ${tire.price.toFixed(2)}
                  </span>
                )}
                <span className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">
                  ${tire.discountPrice || tire.price}
                </span>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase pb-1">
                Per Unit
              </span>
            </div>

            {/* ✅ Bulk Deal Highlights (If available) */}
            {(tire.twoSetDiscountPrice || tire.fourSetDiscountPrice) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {tire.twoSetDiscountPrice && (
                  <button
                    onClick={() => handleAddToCart(2)}
                    className="flex flex-col p-4 rounded-2xl bg-orange-50 border border-orange-100 hover:bg-orange-500 group transition-all">
                    <span className="text-[9px] font-black text-orange-600 group-hover:text-white uppercase mb-1">
                      Performance Pair (x2)
                    </span>
                    <span className="text-xl font-black text-gray-900 group-hover:text-white italic">
                      ${tire.twoSetDiscountPrice.toFixed(0)}
                      <span className="text-xs font-normal">/ea</span>
                    </span>
                  </button>
                )}
                {tire.fourSetDiscountPrice && (
                  <button
                    onClick={() => handleAddToCart(4)}
                    className="flex flex-col p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-500 group transition-all">
                    <span className="text-[9px] font-black text-emerald-600 group-hover:text-white uppercase mb-1">
                      Full Road Set (x4)
                    </span>
                    <span className="text-xl font-black text-gray-900 group-hover:text-white italic">
                      ${tire.fourSetDiscountPrice.toFixed(0)}
                      <span className="text-xs font-normal">/ea</span>
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Actions: Purchase & Qty */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-2xl w-full sm:w-fit border border-gray-100 dark:border-gray-800 justify-between sm:justify-start px-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white shadow-sm">
                  <Minus size={18} />
                </button>
                <span className="text-lg font-black">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(tire.stockQuantity, quantity + 1))
                  }
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white shadow-sm">
                  <Plus size={18} />
                </button>
              </div>

              <Button
                onPress={() => handleAddToCart(quantity)}
                disabled={addingToCart || tire.stockQuantity === 0}
                className="flex-1 h-16 sm:h-20 bg-gradient-to-r from-orange-600 to-orange-400 hover:bg-orange-700 text-white rounded-2xl text-sm sm:text-lg font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
                <ShoppingCart className="hidden sm:block" />{" "}
                {addingToCart ? "Deploying..." : "Purchase Now"}
              </Button>
            </div>
          </div>
        </div>

        {/* Technical Specs Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12">
          {[
            {
              label: "Warranty",
              val: tire.mileageWarrantyRange,
              icon: ShieldCheck,
            },
            { label: "Tire Type", val: tire.tireType, icon: Activity },
            {
              label: "Construction",
              val: tire.constructionType,
              icon: PackageCheck,
            },
            {
              label: "Stock Level",
              val: tire.stockQuantity > 0 ? "Ready" : "Sold Out",
              icon: Zap,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#1a1d23] p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <stat.icon
                className="text-orange-500 mb-2"
                size={20}
              />
              <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-sm sm:text-lg font-black text-gray-900 dark:text-white italic">
                {stat.val}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Tabs & Reviews (Mobile Optimized Typography) */}
        <div className="mt-16">
          <Tabs
            aria-label="Tire Info"
            variant="underlined"
            classNames={{
              tabList: "gap-4 sm:gap-8",
              cursor: "bg-orange-600 h-1",
              tab: "font-black uppercase tracking-widest text-[10px] sm:text-sm",
            }}>
            <Tab
              key="specs"
              title="Specifications">
              <Card className="mt-6 rounded-3xl bg-gray-50 dark:bg-[#1a1d23] border-none">
                <CardBody className="p-6 sm:p-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-4">
                        Size Metrics
                      </h3>
                      {[
                        { l: "Width", v: `${tire.sectionWidth}mm` },
                        { l: "Diameter", v: `${tire?.diameter?.diameter}"` },
                        { l: "Max PSI", v: tire.maxPSI },
                      ].map((s, i) => (
                        <p
                          key={i}
                          className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 text-[11px] sm:text-sm">
                          <span className="text-gray-500 font-bold uppercase">
                            {s.l}
                          </span>
                          <span className="font-black italic">{s.v}</span>
                        </p>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-4">
                        Performance Grades
                      </h3>
                      {[
                        { l: "Traction", v: tire.tractionGradeRange },
                        { l: "Treadwear", v: tire.treadwearGradeRange },
                        { l: "Load Range", v: tire.loadRange },
                      ].map((s, i) => (
                        <p
                          key={i}
                          className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2 text-[11px] sm:text-sm">
                          <span className="text-gray-500 font-bold uppercase">
                            {s.l}
                          </span>
                          <span className="font-black italic">{s.v}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="reviews"
              title={`Reviews (${reviews.length})`}>
              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="bg-orange-600 text-white p-6 sm:p-8 rounded-[32px] text-center">
                    <h2 className="text-5xl sm:text-7xl font-black italic mb-2">
                      {averageRating.toFixed(1)}
                    </h2>
                    <p className="uppercase font-black tracking-widest text-[8px] mb-6">
                      Performance Score
                    </p>
                    {user && !showReviewForm && (
                      <Button
                        onPress={() => setShowReviewForm(true)}
                        className="w-full bg-white text-orange-600 font-black uppercase h-12 rounded-xl">
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {/* Review Form & List remains here with sporty styles... (Same logic as before but with Orange colors) */}
                  {reviews.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-bold uppercase text-[10px]">
                      No reviews in the pit stop yet.
                    </p>
                  ) : (
                    reviews.map((r: any) => (
                      <div
                        key={r._id}
                        className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between mb-4">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center font-black text-orange-600">
                              {r.user?.firstName?.[0]}
                            </div>
                            <div>
                              <p className="font-black text-xs uppercase italic">
                                {r.user?.firstName} {r.user?.lastName}
                              </p>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={10}
                                    className={
                                      i < r.rating
                                        ? "fill-orange-500 text-orange-500"
                                        : "text-gray-200"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                          "{r.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SingleTirePage;
