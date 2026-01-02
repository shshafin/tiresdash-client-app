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
  Trash2,
  Trophy,
  Gauge,
  Palette,
  Settings,
  History,
  Info,
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
      toast.success("Speeding to your cart!");
      router.push("/cart");
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

  const getUnitPrice = () => {
    if (wheelSet === 2 && wheel?.twoSetDiscountPrice)
      return wheel.twoSetDiscountPrice / 2;
    if (wheelSet === 4 && wheel?.fourSetDiscountPrice)
      return wheel.fourSetDiscountPrice / 4;
    return wheel?.discountPrice || wheel?.price || 0;
  };

  const finalQuantity = quantity * wheelSet;
  const totalPrice = getUnitPrice() * finalQuantity;

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
    <div className="bg-white dark:bg-[#0f1115] min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} /> BACK TO SHOWROOM
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800">
              <Image
                src={
                  wheel?.images?.[selectedImage]
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${wheel.images[selectedImage]}`
                    : "/fallback.png"
                }
                alt={wheel?.name}
                fill
                className="object-contain p-12"
                priority
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {wheel?.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border-4 ${selectedImage === index ? "border-blue-600" : "border-transparent opacity-60"}`}>
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

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${wheel?.brand?.logo}`}
                  alt="brand"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h4 className="text-blue-600 font-black uppercase text-xs">
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

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6">
              {wheel?.name}
            </h1>

            <div className="bg-gradient-to-br from-blue-900 to-black text-white rounded-[32px] p-8 mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">
                  Total Upgrade Price
                </p>
                <span className="text-5xl md:text-7xl font-black italic">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Selection Buttons */}
           {/* Selection Buttons - ✅ FIXED Logic with Conditional Rendering */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {/* Pair Button - Only shows if price > 0 */}
                {wheel?.twoSetDiscountPrice > 0 && (
                  <button
                    onClick={() => {
                      setWheelSet(2);
                      setQuantity(1);
                    }}
                    className={`flex-1 py-5 rounded-[24px] border-2 flex flex-col items-center transition-all ${wheelSet === 2 ? "bg-gradient-to-br from-rose-600 to-rose-900 border-rose-400 text-white shadow-lg scale-[1.02]" : "bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white hover:border-rose-400"}`}>
                    <span className="font-black text-sm uppercase">
                      Buy Pair (2 PC)
                    </span>
                    <span className="text-[9px] font-bold opacity-80 uppercase">
                      Special Combo Price
                    </span>
                  </button>
                )}

                {/* Full Set Button - Only shows if price > 0 */}
                {wheel?.fourSetDiscountPrice > 0 && (
                  <button
                    onClick={() => {
                      setWheelSet(4);
                      setQuantity(1);
                    }}
                    className={`flex-1 py-5 rounded-[24px] border-2 flex flex-col items-center transition-all ${wheelSet === 4 ? "bg-gradient-to-br from-emerald-600 to-emerald-900 border-emerald-400 text-white shadow-lg scale-[1.02]" : "bg-white dark:bg-white/5 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white hover:border-emerald-400"}`}>
                    <span className="font-black text-sm uppercase">
                      Full Set (4 PC)
                    </span>
                    <span className="text-[9px] font-bold opacity-80 uppercase">
                      Transformation Deal
                    </span>
                  </button>
                )}
              </div>

              {wheelSet !== 1 && (
                <button
                  onClick={() => {
                    setWheelSet(1);
                    setQuantity(1);
                  }}
                  className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 text-gray-600 font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  RETURN TO SINGLE UNIT
                </button>
              )}

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[24px] justify-between px-6 border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm">
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-black">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(wheel?.stockQuantity || 100, quantity + 1)
                      )
                    }
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white transition-all shadow-sm">
                    <Plus size={18} />
                  </button>
                </div>
                <Button
                  isLoading={addingToCart}
                  onPress={() =>
                    addToCart({
                      productType: "wheel",
                      productId: wheel._id,
                      quantity: finalQuantity,
                    })
                  }
                  className="w-full md:flex-1 h-20 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl active:scale-95 group">
                  <span className="flex items-center gap-3">
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
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border flex flex-col items-center">
            <Gauge
              className="text-blue-600 mb-2"
              size={24}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Bolt Pattern
            </p>
            <p className="font-black italic">{wheel?.boltPattern}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border flex flex-col items-center">
            <Palette
              className="text-blue-600 mb-2"
              size={24}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Color
            </p>
            <p className="font-black italic">{wheel?.wheelColor}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border flex flex-col items-center">
            <Settings
              className="text-blue-600 mb-2"
              size={24}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Offset
            </p>
            <p className="font-black italic">{wheel?.offset}mm</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[32px] border flex flex-col items-center">
            <ShieldCheck
              className="text-blue-600 mb-2"
              size={24}
            />
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
              Condition
            </p>
            <p className="font-black italic">{wheel?.conditionInfo}</p>
          </div>
        </div>

        {/* Detailed Tabs with ALL Interface Fields */}
        <div className="mt-16">
          <Tabs
            variant="underlined"
            classNames={{
              cursor: "bg-blue-600",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[32px] bg-gray-50 dark:bg-[#1a1d23] border-none">
                <CardBody className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-900 dark:text-white">
                    {/* Geometry & Fitment */}
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Activity size={16} /> Fitment & Geometry
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Diameter / Size
                          </span>{" "}
                          {wheel?.diameter?.diameter}" / {wheel?.wheelSize}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Rim Width
                          </span>{" "}
                          {wheel?.rimWidth}mm
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Hub Bore / Size
                          </span>{" "}
                          {wheel?.hubBore} / {wheel?.hubBoreSize}mm
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            ATV Offset
                          </span>{" "}
                          {wheel?.ATVOffset}
                        </p>
                      </div>
                    </div>
                    {/* Construction & Materials */}
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Package size={16} /> Build & Materials
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Material Type
                          </span>{" "}
                          {wheel?.materialType}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Wheel Pieces
                          </span>{" "}
                          {wheel?.wheelPieces}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Construction
                          </span>{" "}
                          {wheel?.constructionType}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Wheel Type
                          </span>{" "}
                          {wheel?.wheelType}
                        </p>
                      </div>
                    </div>
                    {/* Ratings & Technical */}
                    <div>
                      <h3 className="text-blue-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Trophy size={16} /> Performance Specs
                      </h3>
                      <div className="space-y-4 text-sm font-black italic">
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Load Cap / Rating
                          </span>{" "}
                          {wheel?.loadCapacity} / {wheel?.loadRating}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Bolts Qty / Num
                          </span>{" "}
                          {wheel?.BoltsQuantity} / {wheel?.numberOFBolts}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            Gross Weight
                          </span>{" "}
                          {wheel?.grossWeight}
                        </p>
                        <p className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 not-italic uppercase text-[10px]">
                            GTIN
                          </span>{" "}
                          {wheel?.GTIN}
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
              <Card className="mt-6 rounded-[32px] bg-gray-50 dark:bg-[#1a1d23] border-none p-8 leading-relaxed italic font-medium">
                "{wheel?.description}"
              </Card>
            </Tab>

            <Tab
              key="reviews"
              title={`Pit Stop Reviews (${reviews.length})`}>
              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-8 rounded-[40px] text-center sticky top-24 shadow-2xl">
                    <h2 className="text-7xl font-black italic mb-2">
                      {averageRating.toFixed(1)}
                    </h2>
                    <p className="uppercase font-black text-[10px] mb-8 tracking-widest opacity-80">
                      Track Performance
                    </p>
                    {user && !showReviewForm && (
                      <Button
                        onPress={() => setShowReviewForm(true)}
                        className="w-full bg-white text-blue-600 font-black uppercase h-14 rounded-2xl">
                        Write Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {showReviewForm && (
                    <Card className="rounded-[32px] p-6 bg-blue-50 dark:bg-blue-950/10 border-2 border-dashed border-blue-200">
                      <div className="flex justify-between mb-4">
                        <h3 className="font-black uppercase italic">
                          Submit Pit Review
                        </h3>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="text-gray-400 hover:text-red-500">
                          <X size={20} />
                        </button>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            onClick={() =>
                              setReviewForm((p) => ({ ...p, rating: s }))
                            }
                            className={`cursor-pointer ${s <= reviewForm.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`}
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
                        className="w-full p-4 rounded-2xl mb-4 border-none outline-none"
                        placeholder="Experience the alloy performance..."
                        rows={4}
                      />
                      <Button
                        onPress={() =>
                          addReview({
                            product: wheel._id,
                            productType: "wheel",
                            rating: reviewForm.rating,
                            comment: reviewForm.comment,
                          })
                        }
                        className="bg-blue-600 text-white font-black uppercase px-8 rounded-xl">
                        Submit
                      </Button>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-center text-gray-400 py-10">
                        No reviews from the track yet.
                      </p>
                    ) : (
                      reviews.map((r: any) => (
                        <div
                          key={r._id}
                          className="bg-gray-50 dark:bg-[#1a1d23] p-8 rounded-[40px] border">
                          <div className="flex justify-between mb-4">
                            <div className="flex gap-4">
                              <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-600">
                                {r.user?.firstName?.[0]}
                              </div>
                              <div>
                                <p className="font-black uppercase italic text-sm">
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
                                className="text-red-500">
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 italic font-medium">
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

export default SingleWheelPage;
