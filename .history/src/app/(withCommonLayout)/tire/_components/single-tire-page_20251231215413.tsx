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
  Package,
  X,
  Settings,
  ChevronRight,
  ShieldAlert,
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

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

  // ✅ চেক করছি ইউজার কি ইতিমধ্যে রিভিউ দিয়েছে কি না
  const hasAlreadyReviewed = reviews.some(
    (r: any) => r.user?._id === user?._id
  );

  const { mutate: addReview } = useCreateReview({
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

  const getUnitPrice = () => {
    if (tireSet === 2 && tire?.twoSetDiscountPrice)
      return tire.twoSetDiscountPrice / 2;
    if (tireSet === 4 && tire?.fourSetDiscountPrice)
      return tire.fourSetDiscountPrice / 4;
    return tire?.discountPrice || tire?.price || 0;
  };

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * tireSet * quantity;

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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Track
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
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
            </div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {tire?.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 md:h-24 md:w-24 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 transition-all ${
                    selectedImage === index
                      ? "border-orange-500 scale-105"
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

          {/* Info Side */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 md:h-14 md:w-14 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire?.brand?.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  {tire?.brand?.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  <span className="text-[10px] md:text-xs font-bold">
                    {averageRating.toFixed(1)} Pit Rating
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
              {tire?.name}
            </h1>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-8 relative overflow-hidden group">
              <Zap
                className="absolute -right-8 -top-8 text-white/5 group-hover:scale-150 transition-transform duration-1000"
                size={150}
              />
              <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Value Package Total
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter italic">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Selection with Marketing Text */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setTireSet(s);
                      setQuantity(1);
                    }}
                    className={`flex-1 py-4 px-2 rounded-xl font-black text-[10px] md:text-xs transition-all border-2 flex flex-col items-center gap-1 ${
                      tireSet === s
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "border-gray-200 dark:border-gray-800 text-gray-500"
                    }`}>
                    <span className="uppercase">
                      {s === 1
                        ? "Single Unit"
                        : s === 2
                          ? "Safety Pair"
                          : "Road Set"}
                    </span>
                    {s > 1 && (
                      <span
                        className={`text-[8px] px-2 rounded-full font-bold ${tireSet === s ? "bg-white text-orange-600" : "bg-orange-100 text-orange-600"}`}>
                        BUNDLE SAVINGS
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-1.5 rounded-[24px] w-full md:w-fit border border-gray-100 dark:border-gray-800 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm">
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-black w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(tire?.stockQuantity, quantity + 1))
                    }
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm">
                    <Plus size={18} />
                  </button>
                </div>

                <Button
                  onPress={() =>
                    addToCart({
                      productType: "tire",
                      productId: tire._id,
                      quantity: quantity * tireSet,
                    })
                  }
                  className="w-full md:flex-1 h-16 md:h-20 bg-gradient-to-r from-orange-600 to-orange-400 hover:scale-[1.02] active:scale-95 text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3">
                  <span className="flex items-center gap-2">
                    DEPLOY NOW{" "}
                    <ChevronRight
                      size={20}
                      className="animate-pulse"
                    />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Section Responsive Fix */}
        <div className="mt-16 md:mt-24">
          <Tabs
            aria-label="Tire Specs"
            variant="underlined"
            classNames={{
              tabList: "flex flex-wrap md:flex-nowrap gap-4 md:gap-8",
              cursor: "bg-orange-600",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
              panel: "pt-4",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-6 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-900 dark:text-white">
                    {/* Section Width & Geometry */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Activity size={16} /> Geometry
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Section Width
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.sectionWidth}mm
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Overall Diameter
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.overallDiameter}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Tread Depth
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.treadDepth}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Rim Width Range
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.rimWidthRange}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Load & PSI */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Package size={16} /> Load & PSI
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Load Index
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.loadIndex}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Load Capacity
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.loadCapacity}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Load Range
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.loadRange}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Max Air Pressure
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.maxPSI} PSI
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Build Quality */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} /> Build Quality
                      </h3>
                      <div className="space-y-4">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Construction
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.constructionType}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Sidewall
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.sidewallDescriptionRange}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Treadwear Grade
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.treadwearGradeRange}
                          </span>
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-bold text-[10px] uppercase">
                            Traction Grade
                          </span>
                          <span className="font-black italic text-sm">
                            {tire?.tractionGradeRange}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="description"
              title="Description">
              <Card className="mt-6 rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-8 md:p-12">
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed italic">
                    "{tire?.description}"
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="font-black uppercase text-[10px] text-orange-600 mb-2">
                        Condition Info
                      </h4>
                      <p className="font-black italic text-sm text-gray-900 dark:text-white">
                        {tire?.conditionInfo}
                      </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="font-black uppercase text-[10px] text-orange-600 mb-2">
                        Product Line
                      </h4>
                      <p className="font-black italic text-sm text-gray-900 dark:text-white">
                        {tire?.productLine}
                      </p>
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
                  <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-[32px] text-center sticky top-24 shadow-xl">
                    <p className="uppercase font-black text-[10px] mb-2 opacity-80 tracking-widest">
                      Track Performance
                    </p>
                    <h2 className="text-7xl font-black italic mb-6 leading-none">
                      {averageRating.toFixed(1)}
                    </h2>

                    {/* ✅ রিভিউ থাকলে বা লগইন না থাকলে ফর্ম হাইড হবে */}
                    {user ? (
                      hasAlreadyReviewed ? (
                        <div className="bg-white/20 p-4 rounded-xl flex flex-col items-center gap-2">
                          <ShieldAlert size={20} />
                          <span className="text-[10px] font-black uppercase">
                            You've left your mark here!
                          </span>
                        </div>
                      ) : (
                        !showReviewForm && (
                          <Button
                            onPress={() => setShowReviewForm(true)}
                            className="w-full bg-white text-orange-600 font-black uppercase h-14 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                            Write a Review
                          </Button>
                        )
                      )
                    ) : (
                      <p className="text-[10px] font-black uppercase bg-black/10 p-4 rounded-xl">
                        Login to Review
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {/* ✅ ওয়ান-টাইম রিভিউ লজিক সহ ফর্ম */}
                  {showReviewForm && !hasAlreadyReviewed && (
                    <Card className="rounded-[32px] p-2 bg-orange-50 dark:bg-orange-950/10 border-2 border-dashed border-orange-200 shadow-sm">
                      <CardBody className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-black uppercase text-sm tracking-tight">
                            {editingReview
                              ? "Re-Tune Review"
                              : "Leave Your Mark"}
                          </h3>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="text-gray-400 hover:text-orange-600 transition-colors">
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex gap-2 mb-6">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              onClick={() =>
                                setReviewForm((p) => ({ ...p, rating: s }))
                              }
                              className={`cursor-pointer transition-all hover:scale-110 ${
                                s <= reviewForm.rating
                                  ? "fill-orange-500 text-orange-500"
                                  : "text-gray-300"
                              }`}
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
                          className="w-full p-6 bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white rounded-3xl min-h-[150px] mb-6 border border-gray-100 dark:border-gray-800 outline-none font-medium focus:border-orange-500 transition-all"
                          placeholder="Tell the community about the noise, grip, and durability..."
                        />
                        <Button
                          onPress={() =>
                            editingReview
                              ? updateReview({
                                  id: editingReview._id,
                                  data: {
                                    rating: reviewForm.rating,
                                    comment: reviewForm.comment,
                                  },
                                })
                              : addReview({
                                  product: tire._id,
                                  productType: "tire",
                                  rating: reviewForm.rating,
                                  comment: reviewForm.comment,
                                })
                          }
                          className="bg-orange-600 text-white font-black uppercase px-12 h-12 rounded-xl shadow-lg">
                          Submit Review
                        </Button>
                      </CardBody>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          No marks on the road yet.
                        </p>
                      </div>
                    ) : (
                      reviews.map((r: any) => (
                        <div
                          key={r._id}
                          className="bg-gray-50 dark:bg-[#1a1d23] p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 group transition-all hover:shadow-md">
                          <div className="flex justify-between mb-4">
                            <div className="flex gap-4">
                              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center font-black text-orange-600 text-lg shadow-inner">
                                {r.user?.firstName?.[0]}
                              </div>
                              <div>
                                <p className="font-black uppercase italic text-sm text-gray-900 dark:text-white">
                                  {r.user?.firstName} {r.user?.lastName}
                                </p>
                                <div className="flex gap-0.5 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={10}
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
                                  className="text-orange-600 hover:scale-110 transition-transform">
                                  <Settings size={18} />
                                </button>
                                <button
                                  onClick={() => deleteReview(r._id)}
                                  className="text-red-500 hover:scale-110 transition-transform">
                                  <X size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 font-medium italic text-sm leading-relaxed">
                            "{r.comment}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
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
