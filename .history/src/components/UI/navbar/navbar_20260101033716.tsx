"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
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
  Headphones,
} from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";
import MobileNavItems from "./mobile-nav-items";

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
      {/* --- DESKTOP VIEW --- */}
      <HeroUINavbar
        maxWidth="2xl"
        position="sticky"
        // Height auto করে দিয়েছি যাতে কন্টেন্ট অনুযায়ী অ্যাডজাস্ট হয়
        className="bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-auto py-2"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        <div className="hidden md:flex flex-col w-full gap-2">
          {/* Top Info Bar (Live Support & Track Ready) */}
          <div className="flex justify-center items-center gap-8 py-1">
            <NextLink
              href="/contact"
              className="flex items-center gap-1.5 group">
              <Headphones
                size={12}
                className="text-orange-500 group-hover:animate-pulse"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-orange-600 transition-colors italic">
                Live Support
              </span>
            </NextLink>
            <div className="h-3 w-[1px] bg-gray-200 dark:bg-gray-800" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                size={12}
                className="text-orange-500"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                Track Ready Tires
              </span>
            </div>
          </div>

          {/* Main Navigation Row */}
          <div className="flex items-center justify-between w-full">
            <NavbarBrand
              as="li"
              className="max-w-fit">
              <NextLink
                href="/"
                className="hover:scale-105 transition-all duration-300">
                <Logo />
              </NextLink>
            </NavbarBrand>

            <DesktopNavItems />

            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <NavbarLogin />
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />

              <button
                onClick={handleOpenVehicleModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all group">
                <Car
                  size={16}
                  className="text-orange-600 group-hover:rotate-12 transition-transform"
                />
                <span className="text-[10px] font-black uppercase italic">
                  {latestModel || "My Garage"}
                </span>
              </button>

              <NextLink
                href="/cart"
                className="group relative p-3 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all">
                <ShoppingCart
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                <Zap
                  size={10}
                  className="absolute top-1 right-1 text-yellow-400 fill-yellow-400 animate-bounce"
                />
              </NextLink>
            </div>
          </div>
        </div>

        {/* --- MOBILE VIEW --- */}
        <NavbarContent
          className="md:hidden w-full h-16"
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
              className="relative p-2.5 bg-orange-600 rounded-xl shadow-lg shadow-orange-500/30 text-white active:scale-90 transition-transform">
              <ShoppingCart size={20} />
              <Zap
                size={8}
                className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400"
              />
            </NextLink>
            <NavbarLoginMobile />
            <NavbarMenuToggle className="text-gray-900 dark:text-white ml-1" />
          </div>
        </NavbarContent>

        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-8 px-4">
          <div className="flex flex-col h-full">
            <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />

            <div className="mt-auto pb-10 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1d23] rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <SunMoon
                    className="text-orange-500"
                    size={20}
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 italic">
                    Switch Appearance
                  </span>
                </div>
                <ThemeSwitch />
              </div>
              <button
                onClick={handleOpenVehicleModal}
                className="flex items-center justify-between w-full p-5 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-orange-600 rounded-xl">
                    <Car size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                      Active Vehicle
                    </p>
                    <p className="text-sm font-black uppercase italic tracking-tight">
                      {latestModel || "Setup Your Ride"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-600 group-hover:translate-x-1 transition-transform"
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
