"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
} from "@heroui/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { Logo } from "@/src/components/icons";
import { NavbarLogin, NavbarLoginMobile } from "./NavbarLogin";
import {
  Car,
  Phone,
  ShoppingCart,
  ShieldCheck,
  Zap,
  SunMoon,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";
import MobileNavItems from "./mobile-nav-items";
import clsx from "clsx";

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestModel, setLatestModel] = useState<string>("");

  const handleOpenVehicleModal = () => {
    setIsMenuOpen(false);
    setIsVehicleModalOpen(true);
  };

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
      <HeroUINavbar
        maxWidth="full"
        position="sticky"
        className="bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-auto py-4"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        {/* --- DESKTOP & TABLET CONTAINER --- */}
        <div className="hidden md:flex items-center justify-between w-full px-6 gap-4">
          <NavbarBrand
            as="li"
            className="max-w-fit shrink-0">
            <NextLink
              href="/"
              className="hover:scale-105 transition-all">
              <Logo />
            </NextLink>
          </NavbarBrand>

          {/* ✅ মাঝখানের পার্ট: বড় স্ক্রিনে মেনু দেখাবে, ১৩৫০px এর নিচে শুধু সাপোর্ট বার */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="flex items-center gap-6">
              <NextLink
                href="/contact"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors italic shrink-0">
                <Phone
                  size={12}
                  className="text-orange-500"
                />{" "}
                Live Support
              </NextLink>
              <div className="h-3 w-[1px] bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic shrink-0">
                <ShieldCheck
                  size={12}
                  className="text-orange-500"
                />{" "}
                Track Ready
              </div>
            </div>

            {/* ১৩৫০px এর বেশি হলে ডেস্কটপ মেনু দেখাবে, কম হলে হাইড হয়ে ড্রয়ারে চলে যাবে */}
            <div className="hidden min-[1350px]:block">
              <DesktopNavItems />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* ✅ "RACE MENU" Button for 768px to 1350px */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-[1350px]:hidden flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] italic shadow-lg hover:bg-orange-700 transition-all">
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>Menu</span>
            </button>

            <ThemeSwitch />
            <NavbarLogin />
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800" />

            <button
              onClick={handleOpenVehicleModal}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all">
              <Car
                size={16}
                className="text-orange-600"
              />
              <span className="text-[10px] font-black uppercase italic">
                {latestModel || "My Garage"}
              </span>
            </button>

            <NextLink
              href="/cart"
              className="group relative p-3 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all overflow-hidden">
              <ShoppingCart
                size={22}
                className="group-hover:rotate-[-12deg] transition-transform"
              />
              <Zap
                size={10}
                className="absolute top-1 right-1 text-yellow-400 fill-yellow-400 animate-pulse"
              />
            </NextLink>
          </div>
        </div>

        {/* --- MOBILE NAVBAR (<768px) --- */}
        <NavbarContent
          className="md:hidden w-full h-16 px-4"
          justify="start">
          <NavbarBrand>
            <NextLink
              href="/"
              onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo.png"
                height={45}
                width={45}
                alt="logo"
                className="object-contain"
              />
            </NextLink>
          </NavbarBrand>

          <div className="flex items-center gap-3">
            <NextLink
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="relative p-2.5 bg-orange-600 rounded-xl text-white">
              <ShoppingCart size={20} />
              <Zap
                size={8}
                className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400 animate-pulse"
              />
            </NextLink>
            <NavbarLoginMobile />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={clsx(
                "w-11 h-11 rounded-xl flex flex-col justify-center items-center transition-all border",
                isMenuOpen
                  ? "bg-orange-600 border-orange-500"
                  : "bg-gray-900 border-gray-800"
              )}>
              <div className="flex flex-col gap-1">
                <span
                  className={clsx(
                    "h-0.5 w-5 bg-white transition-all",
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  )}
                />
                <span
                  className={clsx(
                    "h-0.5 w-3 bg-white self-end transition-all",
                    isMenuOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={clsx(
                    "h-0.5 w-5 bg-white transition-all",
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  )}
                />
              </div>
            </button>
          </div>
        </NavbarContent>

        {/* --- FULL MENU DRAWER (Mobile & Tablet) --- */}
        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-8 px-4">
          <div className="flex flex-col h-full">
            <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />
            <div className="mt-auto pb-10 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d23] rounded-2xl border">
                <div className="flex items-center gap-3">
                  <SunMoon
                    className="text-orange-500"
                    size={20}
                  />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Switch Theme
                  </span>
                </div>
                <ThemeSwitch />
              </div>

              <button
                onClick={handleOpenVehicleModal}
                className="flex items-center justify-between w-full p-5 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-600 rounded-xl">
                    <Car size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      Active Vehicle
                    </p>
                    <p className="text-sm font-black uppercase italic">
                      {latestModel || "Setup Ride"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-600"
                />
              </button>
            </div>
          </div>
        </NavbarMenu>
      </HeroUINavbar>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </>
  );
};
