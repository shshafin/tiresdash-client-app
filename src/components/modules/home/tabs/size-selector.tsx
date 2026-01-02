"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  HelpCircle,
  Loader2,
  CheckCircle,
  Zap,
  Ruler,
  Activity,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useGetTireWidths } from "@/src/hooks/tireWidth.hook";
import { useGetTireRatios } from "@/src/hooks/tireRatio.hook";
import { useGetTireDiameters } from "@/src/hooks/tireDiameter.hook";
import { useGetWheelWidths } from "@/src/hooks/wheelWidth.hook";
import { useGetWheelRatios } from "@/src/hooks/wheelRatio.hook";
import { useGetWheelDiameters } from "@/src/hooks/wheelDiameter.hook";
import Link from "next/link";
import { toast } from "sonner";

const SizeSelector = ({ setMainStep, selectedSize, setSelectedSize }: any) => {
  const [activeStep, setActiveStep] = useState(1);
  const [productType, setProductType] = useState<"tire" | "wheel">("tire");
  const [showAllWidths, setShowAllWidths] = useState(false);

  // 🛰️ Tire Hooks
  const { data: tW, isLoading: tWL } = useGetTireWidths({});
  const { data: tR, isLoading: tRL } = useGetTireRatios({});
  const { data: tD, isLoading: tDL } = useGetTireDiameters({});

  // 🛰️ Wheel Hooks
  const { data: wW, isLoading: wWL } = useGetWheelWidths({});
  const { data: wR, isLoading: wRL } = useGetWheelRatios({});
  const { data: wD, isLoading: wDL } = useGetWheelDiameters({});

  const widthOptions = productType === "tire" ? tW?.data || [] : wW?.data || [];
  const ratioOptions = productType === "tire" ? tR?.data || [] : wR?.data || [];
  const diameterOptions =
    productType === "tire" ? tD?.data || [] : wD?.data || [];

  const isLoading =
    tWL ||
    wWL ||
    (activeStep === 2 && (tRL || wRL)) ||
    (activeStep === 3 && (tDL || wDL));

  // Auto-Step & Selection Handlers
  const handleWidthSelect = (width: any) => {
    setSelectedSize({
      ...selectedSize,
      width,
      ratio: null,
      diameter: null,
      productType,
    });
    setActiveStep(2); // 🏎️ Auto-advance
  };

  const handleRatioSelect = (ratio: any) => {
    setSelectedSize({ ...selectedSize, ratio, diameter: null, productType });
    setActiveStep(3); // 🏎️ Auto-advance
  };

  const handleDiameterSelect = (diameter: any) => {
    setSelectedSize({ ...selectedSize, diameter, productType });
    // Final step, stays here to show "View Products" button
  };

  const canAccessStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return !!selectedSize?.width;
    if (step === 3) return !!selectedSize?.width && !!selectedSize?.ratio;
    return false;
  };

  const handleStepNavigation = (step: number) => {
    if (canAccessStep(step)) setActiveStep(step);
    else
      toast.error(`Stage 0${step - 1} incomplete!`, {
        className: "font-black italic uppercase text-[10px]",
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 🏎️ Sporty Toggle: Tire vs Wheel */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border dark:border-gray-800">
          {["tire", "wheel"].map((type) => (
            <button
              key={type}
              onClick={() => setProductType(type as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${
                productType === type
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "text-gray-400 hover:text-orange-500"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 🏁 Gear Progress Tracker */}
      <div className="flex items-center justify-center gap-4 py-4">
        {[
          { id: 1, lab: "Width" },
          { id: 2, lab: "Ratio" },
          { id: 3, lab: "Rim" },
        ].map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2">
            <button
              onClick={() => handleStepNavigation(s.id)}
              className={`size-10 rounded-xl flex items-center justify-center text-xs font-black italic border-2 transition-all ${
                activeStep === s.id
                  ? "bg-orange-600 border-orange-600 text-white shadow-lg scale-110"
                  : canAccessStep(s.id)
                    ? "border-emerald-500 text-emerald-500 bg-emerald-500/5"
                    : "border-gray-200 dark:border-gray-800 text-gray-400 opacity-40"
              }`}>
              0{s.id}
            </button>
            <span
              className={`text-[10px] font-black uppercase italic tracking-tighter hidden sm:block ${activeStep === s.id ? "text-orange-600" : "text-gray-400"}`}>
              {s.lab}
            </span>
            {s.id < 3 && (
              <div className="w-6 h-px bg-gray-200 dark:bg-gray-800" />
            )}
          </div>
        ))}
      </div>

      {/* 🛠️ Modern Grid Selector Area */}
      <div className="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-[40px] p-6 sm:p-10 text-center min-h-[400px]">
        {/* Dynamic Header */}
        <div className="mb-10">
          <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
            Identify{" "}
            {activeStep === 1
              ? "Width"
              : activeStep === 2
                ? "Aspect Ratio"
                : "Diameter"}
          </h3>
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] mt-2 italic">
            Configuring {productType.toUpperCase()} Spec
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2
              className="animate-spin text-orange-600"
              size={40}
            />
            <span className="text-[10px] font-black uppercase italic text-gray-400 tracking-widest">
              Scanning Signal...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 animate-in zoom-in-95 duration-300">
            {(activeStep === 1
              ? showAllWidths
                ? widthOptions
                : widthOptions.slice(0, 18)
              : activeStep === 2
                ? ratioOptions
                : diameterOptions
            ).map((opt: any) => {
              const val =
                activeStep === 1
                  ? opt.width
                  : activeStep === 2
                    ? opt.ratio
                    : opt.diameter;
              const isSelected =
                selectedSize?.[
                  activeStep === 1
                    ? "width"
                    : activeStep === 2
                      ? "ratio"
                      : "diameter"
                ]?._id === opt._id;

              return (
                <button
                  key={opt._id}
                  onClick={() =>
                    activeStep === 1
                      ? handleWidthSelect(opt)
                      : activeStep === 2
                        ? handleRatioSelect(opt)
                        : handleDiameterSelect(opt)
                  }
                  className={`h-14 rounded-2xl border-2 font-black uppercase italic text-xs transition-all duration-300 hover:scale-[1.05] active:scale-90 ${
                    isSelected
                      ? "border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-600/30"
                      : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500/50 shadow-sm"
                  }`}>
                  {val}
                  {activeStep === 3 ||
                  (activeStep === 1 && productType === "wheel")
                    ? '"'
                    : ""}
                </button>
              );
            })}
          </div>
        )}

        {/* View All Widths Option */}
        {activeStep === 1 && widthOptions.length > 18 && !showAllWidths && (
          <button
            onClick={() => setShowAllWidths(true)}
            className="mt-8 text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase italic tracking-widest transition-colors underline underline-offset-4">
            + Expand Full Catalog
          </button>
        )}

        {/* 🚀 Final Action Button */}
        {selectedSize?.width &&
          selectedSize?.ratio &&
          selectedSize?.diameter && (
            <div className="mt-12 animate-in slide-in-from-bottom-6 duration-500">
              <Button
                onPress={() => setMainStep(3)}
                className="h-16 px-12 bg-gradient-to-r from-orange-600 to-rose-700 text-white text-sm font-black uppercase italic tracking-[0.2em] rounded-2xl shadow-2xl shadow-orange-600/30 active:scale-95 transition-all">
                Explore {productType} Catalog <ArrowRight className="ml-2" />
              </Button>
            </div>
          )}
      </div>

      {/* 🏁 Footer Guidelines */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 opacity-60">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase italic tracking-widest dark:text-gray-400 text-gray-500">
          <Activity
            size={14}
            className="text-orange-600"
          />
          Precise Measurement Required for Safety
        </div>
        <Link
          href="/contact"
          className="flex items-center gap-2 text-[9px] font-black uppercase italic tracking-widest text-orange-600 hover:underline">
          <HelpCircle size={14} /> Need Technical Assistance?
        </Link>
      </div>
    </div>
  );
};

export default SizeSelector;
