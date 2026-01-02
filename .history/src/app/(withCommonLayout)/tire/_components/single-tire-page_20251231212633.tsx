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
  Heart,
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Plus,
  Minus,
  Zap,
  Activity,
  Gauge,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAddItemToWishlist } from "@/src/hooks/wishlist.hook";
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

  // --- Logic Hooks (Unchanged for safety) ---
  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Added to collection!");
    },
    userId: user?._id,
  });

  const { mutate: addToWishlist, isPending: addingToWishlist } =
    useAddItemToWishlist({
      onSuccess: () => toast.success("Added to wishlist!"),
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
      toast.success("Review added!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: "" });
    },
  });

  const { mutate: updateReview, isPending: updatingReview } = useUpdateReview({
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

  // --- Calculations ---
  // ✅ Fixed Discount Calculation
  const discountAmount =
    tire?.price && tire?.discountPrice ? tire.price - tire.discountPrice : 0;
  const discountPercent =
    tire?.price && tire?.discountPrice
      ? Math.round((discountAmount / tire.price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!user) return router.push(`/login?redirect=/tire/${params.id}`);
    addToCart({ productType: "tire", productId: tire._id, quantity });
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Zap
          className="animate-spin text-blue-600"
          size={48}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Track
        </button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side: Performance Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800 group">
              <Image
                src={
                  tire?.images?.[selectedImage]
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${tire.images[selectedImage]}`
                    : "/fallback.png"
                }
                alt={tire?.name}
                fill
                priority
                className="object-contain p-12 group-hover:scale-110 transition-transform duration-700"
              />
              {discountPercent > 0 && (
                <div className="absolute top-8 left-8 bg-red-600 text-white font-black px-4 py-2 rounded-2xl rotate-[-10deg] shadow-xl">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {tire.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedImage === index
                      ? "border-blue-600 scale-105"
                      : "border-transparent opacity-60"
                  }`}>
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

          {/* Right Side: High-Octane Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire.brand.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h4 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
                  {tire.brand.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  <span className="text-xs font-bold">
                    {averageRating.toFixed(1)} Performance Score
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
              {tire.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              <Chip
                variant="flat"
                className="bg-gray-100 dark:bg-gray-800 font-black uppercase text-[10px] tracking-widest">
                {tire.tireType}
              </Chip>
              <Chip
                variant="flat"
                className="bg-blue-50 text-blue-600 font-black uppercase text-[10px] tracking-widest">
                {tire.tireSize.tireSize}
              </Chip>
              <Chip
                variant="flat"
                className="bg-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                In Stock
              </Chip>
            </div>

            {/* Pricing Card */}
            <div className="bg-gray-900 text-white rounded-[32px] p-8 mb-8 relative overflow-hidden group">
              <Zap
                className="absolute -right-8 -top-8 text-white/5 group-hover:scale-150 transition-transform duration-1000"
                size={200}
              />
              <div className="relative z-10">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Current Market Value
                </p>
                <div className="flex items-end gap-4">
                  <span className="text-6xl font-black tracking-tighter italic">
                    $
                    {tire.discountPrice
                      ? tire.discountPrice.toFixed(2)
                      : tire.price.toFixed(2)}
                  </span>
                  {tire.discountPrice && (
                    <span className="text-2xl text-gray-500 line-through font-bold mb-2">
                      ${tire.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest">
                  <Activity size={16} /> Fast Worldwide Shipping Available
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[24px] w-fit border border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">
                  <Minus size={20} />
                </button>
                <span className="text-xl font-black w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(tire.stockQuantity, quantity + 1))
                  }
                  className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <Button
                  onPress={handleAddToCart}
                  disabled={addingToCart || tire.stockQuantity === 0}
                  className="flex-1 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 group">
                  <ShoppingCart className="group-hover:translate-x-1 transition-transform" />
                  {addingToCart ? "Deploying..." : "Add to Collection"}
                </Button>
                <Button
                  variant="bordered"
                  onPress={() => handleAddToWishlist()}
                  className="h-20 w-20 rounded-[24px] border-2 border-gray-200 dark:border-gray-800">
                  <Heart className={addingToWishlist ? "animate-ping" : ""} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
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
              className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <stat.icon
                className="text-blue-600 mb-2"
                size={24}
              />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-lg font-black text-gray-900 dark:text-white italic">
                {stat.val}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs & Reviews Section (Structured for Sports Theme) */}
        <div className="mt-20">
          <Tabs
            aria-label="Tire Specs"
            variant="underlined"
            classNames={{
              tabList: "gap-8",
              cursor: "bg-blue-600 h-1",
              tab: "font-black uppercase tracking-widest",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[32px] border-none shadow-sm bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-8">
                  <div className="grid md:grid-cols-3 gap-12">
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-sm mb-6 flex items-center gap-2">
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
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-sm mb-6 flex items-center gap-2">
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
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-sm mb-6 flex items-center gap-2">
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
              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="bg-blue-600 text-white p-8 rounded-[32px] text-center sticky top-24">
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
                        className="w-full bg-white text-blue-600 font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl">
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {showReviewForm && (
                    <Card className="rounded-[32px] p-2 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-blue-200 dark:border-blue-900">
                      <CardBody className="p-6">
                        <h3 className="font-black uppercase tracking-widest text-sm mb-6">
                          {editingReview
                            ? "Re-Tune Review"
                            : "Share Experience"}
                        </h3>
                        <div className="space-y-6">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                onClick={() =>
                                  setReviewForm((p) => ({ ...p, rating: s }))
                                }
                                className={`cursor-pointer transition-all ${s <= reviewForm.rating ? "fill-orange-500 text-orange-500 scale-125" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm((p) => ({
                                ...p,
                                comment: e.target.value,
                              }))
                            }
                            className="w-full p-6 bg-white dark:bg-[#0f1115] rounded-3xl min-h-[150px] outline-none border border-gray-100 dark:border-gray-800 font-medium"
                            placeholder="Tell us about the grip, noise, and comfort..."
                          />
                          <div className="flex gap-4">
                            <Button
                              onPress={() => {
                                if (editingReview)
                                  updateReview({
                                    id: editingReview._id,
                                    data: {
                                      rating: reviewForm.rating,
                                      comment: reviewForm.comment,
                                    },
                                  });
                                else
                                  addReview({
                                    product: tire._id,
                                    productType: "tire",
                                    rating: reviewForm.rating,
                                    comment: reviewForm.comment,
                                  });
                              }}
                              className="bg-blue-600 text-white font-black uppercase tracking-widest h-12 rounded-xl px-8">
                              Submit
                            </Button>
                            <Button
                              onPress={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                              }}
                              variant="light"
                              className="font-black uppercase tracking-widest text-gray-500">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {reviews.length === 0 ? (
                    <p className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest">
                      Be the first to leave a mark!
                    </p>
                  ) : (
                    reviews.map((r: any) => (
                      <div
                        key={r._id}
                        className="bg-gray-50 dark:bg-[#1a1d23] p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-4">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center font-black text-blue-600">
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
                          {user?._id === r.user?._id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingReview(r);
                                  setReviewForm({
                                    rating: r.rating,
                                    comment: r.comment,
                                  });
                                  setShowReviewForm(true);
                                }}
                                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-blue-600">
                                <Zap size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  confirm("Remove review?") &&
                                  deleteReview(r._id)
                                }
                                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-red-500">
                                <Plus
                                  className="rotate-45"
                                  size={14}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic">
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
