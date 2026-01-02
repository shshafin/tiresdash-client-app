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
  const { data, isLoading } = useGetSingleTire(params.id);
  const tire = data?.data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tireSet, setTireSet] = useState(1);

  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Added to collection!");
    },
    userId: user?._id,
  });

  const { data: reviewsData } = useGetProductReview({
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

  const { mutate: addReview } = useCreateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review added!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
    },
  });

  const { mutate: updateReview } = useUpdateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review updated!");
      setEditingReview(null);
      setShowReviewForm(false);
    },
  });

  const { mutate: deleteReview } = useDeleteReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review deleted!");
    },
  });

  const discountAmount =
    tire?.price && tire?.discountPrice ? tire.price - tire.discountPrice : 0;
  const discountPercent =
    tire?.price && tire?.discountPrice
      ? Math.round((discountAmount / tire.price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!user) return router.push(`/login?redirect=/tire/${params.id}`);
    addToCart({
      productType: "tire",
      productId: tire._id,
      quantity: quantity * tireSet,
    });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Zap
          className="animate-spin text-orange-600"
          size={48}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Track
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery - Responsive */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800 group">
              <Image
                src={
                  tire?.images?.[selectedImage]
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${tire.images[selectedImage]}`
                    : "/fallback.png"
                }
                alt={tire?.name}
                fill
                priority
                className="object-contain p-6 md:p-12 group-hover:scale-110 transition-transform duration-700"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-orange-600 text-white font-black px-3 py-1 md:px-4 md:py-2 rounded-xl rotate-[-10deg] shadow-xl text-xs md:text-base">
                  {discountPercent}% OFF
                </div>
              )}
            </div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {tire.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 md:h-24 md:w-24 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 transition-all ${selectedImage === index ? "border-orange-500 scale-105" : "border-transparent opacity-60"}`}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${image}`}
                    alt="tire thumb"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 md:h-14 md:w-14 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.brand.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h4 className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  {tire.brand.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  <span className="text-[10px] md:text-xs font-bold">
                    {averageRating.toFixed(1)} Performance Score
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4 md:mb-6">
              {tire.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Chip
                variant="flat"
                className="bg-gray-100 dark:bg-gray-800 font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                {tire.tireType}
              </Chip>
              <Chip
                variant="flat"
                className="bg-orange-50 text-orange-600 font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                {tire.tireSize.tireSize}
              </Chip>
            </div>

            {/* Pricing Card with Orange Theme */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-6 relative overflow-hidden group">
              <Zap
                className="absolute -right-8 -top-8 text-white/5 group-hover:scale-150 transition-transform duration-1000"
                size={150}
              />
              <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Total Package Price
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter italic">
                    ${((tire.discountPrice || tire.price) * tireSet).toFixed(2)}
                  </span>
                  {tire.discountPrice && (
                    <span className="text-xl md:text-2xl text-gray-500 line-through font-bold mb-1">
                      ${(tire.price * tireSet).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selection & Actions */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">
                  Set Selection
                </span>
                <div className="flex gap-2">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setTireSet(s)}
                      className={`px-4 py-2 rounded-xl font-black text-xs transition-all border-2 ${tireSet === s ? "bg-orange-600 border-orange-600 text-white" : "border-gray-200 dark:border-gray-800 text-gray-500"}`}>
                      {s === 1 ? "Single" : `${s} Tires`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[20px] w-full md:w-fit border border-gray-100 dark:border-gray-800 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full hover:bg-white shadow-sm transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-black w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(tire.stockQuantity, quantity + 1))
                    }
                    className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full hover:bg-white shadow-sm transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                <Button
                  onPress={handleAddToCart}
                  disabled={addingToCart || tire.stockQuantity === 0}
                  className="w-full md:flex-1 h-16 md:h-20 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white rounded-[20px] md:rounded-[24px] text-sm md:text-lg font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 group">
                  <ShoppingCart
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  {addingToCart ? "Processing..." : "Purchase Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Restore Technical Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
          {[
            {
              label: "Warranty",
              val: tire.mileageWarrantyRange,
              icon: ShieldCheck,
            },
            { label: "Speed", val: tire.speedRatingRange, icon: Gauge },
            {
              label: "Construction",
              val: tire.constructionType,
              icon: Activity,
            },
            { label: "Pattern", val: tire.treadPattern, icon: Trophy },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-[#1a1d23] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-800">
              <stat.icon
                className="text-orange-600 mb-2"
                size={24}
              />
              <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white italic">
                {stat.val}
              </p>
            </div>
          ))}
        </div>

        {/* Restored All Technical Tabs Fields */}
        <div className="mt-12 md:mt-20">
          <Tabs
            aria-label="Tire Specs"
            variant="underlined"
            classNames={{
              tabList: "gap-4 md:gap-8",
              cursor: "bg-orange-600 h-1",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[24px] md:rounded-[32px] border-none shadow-sm bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Column 1: Dimensions */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs md:text-sm mb-6 flex items-center gap-2">
                        <Activity size={16} /> Dimensions
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Section Width
                          </span>
                          <span className="font-black italic">
                            {tire.sectionWidth}mm
                          </span>
                        </p>
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Rim Diameter
                          </span>
                          <span className="font-black italic">
                            {tire?.diameter?.diameter}"
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Column 2: PSI & Load */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs md:text-sm mb-6 flex items-center gap-2">
                        <Gauge size={16} /> Load & PSI
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Max PSI
                          </span>
                          <span className="font-black italic">
                            {tire.maxPSI}
                          </span>
                        </p>
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Load Index
                          </span>
                          <span className="font-black italic">
                            {tire.loadIndex}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Column 3: Grades */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs md:text-sm mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} /> Ratings
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Treadwear
                          </span>
                          <span className="font-black italic">
                            {tire.treadwearGradeRange}
                          </span>
                        </p>
                        <p className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">
                            Traction
                          </span>
                          <span className="font-black italic">
                            {tire.tractionGradeRange}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="reviews"
              title={`Pit Stop Reviews (${reviews.length})`}>
              {/* Review section content - Restored and Orange Styled */}
              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-[32px] text-center sticky top-24">
                    <p className="uppercase font-black tracking-widest text-[10px] mb-4 opacity-80">
                      Average Performance
                    </p>
                    <h2 className="text-7xl font-black italic tracking-tighter mb-4">
                      {averageRating.toFixed(1)}
                    </h2>
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < Math.round(averageRating)
                              ? "fill-white text-white"
                              : "text-white/30"
                          }
                        />
                      ))}
                    </div>
                    {user && !showReviewForm && (
                      <Button
                        onPress={() => setShowReviewForm(true)}
                        className="w-full bg-white text-orange-600 font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl">
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  {/* Mapping reviews (Restored UI from original) */}
                  {reviews.map((r: any) => (
                    <div
                      key={r._id}
                      className="bg-gray-50 dark:bg-[#1a1d23] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center font-black text-orange-600">
                            {r.user?.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 dark:text-white uppercase italic">
                              {r.user?.firstName} {r.user?.lastName}
                            </p>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < r.rating
                                      ? "fill-orange-500 text-orange-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
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
