"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { Logo } from "@/src/components/icons";
import { NavbarLogin } from "./NavbarLogin";
import { Car, ShoppingCart, User, Home, Grid, Phone, Zap } from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [latestModel, setLatestModel] = useState<string>("");

  const loadVehicles = () => {
    try {
      if (typeof window !== "undefined") {
        const savedVehicles = localStorage.getItem("userVehicles");
        if (savedVehicles) {
          const list = JSON.parse(savedVehicles);
          const vehicles = Array.isArray(list) ? list : [list];
          if (vehicles.length > 0)
            setLatestModel(vehicles[vehicles.length - 1].model || "");
        }
      }
    } catch (err) {
      setLatestModel("");
    }
  };

  useEffect(() => {
    loadVehicles();
    window.addEventListener("storage", loadVehicles);
    window.addEventListener("vehiclesUpdated", loadVehicles);
    return () => {
      window.removeEventListener("storage", loadVehicles);
      window.removeEventListener("vehiclesUpdated", loadVehicles);
    };
  }, []);

  return (
    <>
      {/* --- DESKTOP NAVBAR (Hidden on Mobile) --- */}
      <HeroUINavbar
        maxWidth="2xl"
        position="sticky"
        height={90}
        className="hidden md:flex bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between w-full px-6">
          <NavbarBrand
            as="li"
            className="max-w-fit">
            <NextLink
              href="/"
              className="hover:scale-105 transition-all">
              <Logo />
            </NextLink>
          </NavbarBrand>

          <DesktopNavItems />

          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <NavbarLogin />

            {/* Sporty Vehicle Badge */}
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all">
              <Car
                size={16}
                className="text-orange-600"
              />
              <span className="text-[10px] font-black uppercase italic">
                {latestModel || "Garage"}
              </span>
            </button>

            {/* Sporty Desktop Cart */}
            <NextLink
              href="/cart"
              className="group relative p-3 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
              <ShoppingCart
                size={22}
                className="group-hover:rotate-[-12deg] transition-transform"
              />
              <Zap
                size={10}
                className="absolute top-1 right-1 text-yellow-400 fill-yellow-400"
              />
            </NextLink>
          </div>
        </div>
      </HeroUINavbar>

      {/* --- MOBILE APP-STYLE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[100] transition-all">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 h-20 rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-4">
          <NextLink
            href="/"
            className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-600 transition-colors">
            <Home size={22} />
            <span className="text-[8px] font-black uppercase">Track</span>
          </NextLink>

          <NextLink
            href="/tire"
            className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-600 transition-colors">
            <Grid size={22} />
            <span className="text-[8px] font-black uppercase">Browse</span>
          </NextLink>

          {/* Center Cart Button (Floating Style) */}
          <NextLink
            href="/cart"
            className="relative -mt-12 bg-gradient-to-br from-orange-600 to-orange-400 p-5 rounded-full shadow-[0_10px_25px_rgba(249,115,22,0.5)] border-4 border-white dark:border-[#0f1115] text-white active:scale-90 transition-all">
            <ShoppingCart size={24} />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full border-2 border-orange-600" />
          </NextLink>

          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-600 transition-colors">
            <Car size={22} />
            <span className="text-[8px] font-black uppercase">Ride</span>
          </button>

          <NextLink
            href="/profile"
            className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-600 transition-colors">
            <User size={22} />
            <span className="text-[8px] font-black uppercase">Driver</span>
          </NextLink>
        </div>
      </div>

      {/* Minimal Top Logo for Mobile */}
      <div className="md:hidden flex justify-center py-4 absolute top-0 w-full z-10">
        <Image
          src="/logo.png"
          height={45}
          width={45}
          alt="logo"
        />
      </div>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </>
  );
};
