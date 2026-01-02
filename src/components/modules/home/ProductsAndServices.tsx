"use client";

import { useState } from "react";
import CTA from "./CTA";
import VehicleSelector from "./tabs/vehicle-selector";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {
  CheckCircle,
  Car,
  ArrowLeft,
  ArrowRight,
  Ruler,
  Building2,
  X,
  Flame,
  Zap,
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
    <>
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
    </>
  );
};

export default ProductsAndServices;

/* --- 🏎️ TABS COMPONENT (Original Logic + Sporty UI) --- */
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
      description: "Match by Year, Make, Model",
    },
    {
      id: "size",
      label: "Size",
      icon: Ruler,
      description: "Search by Dimensions",
    },
    {
      id: "brand",
      label: "Brand",
      icon: Building2,
      description: "Shop Favorite Brands",
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setShoppingMethod(tabId);
    if (tabId !== "vehicle")
      setVehicle({ year: "", make: "", model: "", trim: "", tireSize: "" });
    if (tabId !== "size") setSelectedSize(null);
    if (tabId !== "brand") setSelectedBrand(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white/95 dark:bg-[#0f1115]/98 backdrop-blur-2xl rounded-t-[40px] shadow-2xl border-t border-x border-orange-500/20 overflow-hidden transition-all duration-500">
      {/* 🏁 Tab Headers: Fixed Grid for Mobile */}
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
              <tab.icon size={14} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-rose-600" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setMainStep(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500">
          <X size={18} />
        </button>
      </div>

      {/* ⚡ Status Line */}
      <div className="bg-orange-600 flex items-center justify-center py-2 px-4 gap-2">
        <Flame
          size={12}
          className="text-yellow-300 animate-pulse"
        />
        <p className="text-[8px] sm:text-[10px] font-black uppercase italic text-white tracking-[0.2em] text-center">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>
      </div>

      {/* 🏎️ Content Area */}
      <div className="p-4 sm:p-10 min-h-[450px] sm:min-h-[550px] dark:text-white">
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

/* --- 🏎️ SHOPPING FOR STEP (Original Logic + Sporty UI) --- */
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
  const { data: dt, isLoading } = useGetDrivingTypes();

  const categories = [
    { name: "Tire", image: "/t.webp" },
    { name: "Wheel", image: "/w.webp" },
  ];

  const getProductUrl = () => {
    const baseUrl = `/${productType?.toLowerCase()}`;
    const drivingParam = drivingType ? `drivingType=${drivingType}` : "";
    if (shoppingMethod === "vehicle")
      return `${baseUrl}${drivingParam ? `?${drivingParam}` : ""}`;

    const params = new URLSearchParams();
    if (drivingType) params.append("drivingType", drivingType);
    if (shoppingMethod === "size" && selectedSize) {
      if (selectedSize.width) params.append("width", selectedSize.width._id);
      if (selectedSize.ratio) params.append("ratio", selectedSize.ratio._id);
      if (selectedSize.diameter)
        params.append("diameter", selectedSize.diameter._id);
    }
    if (shoppingMethod === "brand" && selectedBrand?.brand) {
      params.append("brand", selectedBrand.brand._id);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#0c0e12] rounded-t-[40px] shadow-2xl border-t border-orange-600/30 p-5 sm:p-12 overflow-hidden transition-all duration-500">
      <Card className="shadow-none bg-transparent">
        <CardBody className="p-0">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="size-16 bg-gradient-to-br from-orange-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg mb-4">
              {shoppingMethod === "vehicle" ? (
                <Car
                  className="text-white"
                  size={32}
                />
              ) : shoppingMethod === "size" ? (
                <Ruler
                  className="text-white"
                  size={32}
                />
              ) : (
                <Building2
                  className="text-white"
                  size={32}
                />
              )}
            </div>
            <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter dark:text-white">
              {shoppingMethod === "vehicle"
                ? "VEHICLE SECURED!"
                : shoppingMethod === "size"
                  ? "SIZE IDENTIFIED!"
                  : "BRAND SELECTED!"}
            </h3>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              Ready to fuel your performance
            </p>
          </div>

          {/* Configuration Card */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Zap
                size={18}
                className="text-orange-600"
              />
              <h4 className="font-black uppercase italic text-xs tracking-widest opacity-70">
                Active Specs
              </h4>
            </div>

            {shoppingMethod === "vehicle" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 italic uppercase">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400">Make/Model</span>
                  <span className="font-black text-sm">
                    {vehicle.make} {vehicle.model}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400">Year</span>
                  <span className="font-black text-sm">{vehicle.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400">Trim</span>
                  <span className="font-black text-sm">
                    {vehicle.trim || "BASE"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px]  text-orange-600">Spec</span>
                  <span className="font-black text-sm text-orange-600">
                    {vehicle.tireSize}
                  </span>
                </div>
              </div>
            ) : shoppingMethod === "size" ? (
              <div className="grid grid-cols-3 gap-4 italic uppercase">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400">Width</span>
                  <span className="font-black text-sm">
                    {selectedSize?.width?.width || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400">Ratio</span>
                  <span className="font-black text-sm">
                    {selectedSize?.ratio?.ratio || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px]  text-orange-600">Rim</span>
                  <span className="font-black text-sm text-orange-600">
                    {selectedSize?.diameter?.diameter}"
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col italic uppercase">
                <span className="text-[9px] text-gray-400">
                  Target Manufacturer
                </span>
                <span className="font-black text-2xl text-orange-600">
                  {selectedBrand?.brand?.name}
                </span>
              </div>
            )}
          </div>
        </CardBody>

        {step === 1 && shoppingMethod === "vehicle" && (
          <CardFooter className="flex flex-col p-0">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8 dark:text-white">
              What Gear do you need?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setProductType(cat.name.toLowerCase());
                    setStep(2);
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-[32px] border-2 border-transparent hover:border-orange-600 transition-all duration-500 bg-gray-50 dark:bg-white/5 p-8 flex flex-col items-center">
                  <div className="relative w-36 h-36 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mt-4 dark:text-white">
                    {cat.name}S
                  </h3>
                </div>
              ))}
            </div>
          </CardFooter>
        )}

        {step === 2 && (
          <CardFooter className="flex flex-col p-0 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8 dark:text-white">
              Environment Selection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
              {dt?.data?.map((type: any) => (
                <div
                  key={type._id}
                  onClick={() => setDrivingType(type._id)}
                  className={`group p-6 rounded-[24px] border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    drivingType === type._id
                      ? "border-orange-600 bg-orange-600 text-white shadow-xl"
                      : "border-gray-100 dark:border-gray-800 hover:border-orange-400 dark:text-white"
                  }`}>
                  <div className="flex flex-col">
                    <h3 className="font-black uppercase italic text-sm">
                      {type.title}
                    </h3>
                    <p
                      className={`text-[10px] font-bold uppercase opacity-60 ${drivingType === type._id ? "text-white" : "text-gray-500"}`}>
                      {type.subTitle}
                    </p>
                  </div>
                  <CheckCircle
                    size={16}
                    className={
                      drivingType === type._id
                        ? "text-white"
                        : "text-orange-600 opacity-20"
                    }
                  />
                </div>
              ))}
            </div>
            <Link
              href={getProductUrl()}
              className="w-full">
              <Button
                disabled={!drivingType}
                className="w-full h-16 bg-gradient-to-r from-orange-600 to-rose-700 text-white text-lg font-black uppercase italic tracking-widest rounded-[20px] shadow-2xl active:scale-95 transition-all">
                Launch Catalog{" "}
                <ArrowRight
                  size={20}
                  className="ml-2"
                />
              </Button>
            </Link>
          </CardFooter>
        )}

        {step === 3 && (
          <CardFooter className="flex flex-col items-center justify-center p-0">
            <TireWheelGuide type={productType as string} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

const TireWheelGuide = ({ type }: { type: string }) => {
  const isTire = type === "tires" || type === "tire";
  const productType = isTire ? "tire" : "wheel";

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 max-w-2xl w-full text-center shadow-2xl">
      <div className="bg-orange-600 size-16 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-lg shadow-orange-600/20 italic">
        {isTire ? "T" : "W"}
      </div>
      <h2 className="text-2xl sm:text-3xl font-black uppercase italic dark:text-white mb-4">
        {productType} Performance Guide
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8 italic uppercase font-bold tracking-tight">
        TiresDash {productType} analyzer uses track data and weather metrics to
        optimize your drive.
      </p>
      <Link href={`/${productType}`}>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 text-sm sm:text-base font-black uppercase italic tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-95">
          ENGAGE {productType.toUpperCase()} CATALOG
        </button>
      </Link>
    </div>
  );
};
