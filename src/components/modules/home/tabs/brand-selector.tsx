"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Search, Zap, Award, ArrowRight, ShieldCheck, X } from "lucide-react";
import { useGetBrands } from "@/src/hooks/brand.hook";

interface BrandSelectorProps {
  setMainStep: (step: any) => void;
  selectedBrand: any;
  setSelectedBrand: (brand: any) => void;
}

const BrandSelector = ({
  setMainStep,
  selectedBrand,
  setSelectedBrand,
}: BrandSelectorProps) => {
  const [productType, setProductType] = useState("tire");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: bd, isLoading } = useGetBrands({});

  const currentBrands: any[] = bd?.data || [];
  const filteredBrands = currentBrands.filter((brand) =>
    brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandSelect = (brand: any) => {
    setSelectedBrand({
      brand: brand,
      productType,
    });
  };

  const handleViewProducts = () => {
    if (selectedBrand?.brand) {
      setMainStep(3);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* 🏎️ Sporty Toggle: Category Selection */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border dark:border-gray-800">
          {["tire", "wheel"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setProductType(type);
                setSelectedBrand(null);
                setSearchTerm("");
              }}
              className={`px-10 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase italic tracking-[0.2em] transition-all duration-300 ${
                productType === type
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                  : "text-gray-400 hover:text-orange-500"
              }`}>
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* 🔍 Elite Search Bar */}
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search
            className={`h-5 w-5 transition-colors ${searchTerm ? "text-orange-600" : "text-gray-500"}`}
          />
        </div>
        <input
          type="text"
          placeholder={`SEARCH ELITE ${productType.toUpperCase()} BRANDS...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-gray-800 focus:border-orange-600 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase italic tracking-widest outline-none transition-all dark:text-white placeholder:text-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500">
            <X size={16} />
          </button>
        )}
      </div>

      {/* 🛠️ Dynamic Content Header */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
          {selectedBrand?.brand
            ? "Selection Confirmed"
            : `Choose ${productType} Brand`}
        </h3>
        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] mt-2 italic">
          Authorized Manufacturers Only
        </p>
      </div>

      {/* 🏁 Brand Grid: Responsive & Sporty */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse"
              />
            ))
        ) : filteredBrands.length > 0 ? (
          filteredBrands.map((brand, index) => {
            const isSelected = selectedBrand?.brand?._id === brand?._id;
            return (
              <button
                key={index}
                onClick={() => handleBrandSelect(brand)}
                className={`group h-20 relative flex items-center justify-center rounded-2xl border-2 font-black uppercase italic text-xs tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                  isSelected
                    ? "border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-600/20"
                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-orange-500/50"
                }`}>
                {isSelected && (
                  <Award
                    size={14}
                    className="absolute top-2 left-2 text-white animate-bounce"
                  />
                )}
                {brand?.name}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <p className="text-gray-400 font-black uppercase italic tracking-[0.2em] opacity-50 underline decoration-orange-600 underline-offset-8">
              No Brand Found in Database
            </p>
          </div>
        )}
      </div>

      {/* 🚀 Final Action Area */}
      {selectedBrand?.brand && (
        <div className="text-center pt-8 animate-in slide-in-from-bottom-6 duration-500">
          <Button
            onPress={handleViewProducts}
            className="h-16 px-16 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white text-sm font-black uppercase italic tracking-[0.2em] rounded-2xl shadow-2xl shadow-orange-600/30 active:scale-95 transition-all">
            Launch {selectedBrand.brand.name} Catalog{" "}
            <ArrowRight
              size={20}
              className="ml-2"
            />
          </Button>
        </div>
      )}

      {/* 🛡️ Footer Metrics */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-gray-100 dark:border-gray-800 opacity-50">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] dark:text-gray-400 text-gray-500">
              Verified Partners Only
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap
              size={14}
              className="text-orange-600"
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] dark:text-gray-400 text-gray-500">
              Showing {filteredBrands.length} Manufacturers
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
