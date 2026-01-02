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
} from "lucide-react";
import Image from "next/image";
import { VehicleModal } from "./my-vehicles-modal";
import DesktopNavItems from "./desktop-nav-items";
import MobileNavItems from "./mobile-nav-items";

export const Navbar = () => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [latestModel, setLatestModel] = useState<string>("");

  const handleOpenVehicleModal = () => setIsVehicleModalOpen(true);
  const handleCloseVehicleModal = () => {
    setIsVehicleModalOpen(false);
    loadVehicles();
  };

  const loadVehicles = () => {
    try {
      if (typeof window !== "undefined") {
        const savedVehicles = localStorage.getItem("userVehicles");
        if (savedVehicles) {
          const vehicles = JSON.parse(savedVehicles);
          const list = Array.isArray(vehicles) ? vehicles : [vehicles];
          if (list.length > 0)
            setLatestModel(list[list.length - 1].model || "");
        } else {
          setLatestModel("");
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
        height={100}
        className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="hidden md:flex items-center justify-between w-full px-6 py-2">
          {/* Left: Brand */}
          <NavbarBrand
            as="li"
            className="gap-2 max-w-fit">
            <NextLink
              href="/"
              className="flex items-center hover:scale-105 transition-transform">
              <Logo />
            </NextLink>
          </NavbarBrand>

          {/* Middle: Navigation & Help */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              <NextLink
                href="/contact"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 transition-colors">
                <Phone
                  size={14}
                  className="text-orange-500"
                />{" "}
                Need Assistance?
              </NextLink>
              <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <ShieldCheck
                  size={14}
                  className="text-orange-500"
                />{" "}
                Certified Tires
              </div>
            </div>
            <DesktopNavItems />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <NavbarLogin />

            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2" />

            <button
              onClick={handleOpenVehicleModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-500 transition-all group">
              <Car
                size={18}
                className="text-orange-600 group-hover:animate-bounce"
              />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {latestModel || "Garage"}
              </span>
            </button>

            <Link
              href="/cart"
              className="relative p-3 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:scale-110 transition-all">
              <ShoppingCart size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Navbar Content */}
        <NavbarContent
          className="md:hidden w-full px-4"
          justify="center">
          <NavbarBrand>
            <NextLink href="/">
              <Image
                src="/logo.png"
                height={60}
                width={60}
                alt="logo"
                className="object-contain"
              />
            </NextLink>
          </NavbarBrand>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <NavbarLoginMobile />
            <NavbarMenuToggle />
          </div>
        </NavbarContent>

        <NavbarMenu className="bg-white dark:bg-[#0f1115] pt-6">
          <MobileNavItems />
          <div className="mt-auto pb-10 flex flex-col gap-4">
            <button
              onClick={handleOpenVehicleModal}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Car className="text-orange-600" />
                <span className="font-black uppercase text-xs tracking-widest">
                  {latestModel || "My Vehicles"}
                </span>
              </div>
              <ChevronRight size={16} />
            </button>
            <Link
              href="/cart"
              className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest shadow-xl">
              <ShoppingCart size={20} /> View Cart
            </Link>
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
