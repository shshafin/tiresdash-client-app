"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { Logo } from "@/src/components/icons";
import { NavbarLogin, NavbarLoginMobile } from "./NavbarLogin";
import { Car, Phone, ShoppingCart, ShieldCheck, Zap, Menu } from "lucide-react";
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
        className="bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-20"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        {/* --- DESKTOP (Full Width Layout) --- */}
        <NavbarContent
          className="hidden md:flex w-full"
          justify="between">
          <NavbarBrand
            as="li"
            className="max-w-fit">
            <NextLink
              href="/"
              className="hover:scale-105 transition-all">
              <Logo />
            </NextLink>
          </NavbarBrand>

          {/* ✅ মাঝখানে থাকবে ৬টা মেনু (শধুমাত্র বড় স্ক্রিনে > 1280px) */}
          <div className="hidden xl:flex items-center">
            <DesktopNavItems />
          </div>

          {/* ✅ মিডিয়াম স্ক্রিনে (768px - 1280px) সাপোর্ট বার হাইড হবে, কিন্তু মেনু বাটন আসবে */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* সাপোর্ট বার (শুধুমাত্র বড় স্ক্রিনে) */}
            <div className="hidden 2xl:flex items-center gap-6 mr-4">
              <NextLink
                href="/contact"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                <Phone
                  size={12}
                  className="text-orange-500"
                />{" "}
                Live Support
              </NextLink>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                <ShieldCheck
                  size={12}
                  className="text-orange-500"
                />{" "}
                Track Ready
              </div>
            </div>

            <ThemeSwitch />
            <NavbarLogin />

            {/* গ্যারেজ বাটন */}
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all">
              <Car
                size={16}
                className="text-orange-600"
              />
              <span className="text-[10px] font-black uppercase italic">
                {latestModel || "My Garage"}
              </span>
            </button>

            {/* কার্ট */}
            <NextLink
              href="/cart"
              className="group relative p-3 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl">
              <ShoppingCart
                size={22}
                className="group-hover:rotate-[-12deg] transition-transform"
              />
              <Zap
                size={10}
                className="absolute top-1 right-1 text-yellow-400 fill-yellow-400 animate-pulse"
              />
            </NextLink>

            {/* ✅ "RACE MENU" DRAWER TOGGLE (Visible on Tablet & Medium Laptops < 1280px) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] italic shadow-lg active:scale-95 transition-all">
              <Menu size={18} />
              Menu
            </button>
          </div>
        </NavbarContent>

        {/* --- MOBILE NAVBAR (<768px) --- */}
        <NavbarContent
          className="md:hidden w-full"
          justify="between">
          <NavbarBrand>
            <NextLink href="/">
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
              className="relative p-2.5 bg-orange-600 rounded-xl text-white">
              <ShoppingCart size={20} />
            </NextLink>
            <NavbarLoginMobile />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-11 h-11 rounded-xl bg-gray-900 border border-gray-800 flex flex-col justify-center items-center">
              <span
                className={clsx(
                  "h-0.5 w-5 bg-white transition-all",
                  isMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1"
                )}
              />
              <span
                className={clsx(
                  "h-0.5 w-5 bg-white transition-all",
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                )}
              />
            </button>
          </div>
        </NavbarContent>

        {/* --- THE DRAWER (Menu Items for Tablet & Mobile) --- */}
        <NavbarMenu className="bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-2xl pt-10 px-6">
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 italic">
              Pit Stop Menu
            </p>
            <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />

            <div className="mt-auto pb-10 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-6">
              {/* গ্যারেজ একশন ড্রয়ারে */}
              <button
                onClick={handleOpenVehicleModal}
                className="w-full flex justify-between items-center p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border">
                <div className="flex items-center gap-3">
                  <Car className="text-orange-600" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase">
                      Active Ride
                    </p>
                    <p className="font-black uppercase italic">
                      {latestModel || "Setup Garage"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400"
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
