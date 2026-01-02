"use client";

import { useState } from "react";
import { useGetSingleTire } from "@/src/hooks/tire.hook";
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
  const [tireSet, setTireSet] = useState(1); // ✅ Default set 1 করা হয়েছে
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const { mutate: addToCart, isPending: addingToCart } = useAddItemToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Speeding to your cart...");
      router.push("/cart"); // ✅ রিডাইরেক্ট লজিক
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

  const { mutate: deleteReview } = useDeleteReview({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_REVIEWS"] });
      toast.success("Review deleted!");
    },
  });

  // ✅ লজিক্যাল প্রাইসিং: tireSet এবং quantity দুটোর গুণফল অনুযায়ী গ্র্যান্ড টোটাল
  const getUnitPrice = () => {
    if (tireSet === 2 && tire?.twoSetDiscountPrice)
      return tire.twoSetDiscountPrice / 2;
    if (tireSet === 4 && tire?.fourSetDiscountPrice)
      return tire.fourSetDiscountPrice / 4;
    return tire?.discountPrice || tire?.price || 0;
  };

  const unitPrice = getUnitPrice();
  const finalQuantity = quantity * tireSet; // ✅ আসল কোয়ান্টিটি যা কার্টে যাবে
  const totalPrice = unitPrice * finalQuantity;

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Zap
          className="animate-spin text-orange-600"
          size={48}
        />
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#0f1115] min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Track
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery - No changes needed here */}
          <div className="space-y-4">
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
                className="object-contain p-6 md:p-12 group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {tire?.images?.map((image: string, index: number) => (
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

          {/* Info Side */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${tire?.brand?.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-orange-600 font-black uppercase tracking-[0.2em] text-xs">
                  {tire?.brand?.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star
                    size={12}
                    className="fill-orange-500 text-orange-500"
                  />
                  <span className="text-xs font-bold">
                    {averageRating.toFixed(1)} Pit Rating
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
              {tire?.name}
            </h1>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 text-white rounded-[32px] p-8 mb-8 relative overflow-hidden group">
              <Zap
                className="absolute -right-8 -top-8 text-white/5 group-hover:scale-150 transition-transform duration-1000"
                size={150}
              />
              <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Bundle Total Value
                </p>
                <span className="text-5xl md:text-7xl font-black tracking-tighter italic">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* ✅ ফিক্সড সিলেকশন লজিক: ইউজার চাইলে একক বা সেট সিলেক্ট করবে */}
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTireSet(2);
                    setQuantity(1);
                  }}
                  className={`flex-1 py-5 rounded-[24px] transition-all border-2 flex flex-col items-center gap-1 shadow-lg ${tireSet === 2 ? "bg-gradient-to-br from-rose-600 to-rose-900 border-rose-500 text-white scale-[1.02]" : "bg-gradient-to-br from-rose-600 to-rose-900 border-rose-500 dark:border-rose-500 text-gray-50  hover:opacity-100"}`}>
                  <span className="font-black text-sm uppercase italic">
                    Buy Pair (2 PC)
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">
                    Safety & Balance
                  </span>
                </button>
                <button
                  onClick={() => {
                    setTireSet(4);
                    setQuantity(1);
                  }}
                  className={`flex-1 py-5 rounded-[24px] transition-all border-2 flex flex-col items-center gap-1 shadow-lg ${tireSet === 4 ? "bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-500 text-white scale-[1.02]" : "bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-500 dark:border-emerald-500 text-gray-50  hover:opacity-100"}`}>
                  <span className="font-black text-sm uppercase italic">
                    Full Set (4 PC)
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">
                    Ultimate Performance
                  </span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[24px] w-full md:w-fit border border-gray-100 dark:border-gray-800 justify-between px-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm">
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-black">{quantity}</span>
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
                      quantity: finalQuantity,
                    })
                  } // ✅ finalQuantity ব্যবহার হয়েছে
                  className="w-full md:flex-1 h-20 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:bg-blue-700  text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all group">
                  <span className="flex items-center gap-3">
                    Buy Now{" "}
                    <ChevronRight
                      size={22}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </Button>
              </div>

              {/* ✅ মার্কেটিং মেসেজ: ১টি প্যাকেজ বা ইউনিটের বেশি নিলে তা জানিয়ে দিবে */}
              {quantity > 1 && (
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest text-center animate-pulse">
                  Deploying {quantity}{" "}
                  {tireSet > 1 ? `Sets of ${tireSet}` : "Units"} to your Pit
                  Stop
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tab Sections with Full Information Restored */}
        <div className="mt-16 md:mt-24">
          <Tabs
            aria-label="Tire Specs"
            variant="underlined"
            classNames={{
              tabList: "flex flex-wrap md:flex-nowrap gap-4 md:gap-8",
              cursor: "bg-orange-600 h-1",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-900 dark:text-white">
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Activity size={16} /> Geometry
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Section Width
                          </span>
                          {tire?.sectionWidth}mm
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Overall Diameter
                          </span>
                          {tire?.overallDiameter}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Tread Depth
                          </span>
                          {tire?.treadDepth}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Rim Width
                          </span>
                          {tire?.rimWidthRange}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Package size={16} /> Load & PSI
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Load Index
                          </span>
                          {tire?.loadIndex}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Load Capacity
                          </span>
                          {tire?.loadCapacity}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Load Range
                          </span>
                          {tire?.loadRange}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Max PSI
                          </span>
                          {tire?.maxPSI}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} /> Quality
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Construction
                          </span>
                          {tire?.constructionType}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Traction
                          </span>
                          {tire?.tractionGradeRange}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Treadwear
                          </span>
                          {tire?.treadwearGradeRange}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Temperature
                          </span>
                          {tire?.temperatureGradeRange}
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
                  <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-[40px] text-center sticky top-24 shadow-2xl">
                    <h2 className="text-7xl font-black italic mb-2">
                      {averageRating.toFixed(1)}
                    </h2>
                    <p className="uppercase font-black text-[10px] mb-8 tracking-widest opacity-80">
                      Track Performance
                    </p>
                    {user && !hasAlreadyReviewed && !showReviewForm && (
                      <Button
                        onPress={() => setShowReviewForm(true)}
                        className="w-full bg-white text-orange-600 font-black uppercase h-14 rounded-2xl shadow-xl hover:scale-105 transition-all">
                        Write Review
                      </Button>
                    )}
                    {hasAlreadyReviewed && (
                      <div className="flex flex-col items-center gap-2 bg-black/10 p-4 rounded-2xl">
                        <ShieldAlert size={20} />
                        <span className="text-[10px] font-black uppercase">
                          Reported from Pit
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {showReviewForm && !hasAlreadyReviewed && (
                    <Card className="rounded-[32px] p-2 bg-orange-50 dark:bg-orange-950/10 border-2 border-dashed border-orange-200">
                      <CardBody className="p-6">
                        <div className="flex justify-between mb-6">
                          <h3 className="font-black uppercase text-sm italic">
                            Post Your Record
                          </h3>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="text-gray-400 hover:text-orange-600">
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
                          className="w-full p-6 bg-white dark:bg-[#0f1115] text-gray-900 dark:text-white rounded-3xl min-h-[150px] mb-6 border border-gray-100 dark:border-gray-800 outline-none font-medium"
                          placeholder="Describe the performance..."
                        />
                        <Button
                          onPress={() =>
                            addReview({
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
                      <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          No marks on the road yet.
                        </p>
                      </div>
                    ) : (
                      reviews.map((r: any) => (
                        <div
                          key={r._id}
                          className="bg-gray-50 dark:bg-[#1a1d23] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg">
                          <div className="flex justify-between mb-4">
                            <div className="flex gap-4">
                              <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center font-black text-orange-600 shadow-inner">
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
                              <button
                                onClick={() => deleteReview(r._id)}
                                className="text-red-500 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all">
                                <Trash2 size={18} />
                              </button>
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
