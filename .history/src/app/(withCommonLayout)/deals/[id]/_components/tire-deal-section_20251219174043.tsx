"use client";
import React from "react";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useGetDiscountedTiresByBrand } from "@/src/hooks/deals.hook";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { envConfig } from "@/src/config/envConfig";

// ... (StarRating component stays the same)

const TireCard = ({ product }: { product: any }) => {
  return (
    // Removed fixed max-w-sm to allow the grid to control the width
    <Card className="w-full h-full border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col">
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-red-600 flex items-center justify-center rounded-sm">
              <span className="text-white text-xs font-bold">
                {product?.brand?.name[0]}
              </span>
            </div>
            <span className="text-red-600 font-bold text-sm">
              {product?.brand?.name}
            </span>
          </div>
          {/* Moved Discount Chip here for better mobile space usage */}
          {product?.brand?.discountPercentage && (
            <span className="text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded">
              {product?.brand?.discountPercentage}% OFF
            </span>
          )}
        </div>
        <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
          {product?.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </CardHeader>

      <CardBody className="px-4 pb-4 flex-1 flex flex-col">
        <div className="flex justify-center my-4 min-h-[140px]">
          <Image
            src={`${envConfig.base_url}${product.image}`}
            alt={product.name}
            width={140}
            height={140}
            className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-lg transform hover:scale-105 transition-transform"
          />
        </div>

        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 italic">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-red-600 text-sm font-bold">$</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
              {product.price}
            </span>
          </div>

          <Chip
            color="danger"
            variant="flat"
            size="sm"
            className="mb-4 w-full justify-center font-bold">
            INSTANT SAVINGS
          </Chip>

          <Link href={`/tire/${product?._id}`} className="w-full">
            <Button
              color="danger"
              variant="bordered"
              className="w-full font-bold border-2 hover:bg-red-600 hover:text-white transition-all group"
              startContent={<ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />}>
              SHOP NOW
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

const TireDealsSection = ({ brand }: any) => {
  // ... (Hooks and loading/error states stay the same)

  return (
    <div className="w-full py-8 md:py-16 bg-gray-50/30">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight">
            TRENDING <span className="text-red-600">{brand?.name?.toUpperCase()}</span> TIRE DEALS
          </h2>
          <div className="w-20 h-1.5 bg-red-600 rounded mx-auto md:mx-0"></div>
        </div>

        {tireData && tireData.length > 0 ? (
          <div className="space-y-10">
            {/* Grid update: Added sm:grid-cols-2 for perfect mobile/tablet transition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {tireData.map((product: any) => (
                <TireCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Link href={`/deals/${brand?.dealId}/tires`} className="w-full md:w-auto">
                <Button
                  color="danger"
                  size="lg"
                  className="w-full md:w-auto px-8 md:px-16 py-6 md:py-7 font-black text-white bg-red-600 hover:bg-red-700 shadow-xl hover:shadow-red-200 transition-all text-sm md:text-base">
                  VIEW ALL {brand?.name?.toUpperCase()} SAVINGS
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // ... (Empty state stays the same)
        )}
      </div>
    </div>
  );
};

export default TireDealsSection;