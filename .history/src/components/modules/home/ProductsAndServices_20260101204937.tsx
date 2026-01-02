"use client";

import { useState } from "react";
import CTA from "./CTA";
import VehicleSelector from "./tabs/vehicle-selector";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {
  CheckCircle,
  Car,
  ArrowRight,
  Ruler,
  Building2,
  X,
  Zap,
  Flame,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SizeSelector from "./tabs/size-selector";
import BrandSelector from "./tabs/brand-selector";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";

const ProductsAndServices = () => {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    tireSize: "",
  });
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [shoppingMethod, setShoppingMethod] = useState("vehicle");

  return (
    <div className="w-full relative">
      {step === 1 && <CTA setStep={setStep} />}
      {step === 2 && (
        <Tabs
          setMainStep={setStep}
          vehicle={vehicle}
          setVehicle={setVehicle}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          setShoppingMethod={setShoppingMethod}
        />
      )}
      {step === 3 && (
        <ShoppingForStep
          pType={
            shoppingMethod === "size"
              ? selectedSize?.productType
              : selectedBrand?.productType
          }
          vehicle={vehicle}
          selectedSize={selectedSize}
          selectedBrand={selectedBrand}
          shoppingMethod={shoppingMethod}
        />
      )}
    </div>
  );
};

export default ProductsAndServices;

/* --- 🏎️ TABS COMPONENT (Fixed Mobile Responsive Grid) --- */
const Tabs = ({
  setMainStep,
  vehicle,
  setVehicle,
  selectedSize,
  setSelectedSize,
  selectedBrand,
  setSelectedBrand,
  setShoppingMethod,
}: any) => {
  const [activeTab, setActiveTab] = useState("vehicle");

  const tabs = [
    {
      id: "vehicle",
      label: "Vehicle",
      icon: Car,
      desc: "Precision Performance Match",
    },
    {
      id: "size",
      label: "Specs",
      icon: Ruler,
      desc: "Direct Dimension Search",
    },
    {
      id: "brand",
      label: "Brands",
      icon: Building2,
      desc: "Elite Manufacturers",
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setShoppingMethod(tabId);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f1115] rounded-t-[32px] overflow-hidden shadow-2xl">
      {/* 🏁 Responsive Tab Grid (No Scrollbar) */}
      <div className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-800 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-4 sm:py-5 px-1 text-[10px] sm:text-xs font-black uppercase italic transition-all relative ${
                isActive
                  ? "text-orange-600 bg-orange-600/5"
                  : "text-gray-400 hover:text-orange-400"
              }`}>
              <tab.icon
                size={14}
                className="sm:w-4 sm:h-4"
              />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-rose-600" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setMainStep(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hidden sm:block">
          <X size={20} />
        </button>
      </div>

      {/* ⚡ Status Line */}
      <div className="bg-orange-600 flex items-center justify-center py-2 px-4 gap-2">
        <Flame
          size={12}
          className="text-yellow-300 animate-pulse"
        />
        <p className="text-[8px] sm:text-[10px] font-black uppercase italic text-white tracking-[0.2em] text-center">
          {tabs.find((t) => t.id === activeTab)?.desc}
        </p>
      </div>

      {/* 🏎️ Selection Content */}
      <div className="p-4 sm:p-10 min-h-[500px] sm:min-h-[600px] text-gray-900 dark:text-white">
        {activeTab === "vehicle" && (
          <VehicleSelector
            setMainStep={() => {}} // Handle auto-step in selector component
            vehicle={vehicle}
            setVehicle={setVehicle}
          />
        )}
        {activeTab === "size" && (
          <SizeSelector
            setMainStep={() => {}}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        )}
        {activeTab === "brand" && (
          <BrandSelector
            setMainStep={() => {}}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}
      </div>
    </div>
  );
};

/* --- 🏎️ SHOPPING FOR STEP (Aggressive Fire-Orange) --- */
const ShoppingForStep = ({
  pType,
  vehicle,
  selectedSize,
  selectedBrand,
  shoppingMethod,
}: any) => {
  const [productType, setProductType] = useState(
    shoppingMethod === "vehicle" ? "" : pType
  );
  const [step, setStep] = useState(shoppingMethod === "vehicle" ? 1 : 2);
  const [drivingType, setDrivingType] = useState("");
  const { data: dt } = useGetDrivingTypes();

  const getProductUrl = () => {
    const baseUrl = `/${productType?.toLowerCase()}`;
    const params = new URLSearchParams();
    if (drivingType) params.append("drivingType", drivingType);

    if (shoppingMethod === "size" && selectedSize) {
      if (selectedSize.width) params.append("width", selectedSize.width._id);
      if (selectedSize.ratio) params.append("ratio", selectedSize.ratio._id);
      if (selectedSize.diameter)
        params.append("diameter", selectedSize.diameter._id);
    } else if (shoppingMethod === "brand" && selectedBrand?.brand) {
      params.append("brand", selectedBrand.brand._id);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#0c0e12] rounded-t-[32px] shadow-2xl border-t border-orange-600/30 p-5 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="size-16 bg-gradient-to-br from-orange-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg mb-4">
            <CheckCircle
              className="text-white"
              size={32}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter dark:text-white">
            {" "}
            Configuration Locked!
          </h2>
        </div>

        {/* Selected Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-[24px] border dark:border-gray-800 flex items-center gap-4">
            <Zap
              className="text-orange-600"
              size={20}
            />
            <div className="uppercase">
              <p className="text-[9px] text-gray-400 font-black">
                Selected Specs
              </p>
              <p className="font-black italic text-sm dark:text-white">
                {shoppingMethod === "vehicle"
                  ? `${vehicle.make} ${vehicle.model}`
                  : shoppingMethod === "size"
                    ? `${selectedSize?.width?.width}/${selectedSize?.ratio?.ratio}R${selectedSize?.diameter?.diameter}`
                    : selectedBrand?.brand?.name}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-[24px] border dark:border-gray-800 flex items-center gap-4">
            <Ruler
              className="text-orange-600"
              size={20}
            />
            <div className="uppercase">
              <p className="text-[9px] text-gray-400 font-black">Identifier</p>
              <p className="font-black italic text-sm dark:text-white">
                {shoppingMethod === "vehicle"
                  ? `Size: ${vehicle.tireSize}`
                  : `Type: ${shoppingMethod}`}
              </p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["Tire", "Wheel"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setProductType(type.toLowerCase());
                  setStep(2);
                }}
                className="group relative bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-orange-600 p-8 rounded-[32px] transition-all flex flex-col items-center">
                <Image
                  src={type === "Tire" ? "/t.webp" : "/w.webp"}
                  alt={type}
                  width={150}
                  height={150}
                  className="object-contain group-hover:scale-110 transition-transform"
                />
                <h3 className="text-2xl font-black uppercase italic mt-4 dark:text-white group-hover:text-orange-600">
                  {type}S
                </h3>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 text-center dark:text-white">
              Define Track Environment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {dt?.data?.map((type: any) => (
                <button
                  key={type._id}
                  onClick={() => setDrivingType(type._id)}
                  className={`p-5 rounded-[20px] border-2 text-left transition-all ${
                    drivingType === type._id
                      ? "border-orange-600 bg-orange-600 text-white shadow-lg"
                      : "border-gray-100 dark:border-gray-800 hover:border-orange-400 dark:text-white"
                  }`}>
                  <p className="font-black uppercase italic text-sm">
                    {type.title}
                  </p>
                  <p
                    className={`text-[9px] font-bold uppercase opacity-60 ${drivingType === type._id ? "text-white" : "text-gray-500"}`}>
                    {type.subTitle}
                  </p>
                </button>
              ))}
            </div>
            <Link
              href={getProductUrl()}
              className="block">
              <Button
                disabled={!drivingType}
                className="w-full h-16 bg-gradient-to-r from-orange-600 to-rose-700 text-white font-black uppercase italic rounded-[20px] shadow-xl">
                Launch Catalog{" "}
                <ArrowRight
                  size={20}
                  className="ml-2"
                />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
