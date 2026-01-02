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

  // 🛰️ Data Fetching Hook Inputs
  const { data: years, isLoading: yL } = useGetYears({});
  const { data: makes, isLoading: mL } = useGetMakes({ year: vehicle.year });
  const { data: models, isLoading: modL } = useGetModels({
    make: vehicle.make,
  });
  const { data: trims, isLoading: tL } = useGetTrims({ model: vehicle.model });
  const { data: tyreSizes, isLoading: sL } = useGetTyreSizes({
    trim: vehicle.trim,
  });

  const steps = [
    { label: "Production Year", key: "year", icon: Settings },
    { label: "Chassis Make", key: "make", icon: ShieldCheck },
    { label: "Vehicle Model", key: "model", icon: Car },
    { label: "Performance Trim", key: "trim", icon: Gauge },
    { label: "Tire Configuration", key: "tireSize", icon: Zap },
  ];

  // 🛡️ Logic to prevent skipping steps
  const canAccessStep = (index: number) => {
    if (index === 1) return true;
    const prevKey = steps[index - 2].key;
    return !!vehicle[prevKey];
  };

  // 🏎️ Automated Gear Shift (Selection Logic)
  const handleSelect = (key: string, value: string) => {
    let updatedVehicle = { ...vehicle, [key]: value };

    // Reset subsequent logic for data integrity
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
      saveToStorage(updatedVehicle);
      setVehicleSaved(true);
    } else {
      // 🚀 Auto-advance Gear
      setStep((prev) => prev + 1);
    }
  };

  const saveToStorage = (data: any) => {
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

  // 📊 Dynamic Options Filter
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

  return (
    <div className="w-full">
      {!vehicleSaved ? (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* 🏁 Racing Progress Tracker */}
          <div className="flex justify-between items-center max-w-2xl mx-auto px-4 overflow-x-auto no-scrollbar gap-4 py-2">
            {steps.map((s, i) => {
              const isActive = step === i + 1;
              const isDone = vehicle[s.key] && step > i + 1;
              return (
                <div
                  key={i}
                  onClick={() => canAccessStep(i + 1) && setStep(i + 1)}
                  className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px]">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${isActive ? "bg-orange-600 border-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110" : isDone ? "border-emerald-500 text-emerald-500 bg-emerald-500/10" : "border-gray-200 dark:border-gray-800 text-gray-400 opacity-40"}`}>
                    {isDone ? (
                      <CheckCircle size={20} />
                    ) : (
                      <s.icon
                        size={20}
                        className={isActive ? "text-white animate-pulse" : ""}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase italic tracking-tighter ${isActive ? "text-orange-600" : "text-gray-500"}`}>
                    {s.key}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 🛠️ Modern Grid Selector */}
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
                Select {steps[step - 1].label}
              </h2>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] mt-3">
                Stage {step} of 5 • Identification
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {yL || mL || modL || tL || sL ? (
                Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse border border-transparent"
                    />
                  ))
              ) : getOptions()?.length > 0 ? (
                getOptions().map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(steps[step - 1].key, opt)}
                    className={`h-16 rounded-2xl border-2 font-black uppercase italic text-xs tracking-wider transition-all duration-300 hover:scale-[1.05] active:scale-90 ${
                      vehicle[steps[step - 1].key] === opt
                        ? "border-orange-600 bg-orange-600 text-white shadow-xl"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-orange-500/50 shadow-sm"
                    }`}>
                    {opt}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-12 text-gray-400 font-black uppercase italic tracking-[0.2em] opacity-50">
                  Data Stream Empty • Check Connection
                </div>
              )}
            </div>

            {step === 5 && (
              <button
                onClick={() => handleSelect("tireSize", "Not Found")}
                className="mt-8 text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase tracking-[0.2em] transition-colors italic underline underline-offset-8">
                Specs Not Listed? Request Manual Fitment
              </button>
            )}
          </div>

          {/* 🏎️ Navigation Backstage */}
          {step > 1 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-[10px] font-black uppercase italic text-gray-400 hover:text-orange-600 transition-colors">
                <ArrowLeft size={14} /> Back to Previous Stage
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ✅ FINAL CONFIGURATION LOCKED (Launch Catalog Fix) */
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center">
            <div className="size-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 transform -rotate-3">
              <CheckCircle
                size={48}
                className="text-white"
              />
            </div>

            <h3 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter dark:text-white mb-2 text-center">
              Config Locked
            </h3>
            <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.4em] mb-12 italic">
              Performance Profile Ready
            </p>

            <div className="w-full bg-white dark:bg-[#111318] border-2 border-gray-100 dark:border-gray-800 rounded-[40px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              {/* Racing Decal Background */}
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.07]">
                <Layers size={250} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                    Target Chassis
                  </span>
                  <span className="text-3xl sm:text-4xl font-black dark:text-white italic uppercase leading-none">
                    {vehicle.year} {vehicle.make}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      Model Series
                    </span>
                    <span className="text-lg font-black dark:text-white uppercase italic">
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      Engine/Trim
                    </span>
                    <span className="text-lg font-black dark:text-white uppercase italic">
                      {vehicle.trim || "STANDARD"}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between bg-orange-600/5 p-4 rounded-2xl border border-orange-600/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                        Recommended Gear
                      </span>
                      <span className="text-xl font-black dark:text-white italic uppercase">
                        {vehicle.tireSize}
                      </span>
                    </div>
                    <Zap
                      className="text-orange-600"
                      size={24}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full">
              <button
                onClick={() => {
                  setVehicleSaved(false);
                  setStep(1);
                }}
                className="flex-1 h-16 rounded-2xl font-black uppercase italic text-xs border-2 border-gray-200 dark:border-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Reset Configuration
              </button>

              {/* ✅ THIS IS THE FIX: Using onClick for setMainStep(3) directly */}
              <button
                onClick={() => setMainStep(3)}
                className="flex-[2] h-16 bg-gradient-to-r from-orange-600 via-rose-600 to-orange-700 text-white rounded-2xl font-black uppercase italic text-sm tracking-[0.2em] shadow-xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                Launch Catalog <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
