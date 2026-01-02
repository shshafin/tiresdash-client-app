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
  AlertCircle,
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

/* --- 🏎️ TABS COMPONENT (Premium & Automated) --- */
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
      label: "Vehicle Performance",
      icon: Car,
      desc: "Precision Match by Make & Model",
    },
    {
      id: "size",
      label: "Spec Hunter",
      icon: Ruler,
      desc: "Direct Dimension Search",
    },
    {
      id: "brand",
      label: "Elite Brands",
      icon: Building2,
      desc: "Browse Top-Tier Manufacturers",
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setShoppingMethod(tabId);
  };

  return (
    <div className="w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-2xl rounded-t-[40px] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.3)] border-t border-x border-orange-500/20 overflow-hidden">
      {/* 🏁 Sporty Tab Headers */}
      <div className="flex flex-row overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-5 text-[10px] sm:text-xs font-black uppercase italic tracking-widest transition-all relative ${
                isActive
                  ? "text-orange-600 bg-orange-600/5"
                  : "text-gray-400 hover:text-orange-400"
              }`}>
              <tab.icon size={16} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-rose-600 shadow-orange-500 shadow-sm" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setMainStep(1)}
          className="px-6 text-gray-400 hover:text-red-500 transition-colors border-l border-gray-100 dark:border-gray-800">
          <X size={20} />
        </button>
      </div>

      {/* ⚡ Status Line */}
      <div className="bg-orange-600 flex items-center justify-center py-1.5 px-4 gap-2">
        <Flame
          size={12}
          className="text-yellow-300 animate-pulse"
        />
        <p className="text-[9px] sm:text-[10px] font-black uppercase italic text-white tracking-[0.3em]">
          {tabs.find((t) => t.id === activeTab)?.desc}
        </p>
      </div>

      {/* 🏎️ Selection Area */}
      <div className="p-4 sm:p-10 min-h-[550px] dark:text-white">
        {activeTab === "vehicle" && (
          <VehicleSelector
            setMainStep={setMainStep}
            vehicle={vehicle}
            setVehicle={setVehicle}
          />
        )}
        {activeTab === "size" && (
          <SizeSelector
            setMainStep={setMainStep}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        )}
        {activeTab === "brand" && (
          <BrandSelector
            setMainStep={setMainStep}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}
      </div>
    </div>
  );
};

/* --- 🏎️ SHOPPING FOR STEP (Final Confirmation) --- */
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
    <div className="w-full bg-white/95 dark:bg-[#0c0e12]/98 backdrop-blur-3xl rounded-t-[40px] shadow-2xl border-t border-x border-orange-600/30 p-5 sm:p-12">
      {/* Dynamic Summary Card */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="size-16 bg-gradient-to-br from-orange-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/20 mb-4 animate-bounce-slow">
            <CheckCircle
              className="text-white"
              size={32}
            />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter dark:text-white">
            {" "}
            Configuration Locked!
          </h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">
            Proceed to select your driving environment
          </p>
        </div>

        {/* Selected Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[32px] border dark:border-gray-800 flex items-center gap-5">
            <Zap
              className="text-orange-600"
              size={24}
            />
            <div className="uppercase">
              <p className="text-[10px] text-gray-400 font-black tracking-widest">
                Selected Specs
              </p>
              <p className="font-black italic text-lg dark:text-white">
                {shoppingMethod === "vehicle"
                  ? `${vehicle.make} ${vehicle.model}`
                  : shoppingMethod === "size"
                    ? `${selectedSize?.width?.width}/${selectedSize?.ratio?.ratio}R${selectedSize?.diameter?.diameter}`
                    : selectedBrand?.brand?.name}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[32px] border dark:border-gray-800 flex items-center gap-5">
            <Ruler
              className="text-orange-600"
              size={24}
            />
            <div className="uppercase">
              <p className="text-[10px] text-gray-400 font-black tracking-widest">
                Identifier
              </p>
              <p className="font-black italic text-lg dark:text-white">
                {shoppingMethod === "vehicle"
                  ? `Size: ${vehicle.tireSize}`
                  : `Type: ${shoppingMethod}`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {["Tire", "Wheel"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setProductType(type.toLowerCase());
                  setStep(2);
                }}
                className="group relative bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-orange-600 p-10 rounded-[40px] transition-all overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <Image
                    src={type === "Tire" ? "/t.webp" : "/w.webp"}
                    alt={type}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <h3 className="text-3xl font-black uppercase italic mt-6 dark:text-white group-hover:text-orange-600">
                    {type}S
                  </h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-center dark:text-white">
              Define Your Track Environment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {dt?.data?.map((type: any) => (
                <button
                  key={type._id}
                  onClick={() => setDrivingType(type._id)}
                  className={`p-6 rounded-[28px] border-2 text-left transition-all ${
                    drivingType === type._id
                      ? "border-orange-600 bg-orange-600 text-white shadow-xl"
                      : "border-gray-100 dark:border-gray-800 hover:border-orange-400 dark:text-white"
                  }`}>
                  <p className="font-black uppercase italic">{type.title}</p>
                  <p
                    className={`text-[10px] font-bold uppercase opacity-60 ${drivingType === type._id ? "text-white" : "text-gray-500"}`}>
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
                className="w-full h-20 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white text-xl font-black uppercase italic tracking-[0.2em] rounded-[28px] shadow-2xl active:scale-95 transition-all">
                Launch Catalog{" "}
                <ArrowRight
                  size={24}
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
