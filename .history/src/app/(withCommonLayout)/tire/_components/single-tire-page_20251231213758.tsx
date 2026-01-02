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
  Package,
  Info,
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

  // Pricing Logic based on Interface
  const getUnitPrice = () => {
    if (tireSet === 2 && tire?.twoSetDiscountPrice)
      return tire.twoSetDiscountPrice / 2;
    if (tireSet === 4 && tire?.fourSetDiscountPrice)
      return tire.fourSetDiscountPrice / 4;
    return tire?.discountPrice || tire?.price || 0;
  };

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * tireSet * quantity;
  const originalPrice = (tire?.price || 0) * tireSet * quantity;

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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Track
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery Section */}
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

          {/* Core Info */}
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
              <div>
                <h4 className="text-orange-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  {tire?.brand?.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  <span className="text-[10px] md:text-xs font-bold">
                    {averageRating.toFixed(1)} Performance Rating
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
              {tire?.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Chip
                variant="flat"
                className="bg-orange-50 text-orange-600 font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                {tire?.tireType}
              </Chip>
              <Chip
                variant="flat"
                className="bg-gray-100 dark:bg-gray-800 font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                GTIN: {tire?.gtinRange}
              </Chip>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-6 relative overflow-hidden group">
              <Zap
                className="absolute -right-8 -top-8 text-white/5 group-hover:scale-150 transition-transform duration-1000"
                size={150}
              />
              <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Package Total
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter italic">
                    ${totalPrice.toFixed(2)}
                  </span>
                  {originalPrice > totalPrice && (
                    <span className="text-xl md:text-2xl text-gray-500 line-through font-bold mb-1">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-orange-400 text-[10px] font-black uppercase mt-2">
                  Unit Price: ${unitPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Set Selection */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">
                  Choose Bundle
                </span>
                <div className="flex gap-2">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setTireSet(s);
                        setQuantity(1);
                      }}
                      className={`flex-1 py-3 rounded-xl font-black text-xs transition-all border-2 ${tireSet === s ? "bg-orange-600 border-orange-600 text-white" : "border-gray-200 dark:border-gray-800 text-gray-500"}`}>
                      {s === 1 ? "SINGLE" : `${s} SET`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1d23] p-2 rounded-[20px] w-full md:w-fit border border-gray-100 dark:border-gray-800 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-black w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(tire?.stockQuantity, quantity + 1))
                    }
                    className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                <Button
                  onPress={handleAddToCart}
                  disabled={addingToCart || tire?.stockQuantity === 0}
                  className="w-full md:flex-1 h-16 md:h-20 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white rounded-[20px] md:rounded-[24px] text-sm md:text-lg font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
                  <ShoppingCart size={20} />
                  {addingToCart ? "Deploying..." : "Purchase Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Grid (Restored & Enhanced) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
          {[
            {
              label: "Warranty",
              val: tire?.mileageWarrantyRange,
              icon: ShieldCheck,
            },
            { label: "Speed Rating", val: tire?.speedRatingRange, icon: Gauge },
            { label: "Max PSI", val: tire?.maxPSI, icon: Info },
            { label: "Tread Pattern", val: tire?.treadPattern, icon: Trophy },
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

        {/* Tabs with Comprehensive Data from Interface */}
        <div className="mt-12 md:mt-20">
          <Tabs
            aria-label="Tire Specs"
            variant="underlined"
            classNames={{
              cursor: "bg-orange-600",
              tab: "font-black uppercase tracking-widest text-[10px] md:text-sm",
            }}>
            <Tab
              key="specs"
              title="Performance Specs">
              <Card className="mt-6 rounded-[24px] md:rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Column 1: Core Dimensions */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Activity size={16} /> Geometry
                      </h3>
                      <div className="space-y-4">
                        {[
                          { l: "Section Width", v: `${tire?.sectionWidth}mm` },
                          { l: "Overall Diameter", v: tire?.overallDiameter },
                          { l: "Tread Depth", v: tire?.treadDepth },
                          { l: "Rim Width Range", v: tire?.rimWidthRange },
                        ].map((item, idx) => (
                          <p
                            key={idx}
                            className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                            <span className="text-gray-500 font-bold uppercase text-[10px]">
                              {item.l}
                            </span>
                            <span className="font-black italic text-sm">
                              {item.v}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Load & Capacity */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <Package size={16} /> Load & PSI
                      </h3>
                      <div className="space-y-4">
                        {[
                          { l: "Load Index", v: tire?.loadIndex },
                          { l: "Load Capacity", v: tire?.loadCapacity },
                          { l: "Load Range", v: tire?.loadRange },
                          {
                            l: "Max Air Pressure",
                            v: tire?.maxAirPressureRange,
                          },
                        ].map((item, idx) => (
                          <p
                            key={idx}
                            className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                            <span className="text-gray-500 font-bold uppercase text-[10px]">
                              {item.l}
                            </span>
                            <span className="font-black italic text-sm">
                              {item.v}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Ratings & Build */}
                    <div>
                      <h3 className="text-orange-600 font-black uppercase text-xs mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} /> Build Quality
                      </h3>
                      <div className="space-y-4">
                        {[
                          { l: "Construction", v: tire?.constructionType },
                          { l: "Sidewall", v: tire?.sidewallDescriptionRange },
                          {
                            l: "Treadwear Grade",
                            v: tire?.treadwearGradeRange,
                          },
                          { l: "Traction Grade", v: tire?.tractionGradeRange },
                        ].map((item, idx) => (
                          <p
                            key={idx}
                            className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                            <span className="text-gray-500 font-bold uppercase text-[10px]">
                              {item.l}
                            </span>
                            <span className="font-black italic text-sm">
                              {item.v}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab
              key="description"
              title="Description">
              <Card className="mt-6 rounded-[24px] md:rounded-[32px] border-none bg-gray-50 dark:bg-[#1a1d23]">
                <CardBody className="p-6 md:p-10">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {tire?.description}
                  </p>
                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="font-black uppercase text-[10px] text-orange-600 mb-2">
                        Condition Info
                      </h4>
                      <p className="text-sm font-bold italic">
                        {tire?.conditionInfo}
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="font-black uppercase text-[10px] text-orange-600 mb-2">
                        Product Line
                      </h4>
                      <p className="text-sm font-bold italic">
                        {tire?.productLine}
                      </p>
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
                  <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-[32px] text-center sticky top-24">
                    <p className="uppercase font-black tracking-widest text-[10px] mb-4 opacity-80">
                      Score
                    </p>
                    <h2 className="text-7xl font-black italic tracking-tighter mb-4">
                      {averageRating.toFixed(1)}
                    </h2>
                    <Button
                      onPress={() => setShowReviewForm(true)}
                      className="w-full bg-white text-orange-600 font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl">
                      Write a Review
                    </Button>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {reviews.map((r: any) => (
                    <div
                      key={r._id}
                      className="bg-gray-50 dark:bg-[#1a1d23] p-6 rounded-[24px] border border-gray-100 dark:border-gray-800">
                      <div className="flex gap-4 mb-4">
                        <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center font-black text-orange-600">
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
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
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
