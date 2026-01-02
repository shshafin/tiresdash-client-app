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
  Activity,
  Package,
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
    <div className="w-full transition-all duration-500">
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

/* --- 🏎️ TABS COMPONENT (Sporty Redesign) --- */
const Tabs = ({
  setMainStep,
  vehicle,
  setVehicle,
  selectedSize,
  setSelectedSize,
  selectedBrand,
  setSelectedBrand,
  setShoppingMethod,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState("vehicle");

  const tabs = [
    {
      id: "vehicle",
      label: "Shop by Vehicle",
      icon: Car,
      desc: "Precision match for your specific car model",
    },
    {
      id: "size",
      label: "Shop by Size",
      icon: Ruler,
      desc: "Enter dimensions for ultimate performance",
    },
    {
      id: "brand",
      label: "Shop by Brand",
      icon: Building2,
      desc: "Explore elite engineering from top brands",
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
    <div className="w-full bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-t-[40px] overflow-hidden shadow-2xl border-t border-x border-orange-500/20">
      {/* 🏁 Tab Header */}
      <div className="flex flex-col sm:flex-row border-b border-gray-100 dark:border-gray-800 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-xs sm:text-sm font-black uppercase italic tracking-widest transition-all duration-300 relative ${
                isActive
                  ? "text-orange-600 bg-orange-50/50 dark:bg-orange-600/10"
                  : "text-gray-400 hover:text-orange-400"
              }`}>
              <Icon
                size={18}
                className={isActive ? "animate-pulse" : ""}
              />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-rose-600 shadow-[0_-4px_12px_rgba(234,88,12,0.5)]" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setMainStep(1)}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:rotate-90 transition-transform">
          <X size={20} />
        </button>
      </div>

      {/* ⚡ Dynamic Description */}
      <div className="bg-orange-600 py-2 px-4">
        <p className="text-[10px] sm:text-xs font-black uppercase italic text-white text-center tracking-[0.2em]">
          {tabs.find((t) => t.id === activeTab)?.desc}
        </p>
      </div>

      {/* 🛠️ Content Area */}
      <div className="p-4 sm:p-8 min-h-[450px]">
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

/* --- 🏎️ SHOPPING FOR STEP (Aggressive Fire-Orange Theme) --- */
const ShoppingForStep = ({
  pType,
  vehicle,
  selectedSize,
  selectedBrand,
  shoppingMethod,
}: ShoppingForStepProps) => {
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
    <div className="w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-3xl rounded-t-[40px] shadow-2xl border-t border-x border-orange-500/30 p-6 sm:p-10">
      <Card className="shadow-none bg-transparent">
        <CardBody className="p-0 overflow-visible">
          {/* ✅ Success Badge Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-4 rounded-full mb-4 shadow-lg shadow-orange-500/20">
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
            <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter">
              {shoppingMethod.toUpperCase()} SECURED!
            </h3>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Ready to ignite your performance journey
            </p>
          </div>

          {/* ✅ Selected Specs Card (Sporty Look) */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-[32px] p-6 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Zap
                size={18}
                className="text-orange-600"
              />
              <h4 className="font-black uppercase italic text-sm tracking-widest">
                Active Configuration
              </h4>
            </div>

            {shoppingMethod === "vehicle" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 italic uppercase">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Make/Model</span>
                  <span className="font-black text-sm">
                    {vehicle.make} {vehicle.model}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Year</span>
                  <span className="font-black text-sm">{vehicle.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Trim</span>
                  <span className="font-black text-sm">
                    {vehicle.trim || "BASE"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Tire Size</span>
                  <span className="font-black text-sm text-orange-600">
                    {vehicle.tireSize}
                  </span>
                </div>
              </div>
            ) : shoppingMethod === "size" ? (
              <div className="grid grid-cols-3 gap-4 italic uppercase">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Width</span>
                  <span className="font-black text-sm">
                    {selectedSize?.width?.width || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Ratio</span>
                  <span className="font-black text-sm">
                    {selectedSize?.ratio?.ratio || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Diameter</span>
                  <span className="font-black text-sm text-orange-600">
                    {selectedSize?.diameter?.diameter}"
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col italic uppercase">
                <span className="text-[10px] text-gray-400">
                  Selected Brand
                </span>
                <span className="font-black text-2xl text-orange-600">
                  {selectedBrand?.brand?.name}
                </span>
              </div>
            )}
          </div>
        </CardBody>

        {/* ✅ Choice Step (Tire or Wheel) */}
        {step === 1 && shoppingMethod === "vehicle" && (
          <CardFooter className="flex flex-col p-0">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8">
              Choose Your Upgrade
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
                  <div className="relative w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mt-4 group-hover:text-orange-600 transition-colors">
                    {cat.name}S
                  </h3>
                  <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-orange-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardFooter>
        )}

        {/* ✅ Final Step (Driving Type Selection) */}
        {step === 2 && (
          <CardFooter className="flex flex-col p-0 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center mb-8">
              Select Driving Environment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
              {dt?.data?.map((type: any) => (
                <div
                  key={type._id}
                  onClick={() => setDrivingType(type._id)}
                  className={`group p-6 rounded-[24px] border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    drivingType === type._id
                      ? "border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-600/30"
                      : "border-gray-100 dark:border-gray-800 hover:border-orange-400"
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
                  <div
                    className={`p-2 rounded-full ${drivingType === type._id ? "bg-white/20" : "bg-orange-600/10 group-hover:bg-orange-600/20"}`}>
                    <CheckCircle
                      size={16}
                      className={
                        drivingType === type._id
                          ? "text-white"
                          : "text-orange-600"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={getProductUrl()}
              className="w-full">
              <Button
                disabled={!drivingType}
                className="w-full h-20 bg-gradient-to-r from-orange-600 to-rose-700 text-white text-xl font-black uppercase italic tracking-[0.2em] rounded-[24px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                Launch Catalog <ArrowRight className="ml-2 animate-bounce-x" />
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
