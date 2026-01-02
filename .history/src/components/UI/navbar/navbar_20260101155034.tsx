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
        maxWidth="full" // ✅ 2xl থেকে full করেছি যাতে 1350px এ জায়গা পায়
        position="sticky"
        className="bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 h-auto py-2 md:py-4"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        {/* --- DESKTOP & TABLET NAVBAR (768px to 1350px+ optimized) --- */}
        <div className="hidden md:flex items-center justify-between w-full px-2 lg:px-8 gap-2">
          {/* লোগো সেকশন - ছোট স্ক্রিনে একটু ছোট হবে */}
          <NavbarBrand
            as="li"
            className="max-w-fit shrink-0">
            <NextLink
              href="/"
              className="hover:scale-105 transition-all">
              <div className="scale-85 lg:scale-100">
                <Logo />
              </div>
            </NextLink>
          </NavbarBrand>

          {/* মিডল সেকশন - এইখানেই আসল খেলা */}
          <div className="flex flex-col items-center gap-2 lg:gap-3 flex-1 overflow-hidden">
            {/* সাপোর্ট বার - 1100px এর নিচে হাইড হবে জায়গা বাঁচাতে */}
            <div className="hidden xl:flex items-center gap-6">
              <NextLink
                href="/contact"
                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors italic">
                <Phone
                  size={10}
                  className="text-orange-500"
                />{" "}
                Live Support
              </NextLink>
              <div className="h-2 w-[1px] bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                <ShieldCheck
                  size={10}
                  className="text-orange-500"
                />{" "}
                Track Ready
              </div>
            </div>

            {/* মেইন মেনু - 768px থেকে 1350px এর মধ্যে স্পেসিং কমাবে */}
            <nav className="flex items-center">
              <DesktopNavItems />
            </nav>
          </div>

          {/* রাইট সাইড একশনস */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <ThemeSwitch />
            <NavbarLogin />

            {/* গ্যারেজ বাটন - মিডিয়াম স্ক্রিনে টেক্সট হাইড হয়ে শুধু আইকন দেখাবে */}
            <button
              onClick={handleOpenVehicleModal}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all group">
              <Car
                size={16}
                className="text-orange-600 group-hover:animate-bounce"
              />
              <span className="hidden lg:inline text-[10px] font-black uppercase italic">
                {latestModel || "My Garage"}
              </span>
            </button>

            {/* কার্ট বাটন */}
            <NextLink
              href="/cart"
              className="group relative p-2.5 lg:p-3 bg-gray-900 dark:bg-orange-600 text-white rounded-2xl shadow-xl hover:shadow-orange-500/40 transition-all overflow-hidden">
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
                height={40}
                width={40}
                alt="logo"
                className="object-contain"
              />
            </NextLink>
          </NavbarBrand>

          <div className="flex items-center gap-3">
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
                "relative flex flex-col justify-center items-center w-11 h-11 rounded-xl transition-all duration-300 border shadow-md",
                isMenuOpen
                  ? "bg-orange-600 border-orange-500"
                  : "bg-gray-900 border-gray-800"
              )}>
              <div className="flex flex-col gap-1 z-10">
                <span
                  className={clsx(
                    "h-0.5 w-5 bg-white rounded-full transition-all",
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  )}
                />
                <span
                  className={clsx(
                    "h-0.5 w-3 bg-white rounded-full self-end transition-all",
                    isMenuOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={clsx(
                    "h-0.5 w-5 bg-white rounded-full transition-all",
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  )}
                />
              </div>
            </button>
          </div>
        </NavbarContent>

        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-8 px-4">
          <div className="flex flex-col h-full">
            <MobileNavItems closeMenu={() => setIsMenuOpen(false)} />
            <div className="mt-auto pb-10 space-y-4">
              {/* Mobile Switch & Garage Button code same as before... */}
              <button
                onClick={handleOpenVehicleModal}
                className="flex items-center justify-between w-full p-4 bg-gray-900 text-white rounded-2xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-600 rounded-xl">
                    <Car size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
                      Active Vehicle
                    </p>
                    <p className="text-xs font-black uppercase italic">
                      {latestModel || "Setup Ride"}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
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
