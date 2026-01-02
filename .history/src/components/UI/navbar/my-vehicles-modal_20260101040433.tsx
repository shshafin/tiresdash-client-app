"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import {
  Car,
  AlertCircle,
  Trash2,
  ShieldCheck,
  X,
  Settings2,
} from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";
import Image from "next/image";

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  trim: string;
  tireSize: string;
}

export function VehicleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadVehicles();
    }
  }, [isOpen]);

  const loadVehicles = () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        const savedVehicles = localStorage.getItem("userVehicles");
        if (savedVehicles) {
          const list = JSON.parse(savedVehicles);
          setVehicles(Array.isArray(list) ? list : [list]);
        } else {
          setVehicles([]);
        }
      }
    } catch (err) {
      setError("Failed to access your high-performance garage.");
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = (index: number) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles.splice(index, 1);
    localStorage.setItem("userVehicles", JSON.stringify(updatedVehicles));
    setVehicles(updatedVehicles);
    window.dispatchEvent(new Event("vehiclesUpdated"));
    toast.success(`Vehicle removed from your fleet`);
    setRemovingIndex(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-[#0b0d11] border border-gray-100 dark:border-gray-800 rounded-[2.5rem]",
        header: "border-b border-gray-50 dark:border-white/5 pb-4",
      }}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-600 rounded-xl shadow-[0_10px_20px_rgba(249,115,22,0.3)]">
              <Settings2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">
                Fleet Management
              </h2>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mt-1">
                Ready for the Track
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12 gap-4">
              <Spinner
                color="warning"
                size="lg"
              />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loading Fleet Data...
              </p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800 relative overflow-hidden">
              {/* Background Watermark Car */}
              <Car className="absolute -bottom-4 -right-4 h-32 w-32 text-gray-100 dark:text-gray-900 -rotate-12" />
              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic mb-2">
                  No Active Vehicle
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Setup your first ride to begin
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-50 dark:bg-[#15181c] rounded-[2rem] border border-transparent hover:border-orange-500/50 transition-all duration-500 overflow-hidden">
                  {/* ✅ Real Car Vector Background Effect */}
                  <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-10 transition-opacity pointer-events-none translate-x-4">
                    <img
                      src="https://creazilla-store.freetls.fastly.net/cliparts/70656/sports-car-clipart-xl.png"
                      alt="car-silhouette"
                      className="h-full w-full object-contain grayscale"
                    />
                  </div>

                  <div className="flex justify-between items-center p-6 relative z-10">
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-20 relative bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                        {/* Small Car Image Thumbnail */}
                        <img
                          src="https://img.freepik.com/free-vector/modern-coupe-car-isolated-white-background_1284-38374.jpg?t=st=1714561000~exp=1714564600~hmac=sporty"
                          alt="car"
                          className="object-contain w-full h-full scale-125 translate-x-1"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic leading-none mb-1">
                          {vehicle.year} {vehicle.make}
                        </h3>
                        <p className="text-xs font-black text-orange-600 uppercase italic tracking-widest">
                          {vehicle.model}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase bg-white dark:bg-black/40 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                            <ShieldCheck
                              size={10}
                              className="text-orange-500"
                            />{" "}
                            {vehicle.trim || "BASE"}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase bg-white dark:bg-black/40 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800">
                            SPEC: {vehicle.tireSize || "OEM"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {removingIndex === index ? (
                        <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                          <Button
                            isIconOnly
                            radius="full"
                            size="sm"
                            variant="flat"
                            onPress={() => setRemovingIndex(null)}
                            className="dark:bg-gray-800">
                            <X size={14} />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            className="font-black uppercase italic text-[10px] h-8"
                            onPress={() => confirmRemove(index)}>
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Button
                          isIconOnly
                          className="bg-white dark:bg-gray-800 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                          radius="full"
                          onPress={() => setRemovingIndex(index)}>
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Decorative Racing Stripe */}
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700" />
                </div>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter className="p-8">
          <Button
            className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase italic tracking-[0.2em] hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl shadow-orange-500/10"
            onPress={onClose}>
            Close Dashboard
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
