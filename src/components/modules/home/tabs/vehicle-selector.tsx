"use client";

import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {
  CheckCircle,
  Car,
  ArrowLeft,
  ArrowRight,
  Zap,
  Gauge,
  Settings,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

const VehicleSelector = ({ setMainStep, vehicle, setVehicle }: any) => {
  const [step, setStep] = useState(1);
  const [vehicleSaved, setVehicleSaved] = useState(false);

  // 🛰️ Data Fetching
  const { data: years, isLoading: yL } = useGetYears({});
  const { data: makes, isLoading: mL } = useGetMakes({ year: vehicle.year });
  const { data: models, isLoading: modL } = useGetModels({
    make: vehicle.make,
  });
  const { data: trims, isLoading: tL } = useGetTrims({ model: vehicle.model });
  const { data: tyreSizes, isLoading: sL } = useGetTyreSizes({
    trim: vehicle.trim,
  });

  const stepsConfig = [
    { label: "Year", key: "year", icon: Settings },
    { label: "Make", key: "make", icon: ShieldCheck },
    { label: "Model", key: "model", icon: Car },
    { label: "Trim", key: "trim", icon: Gauge },
    { label: "Size", key: "tireSize", icon: Zap },
  ];

  const canAccessStep = (targetStep: number) => {
    if (targetStep === 1) return true;
    const prevStepIndex = targetStep - 2;
    const prevKey = stepsConfig[prevStepIndex].key;
    return !!vehicle[prevKey];
  };

  const handleStepClick = (targetStep: number) => {
    if (canAccessStep(targetStep)) {
      setStep(targetStep);
    } else {
      toast.error(`Stage ${targetStep - 1} Incomplete!`, {
        icon: (
          <Zap
            size={14}
            className="text-orange-500"
          />
        ),
        className: "font-black uppercase italic text-[10px]",
      });
    }
  };

  const handleSelection = (key: string, value: string) => {
    let updatedVehicle = { ...vehicle, [key]: value };

    if (key === "year")
      updatedVehicle = {
        ...updatedVehicle,
        make: "",
        model: "",
        trim: "",
        tireSize: "",
      };
    else if (key === "make")
      updatedVehicle = { ...updatedVehicle, model: "", trim: "", tireSize: "" };
    else if (key === "model")
      updatedVehicle = { ...updatedVehicle, trim: "", tireSize: "" };
    else if (key === "trim")
      updatedVehicle = { ...updatedVehicle, tireSize: "" };

    setVehicle(updatedVehicle);

    if (key === "tireSize") {
      saveToLocal(updatedVehicle);
      setVehicleSaved(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const saveToLocal = (data: any) => {
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("userVehicles") || "[]");
      const exists = existing.some(
        (v: any) => v.tireSize === data.tireSize && v.model === data.model
      );
      if (!exists) {
        localStorage.setItem(
          "userVehicles",
          JSON.stringify([...existing, data])
        );
        window.dispatchEvent(new Event("vehiclesUpdated"));
        toast.success("VEHICLE SPECS LOCKED IN!");
      }
    }
  };

  const getOptions = () => {
    if (step === 1) return years?.data?.map((d: any) => d.year);
    if (step === 2) return makes?.data?.map((d: any) => d.make);
    if (step === 3)
      return models?.data
        ?.filter(
          (m: any) =>
            m.year?.year === Number(vehicle.year) &&
            m.make?.make === vehicle.make
        )
        .map((d: any) => d.model);
    if (step === 4)
      return trims?.data
        ?.filter((t: any) => t.model?.model === vehicle.model)
        .map((d: any) => d.trim);
    if (step === 5)
      return tyreSizes?.data
        ?.filter((s: any) => s.trim?.trim === vehicle.trim)
        .map((d: any) => d.tireSize);
    return [];
  };

  const resetSelection = () => {
    setVehicle({ year: "", make: "", model: "", trim: "", tireSize: "" });
    setVehicleSaved(false);
    setStep(1);
  };

  return (
    <div className="w-full">
      {!vehicleSaved ? (
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
          {/* 🏁 Responsive Progress Tracker (No Scrollbar Fix) */}
          <div className="flex justify-center items-center w-full max-w-2xl mx-auto px-4 gap-2 sm:gap-6 py-2">
            {stepsConfig.map((s, i) => {
              const active = step === i + 1;
              const done = !!vehicle[s.key] && step > i + 1;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(i + 1)}
                    className={`size-9 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                      active
                        ? "bg-orange-600 border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110"
                        : done
                          ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                          : "border-gray-200 dark:border-gray-800 text-gray-400 opacity-40 hover:opacity-100"
                    }`}>
                    {done ? (
                      <CheckCircle
                        size={16}
                        className="sm:w-5 sm:h-5"
                      />
                    ) : (
                      <s.icon
                        size={16}
                        className={`sm:w-5 sm:h-5 ${active ? "text-white animate-pulse" : ""}`}
                      />
                    )}
                  </button>
                  <span
                    className={`mt-2 text-[7px] sm:text-[9px] font-black uppercase italic tracking-tighter sm:tracking-widest ${active ? "text-orange-600" : "text-gray-500"} transition-colors`}>
                    {/* মোবাইলে টেক্সট ছোট, বড় স্ক্রিনে বড় */}
                    {s.key}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 🛠️ Sporty Grid Selector Area */}
          <div className="max-w-5xl mx-auto text-center px-2">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
                {stepsConfig[step - 1].label}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="h-[1px] w-6 sm:w-10 bg-orange-600/30" />
                <p className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] italic">
                  Stage 0{step}
                </p>
                <div className="h-[1px] w-6 sm:w-10 bg-orange-600/30" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {yL || mL || modL || tL || sL ? (
                Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-gray-100 dark:bg-white/5 rounded-xl sm:rounded-2xl animate-pulse"
                    />
                  ))
              ) : getOptions()?.length > 0 ? (
                getOptions().map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleSelection(stepsConfig[step - 1].key, opt)
                    }
                    className={`h-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 font-black uppercase italic text-[10px] sm:text-xs tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                      vehicle[stepsConfig[step - 1].key] === opt
                        ? "border-orange-600 bg-orange-600 text-white shadow-lg"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-orange-500/50"
                    }`}>
                    {opt}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-10 text-gray-400 font-black uppercase italic text-xs tracking-widest opacity-50">
                  SCANNING CHASSIS DATA...
                </div>
              )}
            </div>
          </div>

          {/* 🏎️ Bottom Navigation */}
          {step > 1 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-[9px] font-black uppercase italic text-gray-400 hover:text-orange-600 transition-colors">
                <ArrowLeft size={12} /> Re-Calibrate
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ✅ SUCCESS View (Already Responsive) */
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500 px-4">
          <div className="flex flex-col items-center">
            <div className="size-16 sm:size-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
              <CheckCircle
                size={32}
                className="text-white"
              />
            </div>

            <h3 className="text-2xl sm:text-5xl font-black uppercase italic tracking-tighter dark:text-white mb-2 text-center leading-none">
              Config Secured
            </h3>
            <p className="text-orange-600 font-black uppercase text-[9px] tracking-[0.3em] mb-8 italic">
              Ready for takeoff
            </p>

            <div className="w-full bg-white dark:bg-[#111318] border-2 border-gray-100 dark:border-gray-800 rounded-[32px] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Target Chassis
                  </span>
                  <span className="text-xl sm:text-3xl font-black dark:text-white italic uppercase">
                    {vehicle.year} {vehicle.make}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col font-black italic uppercase">
                    <span className="text-[8px] text-gray-400 tracking-widest">
                      Series
                    </span>
                    <span className="text-sm sm:text-lg dark:text-white">
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex flex-col font-black italic uppercase">
                    <span className="text-[8px] text-gray-400 tracking-widest">
                      Trim
                    </span>
                    <span className="text-sm sm:text-lg dark:text-white">
                      {vehicle.trim || "BASE"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between bg-orange-600/5 p-4 rounded-xl border border-orange-600/20">
                    <div className="flex flex-col font-black italic uppercase">
                      <span className="text-[8px] text-orange-600 tracking-widest">
                        Recommended
                      </span>
                      <span className="text-base sm:text-xl dark:text-white">
                        {vehicle.tireSize}
                      </span>
                    </div>
                    <Zap
                      className="text-orange-600"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
              <Button
                variant="bordered"
                onPress={resetSelection}
                className="flex-1 h-14 py-2 rounded-xl font-black uppercase italic text-[10px] border-2 dark:text-white">
                Reset
              </Button>
              <Button
                onPress={() => setMainStep(3)}
                className="flex-[2] h-14 py-2 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white rounded-xl font-black uppercase italic text-xs tracking-[0.15em] shadow-xl">
                Launch Catalog{" "}
                <ArrowRight
                  size={18}
                  className="ml-2"
                />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
