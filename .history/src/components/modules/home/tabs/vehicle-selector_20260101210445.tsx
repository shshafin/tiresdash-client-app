"use client";

import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

const VehicleSelector = ({ setMainStep, vehicle, setVehicle }: any) => {
  const [step, setStep] = useState(1);
  const [vehicleSaved, setVehicleSaved] = useState(false);

  // Data Fetching
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

  const canAccessStep = (index: number) => {
    if (index === 1) return true;
    const prevKey = steps[index - 2].key;
    return !!vehicle[prevKey];
  };

  const handleSelect = (key: string, value: string) => {
    let updatedVehicle = { ...vehicle, [key]: value };

    // Reset subsequent logic
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
      saveVehicle(updatedVehicle);
      setVehicleSaved(true);
    } else {
      setStep(step + 1); // 🏎️ Auto-advance to next step
    }
  };

  const saveVehicle = (data: any) => {
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
        toast.success("CHASSIS DATA SECURED!");
      }
    }
  };

  const currentOptions = () => {
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
    <div className="w-full transition-all duration-500">
      {!vehicleSaved ? (
        <div className="space-y-8">
          {/* 🏁 Progress Track */}
          <div className="flex justify-between items-center max-w-2xl mx-auto px-4 overflow-x-auto no-scrollbar gap-4">
            {steps.map((s, i) => {
              const active = step === i + 1;
              const done = canAccessStep(i + 2) && vehicle[s.key];
              return (
                <div
                  key={i}
                  onClick={() => canAccessStep(i + 1) && setStep(i + 1)}
                  className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${active ? "bg-orange-600 border-orange-600 shadow-lg shadow-orange-600/40" : done ? "border-emerald-500 text-emerald-500 bg-emerald-500/5" : "border-gray-200 dark:border-gray-800 text-gray-400 opacity-50"}`}>
                    <s.icon
                      size={18}
                      className={active ? "text-white animate-pulse" : ""}
                    />
                  </div>
                  <span
                    className={`text-[8px] font-black uppercase tracking-tighter ${active ? "text-orange-600" : "text-gray-400"}`}>
                    {s.key}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 🛠️ Dynamic Grid Selector */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
                Select {steps[step - 1].label}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Step {step} of 5
                </p>
                <div className="h-1 w-8 bg-orange-600 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {currentOptions()?.length > 0 ? (
                currentOptions().map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(steps[step - 1].key, opt)}
                    className={`p-4 rounded-2xl border-2 font-black uppercase italic text-xs transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                      vehicle[steps[step - 1].key] === opt
                        ? "border-orange-600 bg-orange-600 text-white shadow-xl"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-orange-400 shadow-sm"
                    }`}>
                    {opt}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase italic tracking-widest animate-pulse">
                  Engaging Sensors... Waiting for Data
                </div>
              )}
              {step === 5 && (
                <button
                  onClick={() => handleSelect("tireSize", "Not Found")}
                  className="col-span-full mt-4 text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase tracking-widest transition-colors italic underline underline-offset-4">
                  Configuration Not Listed? Manual Entry
                </button>
              )}
            </div>
          </div>

          {/* 🏎️ Navigation */}
          {step > 1 && (
            <div className="flex justify-center pt-8">
              <Button
                variant="light"
                onPress={() => setStep(step - 1)}
                className="font-black uppercase italic text-[10px] tracking-widest text-gray-400 hover:text-orange-600">
                <ArrowLeft
                  size={14}
                  className="mr-2"
                />{" "}
                Previous Stage
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* ✅ Success View (Refined & Sporty) */
        <Card className="bg-transparent shadow-none border-none animate-in zoom-in-95 duration-500">
          <CardBody className="flex flex-col items-center p-0">
            <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
              <CheckCircle
                size={40}
                className="text-white"
              />
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter dark:text-white mb-2 text-center">
              Engineered Match!
            </h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-10">
              Vehicle Profile successfully encrypted
            </p>

            <div className="w-full max-w-md bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Car
                  size={80}
                  className="rotate-12"
                />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    Active Chassis
                  </span>
                  <span className="text-2xl font-black dark:text-white italic uppercase">
                    {vehicle.year} {vehicle.make}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      Model
                    </span>
                    <span className="font-black dark:text-white uppercase italic">
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      Trim
                    </span>
                    <span className="font-black dark:text-white uppercase italic">
                      {vehicle.trim || "BASE"}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col">
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                    Recommended Spec
                  </span>
                  <span className="text-xl font-black dark:text-white italic uppercase">
                    {vehicle.tireSize}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-12">
            <Button
              variant="bordered"
              onPress={() => {
                setVehicleSaved(false);
                setStep(1);
              }}
              className="h-14 px-8 rounded-2xl font-black uppercase italic text-xs border-2 dark:text-white">
              Reset Profile
            </Button>
            <Button
              onPress={() => setMainStep(3)}
              className="h-14 px-10 bg-orange-600 text-white rounded-2xl font-black uppercase italic text-xs shadow-xl shadow-orange-600/20 active:scale-95">
              Launch Catalog{" "}
              <ArrowRight
                size={18}
                className="ml-2"
              />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default VehicleSelector;
