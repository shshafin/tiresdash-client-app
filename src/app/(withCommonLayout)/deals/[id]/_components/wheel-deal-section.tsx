"use client";
import React from "react";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useGetDiscountedWheelsByBrand } from "@/src/hooks/deals.hook";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { envConfig } from "@/src/config/envConfig";

interface WheelProduct {
  _id: string;
  name: string;
  brand: {
    name: string;
    discountPercentage: string;
    _id: string;
  };
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
}

function transformData(wheelArray: any, brand: any) {
  return (
    wheelArray?.slice(0, 4).map((wheel: any) => ({
      _id: wheel?._id,
      brand,
      name: wheel.name?.toString(),
      image: wheel.images?.[0],
      rating: 5,
      reviewCount: Math.floor(Math.random() * 500),
      price: Math.round(wheel.price),
      description: wheel.description,
    })) || []
  );
}

const StarRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 md:w-4 md:h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs md:text-sm font-medium">{rating}</span>
      </div>
      <span className="text-[10px] md:text-xs text-gray-400">
        ({reviewCount})
      </span>
    </div>
  );
};

const WheelCard = ({ product }: { product: WheelProduct }) => {
  return (
    <Card className="w-full h-full border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-5 bg-red-600 flex items-center justify-center rounded-sm">
              <span className="text-white text-[10px] font-bold">
                {product?.brand?.name?.[0]}
              </span>
            </div>
            <span className="text-red-600 font-bold text-xs md:text-sm">
              {product?.brand?.name}
            </span>
          </div>
          {product?.brand?.discountPercentage && (
            <Chip
              color="success"
              variant="flat"
              size="sm"
              className="font-bold text-[10px]">
              {product?.brand?.discountPercentage}% OFF
            </Chip>
          )}
        </div>
        <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-red-600 transition-colors">
          {product?.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </CardHeader>

      <CardBody className="px-4 pb-4 flex flex-col flex-1">
        <div className="flex justify-center my-4 overflow-hidden">
          <Image
            src={`${envConfig.base_url}${product.image}`}
            alt={product.name}
            width={140}
            height={140}
            className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 italic">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-red-600 font-bold text-sm">$</span>
            <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-50">
              {product.price}
            </span>
            <span className="text-[10px] text-gray-400 self-end mb-1">
              /wheel
            </span>
          </div>

          <Chip
            color="danger"
            variant="flat"
            size="sm"
            className="mb-3 w-full justify-center font-black uppercase text-[10px] tracking-tighter">
            INSTANT SAVINGS APPLIED
          </Chip>

          <Link
            href={`/wheel/${product?._id}`}
            className="w-full block">
            <Button
              color="danger"
              variant="solid"
              className="w-full font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md active:scale-95"
              startContent={<ShoppingCart className="w-4 h-4" />}>
              SHOP NOW
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

const WheelDealsSection = ({ brand }: any) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetDiscountedWheelsByBrand(
    brand?._id
  );

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2 font-medium text-sm">
          Fetching premium wheel deals...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-lg font-semibold text-red-500">
          Unable to load {brand?.name} wheel deals
        </p>
        <Button
          variant="flat"
          color="danger"
          onPress={() =>
            queryClient.invalidateQueries({
              queryKey: ["GET_DISCOUNTED_WHEELS_BY_BRAND"],
            })
          }>
          Try Again
        </Button>
      </div>
    );
  }

  const wheels = data?.data || [];
  const wheelData = transformData(wheels, brand);

  return (
    <div className="w-full py-10 md:py-20 bg-gray-50/50 dark:bg-black/10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black mb-3 text-gray-900 dark:text-white">
            TRENDING{" "}
            <span className="text-red-600 uppercase">{brand?.name}</span> WHEEL
            DEALS
          </h2>
          <div className="w-20 h-1.5 bg-red-600 rounded-full mx-auto md:mx-0"></div>
        </div>

        {wheelData && wheelData.length > 0 ? (
          <div className="flex flex-col gap-10">
            {/* Grid Configuration: 1 col mobile, 2 col tablet, 4 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {wheelData.map((product: any) => (
                <WheelCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-4">
              <Link
                href={`/deals/${brand?.dealId}/wheels`}
                className="w-full md:w-auto">
                <Button
                  color="danger"
                  size="lg"
                  className="w-full md:w-auto px-10 md:px-20 py-6 font-black text-white bg-red-600 hover:bg-red-700 shadow-xl transition-all uppercase tracking-tight">
                  EXPLORE ALL {brand?.name} WHEEL SAVINGS
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white">
            <ShoppingCart className="mb-4 w-12 h-12 text-gray-200" />
            <p className="text-gray-500 text-lg font-medium px-6">
              Currently, there are no active wheel deals for{" "}
              {brand?.name?.toUpperCase()}.
            </p>
            <Button
              variant="light"
              color="danger"
              onPress={() => location.reload()}
              className="mt-4 font-bold">
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelDealsSection;
