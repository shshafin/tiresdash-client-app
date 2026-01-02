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
import { Card, CardBody } from "@heroui/card";
import { Car, AlertCircle, Trash2, Zap, ShieldCheck, X } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";
import { clsx } from "clsx";

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
          const parsedVehicles = JSON.parse(savedVehicles);
          setVehicles(
            Array.isArray(parsedVehicles) ? parsedVehicles : [parsedVehicles]
          );
        } else {
          setVehicles([]);
        }
      }
    } catch (err) {
      setError("Could not load your garage.");
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = (index: number) => {
    try {
      const updatedVehicles = [...vehicles];
      updatedVehicles.splice(index, 1);
      localStorage.setItem("userVehicles", JSON.stringify(updatedVehicles));
      setVehicles(updatedVehicles);
      window.dispatchEvent(new Event("vehiclesUpdated"));
      toast.success(`Vehicle removed from garage`);
      setRemovingIndex(null);
    } catch (err) {
      toast.error("Failed to remove vehicle.");
    }
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
        footer: "border-t border-gray-50 dark:border-white/5",
      }}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white">
                My Garage
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Manage Your Fleet
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
              <p className="text-xs font-black uppercase italic text-orange-500 animate-pulse">
                Syncing Garage...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
              <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
              <p className="text-sm font-bold text-red-600 uppercase tracking-wider">
                {error}
              </p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800">
              <div className="relative inline-block mb-6">
                <Car className="h-20 w-20 mx-auto text-gray-200 dark:text-gray-800" />
                <Zap className="h-8 w-8 absolute -bottom-2 -right-2 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic mb-2">
                Garage is Empty
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-10">
                Performance tracking is unavailable without a vehicle.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-gray-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex justify-between items-center p-6">
                    <div className="flex gap-4 items-center">
                      <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-white dark:bg-black items-center justify-center border border-gray-100 dark:border-gray-800">
                        <Zap
                          size={20}
                          className="text-orange-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic leading-tight">
                          {vehicle.year} {vehicle.make}
                        </h3>
                        <p className="text-sm font-bold text-orange-600 uppercase tracking-tighter mb-1">
                          {vehicle.model}
                        </p>
                        <div className="flex gap-3 mt-1">
                          {vehicle.trim && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase">
                              <ShieldCheck
                                size={10}
                                className="text-green-500"
                              />{" "}
                              {vehicle.trim}
                            </span>
                          )}
                          {vehicle.tireSize && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase border-l border-gray-300 dark:border-gray-700 pl-3">
                              R-SPEC: {vehicle.tireSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {removingIndex === index ? (
                      <div className="flex gap-2 animate-in slide-in-from-right-2">
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => setRemovingIndex(null)}>
                          <X size={14} />
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          className="font-black uppercase italic text-[10px]"
                          onPress={() => confirmRemove(index)}>
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <Button
                        isIconOnly
                        className="bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                        radius="xl"
                        onPress={() => setRemovingIndex(index)}>
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                  {/* Bottom racing stripe for active card */}
                  <div className="h-1 w-0 group-hover:w-full bg-orange-600 transition-all duration-500" />
                </div>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter className="p-8">
          <Button
            className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl"
            onPress={onClose}>
            Exit Garage
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
