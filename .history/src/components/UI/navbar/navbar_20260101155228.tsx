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
import { Car, Phone, ShoppingCart, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";
import MobileNavItems from "./mobile-nav-items";
import clsx from "clsx";

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <HeroUINavbar
        maxWidth="full"
        position="sticky"
        className="bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-auto py-3"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        {/* --- DESKTOP & TABLET CONTAINER --- */}
        <div className="hidden md:flex flex-col w-full gap-4">
          {/* 🏁 Top Row: Logo | Support Bar | Actions */}
          <div className="flex items-center justify-between w-full px-4 lg:px-8">
            <NavbarBrand
              as="li"
              className="max-w-fit shrink-0">
              <NextLink
                href="/"
                className="hover:scale-105 transition-all">
                <Logo />
              </NextLink>
            </NavbarBrand>

            {/* সাপোর্ট বার - এখন ছোট ল্যাপটপেও সুন্দর দেখাবে কারণ এটা মেনুর সাথে গাদাগাদি করছে না */}
            <div className="flex items-center gap-4 lg:gap-8">
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

            <div className="flex items-center gap-3 shrink-0">
              <ThemeSwitch />
              <NavbarLogin />
              <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800" />
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all">
                <Car
                  size={16}
                  className="text-orange-600"
                />
                <span className="hidden lg:inline text-[10px] font-black uppercase italic">
                  {latestModel || "My Garage"}
                </span>
              </button>
              <NextLink
                href="/cart"
                className="group relative p-2.5 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all">
                <ShoppingCart
                  size={20}
                  className="group-hover:rotate-[-12deg] transition-transform"
                />
                <Zap
                  size={8}
                  className="absolute top-1 right-1 text-yellow-400 fill-yellow-400 animate-pulse"
                />
              </NextLink>
            </div>
          </div>

          {/* 🏁 Bottom Row: ৬টা মেনু আইটেম (Centered & Organized) */}
          <div className="flex justify-center border-t border-gray-50 dark:border-gray-900 pt-3">
            <nav className="flex items-center overflow-x-auto scrollbar-hide px-4">
              <DesktopNavItems />
            </nav>
          </div>
        </div>

        {/* --- MOBILE NAVBAR --- */}
        <NavbarContent
          className="md:hidden w-full h-16 px-4"
          justify="start">
          <NavbarBrand>
            <NextLink
              href="/"
              onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo.png"
                height={42}
                width={42}
                alt="logo"
              />
            </NextLink>
          </NavbarBrand>

          <div className="flex items-center gap-2">
            <NextLink
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="relative p-2.5 bg-orange-600 rounded-xl text-white active:scale-90 transition-transform">
              <ShoppingCart size={20} />
              <Zap
                size={8}
                className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400"
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

        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-8 px-4">
          <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />
        </NavbarMenu>
      </HeroUINavbar>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </>
  );
};
