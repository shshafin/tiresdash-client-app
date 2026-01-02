"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { Logo } from "@/src/components/icons";
import { NavbarLogin, NavbarLoginMobile } from "./NavbarLogin";
import {
  Car,
  Phone,
  ShoppingCart,
  ShieldCheck,
  ChevronRight,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";
import MobileNavItems from "./mobile-nav-items";

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Fix 1: State handling
  const [latestModel, setLatestModel] = useState<string>("");

  const handleOpenVehicleModal = () => {
    setIsMenuOpen(false); // ✅ Fix 2: Close navbar before opening modal
    setIsVehicleModalOpen(true);
  };

  const handleCloseVehicleModal = () => setIsVehicleModalOpen(false);

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
        maxWidth="2xl"
        position="sticky"
        height={80}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/90 dark:bg-[#0f1115]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:flex items-center justify-between w-full px-6">
          <NavbarBrand
            as="li"
            className="max-w-fit">
            <NextLink
              href="/"
              className="hover:scale-105 transition-transform duration-300">
              <Logo />
            </NextLink>
          </NavbarBrand>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <NextLink
                href="/contact"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors">
                <Phone size={12} /> Live Support
              </NextLink>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <ShieldCheck
                  size={12}
                  className="text-orange-500"
                />{" "}
                Track Ready
              </div>
            </div>
            <DesktopNavItems />
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <NavbarLogin />
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800" />
            <button
              onClick={handleOpenVehicleModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all">
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
              className="p-3 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:rotate-6 transition-all">
              <ShoppingCart size={20} />
            </NextLink>
          </div>
        </div>

        {/* --- MOBILE VIEW (SPORTY DESIGN) --- */}
        <NavbarContent
          className="md:hidden w-full"
          justify="between">
          <NavbarBrand>
            <NextLink
              href="/"
              onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo.png"
                height={50}
                width={50}
                alt="logo"
                className="object-contain"
              />
            </NextLink>
          </NavbarBrand>

          <div className="flex items-center gap-2">
            {/* Sporty Cart Icon for Mobile */}
            <NextLink
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="relative p-2.5 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/30 text-white">
              <ShoppingCart size={18} />
              <Zap
                size={8}
                className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400 animate-pulse"
              />
            </NextLink>
            <ThemeSwitch />
            <NavbarLoginMobile />
            <NavbarMenuToggle className="text-gray-900 dark:text-white" />
          </div>
        </NavbarContent>

        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-6 px-4">
          <div className="flex flex-col h-full">
            <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />

            <div className="mt-auto pb-10 space-y-3">
              {/* Sporty Garage Card */}
              <button
                onClick={handleOpenVehicleModal}
                className="flex items-center justify-between w-full p-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl border border-gray-800 shadow-xl group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-600 rounded-xl group-active:scale-90 transition-transform">
                    <Car
                      className="text-white"
                      size={20}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                      Active Vehicle
                    </p>
                    <p className="text-sm font-black text-white uppercase italic">
                      {latestModel || "Setup Your Ride"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="text-gray-500"
                  size={20}
                />
              </button>

              <NextLink
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full h-16 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl text-white font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 active:scale-[0.98] transition-all">
                <ShoppingCart size={20} />
                Checkout Now
              </NextLink>
            </div>
          </div>
        </NavbarMenu>
      </HeroUINavbar>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={handleCloseVehicleModal}
      />
    </>
  );
};
