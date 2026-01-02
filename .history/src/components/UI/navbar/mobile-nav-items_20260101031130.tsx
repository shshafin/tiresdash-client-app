"use client";

import { useState } from "react";
import { NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Package,
  Zap,
  Settings,
  Activity,
  Tool,
  CreditCard,
} from "lucide-react";
import NextLink from "next/link";
import { Divider } from "@heroui/divider";
import { siteConfig } from "@/src/config/site";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";

// ✅ Reusable Tab Component with Sports Theme
const MobileTabContent = ({ tabs, activeTab, setActiveTab }: any) => (
  <div className="space-y-4 px-2">
    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-3 rounded-xl text-center transition-all duration-300 font-black text-[10px] tracking-widest uppercase ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          {tab.title}
        </button>
      ))}
    </div>

    <div className="space-y-2">
      {tabs
        .filter((tab: any) => tab.id === activeTab)
        .map((tab: any) => (
          <div
            key={tab.id}
            className="grid grid-cols-1 gap-2">
            {tab.content.map((item: any, index: number) => (
              <NextLink
                key={index}
                href={item.href}>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-orange-500 transition-all group">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase italic tracking-tight group-hover:text-orange-600">
                    {item.name}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </NextLink>
            ))}
          </div>
        ))}
    </div>
  </div>
);

// ✅ Category Card for Accordion
const MobileCategorySection = ({ title, items, icon: Icon }: any) => (
  <div className="p-2">
    <div className="grid grid-cols-2 gap-2">
      {items.map((item: any, index: number) => (
        <NextLink
          key={index}
          href={item.href}>
          <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-transparent hover:border-orange-500/30 transition-all active:scale-95">
            <span className="text-[10px] font-black text-gray-800 dark:text-gray-200 uppercase leading-tight italic">
              {item.name}
            </span>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[8px] font-bold text-orange-600 uppercase tracking-tighter">
                View Series
              </span>
              <Zap
                size={10}
                className="text-orange-500"
              />
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  </div>
);

// --- Sub-dropdowns (Updated Hooks) ---

const TireMobileDropdown = () => {
  const [activeTab, setActiveTab] = useState("vehicle");
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: cd } = useGetCategories({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });
  const { data: tsd } = useGetTyreSizes({});

  const modifiedBrands = bd?.data?.map((brand: any) => ({
    id: brand._id,
    name: brand.name,
    href: `/tire?brand=${brand._id}`,
  }));
  const modifiedCategories = cd?.data?.map((cat: any) => ({
    id: cat._id,
    name: cat.name,
    href: `/tire?category=${cat._id}`,
  }));
  const modifiedTireSizes = tsd?.data?.map((ts: any) => ({
    id: ts._id,
    name: ts.tireSize,
    href: `/tire?tireSize=${ts._id}`,
  }));
  const modifiedVehicleTypes = vtd?.data?.map((vt: any) => ({
    id: vt._id,
    name: vt.vehicleType,
    href: `/tire?vehicleType=${vt._id}`,
  }));

  const mobileTireData = {
    tabs: [
      {
        id: "vehicle",
        title: "Vehicle Type",
        content: modifiedVehicleTypes || [],
      },
      { id: "size", title: "Tire Sizes", content: modifiedTireSizes || [] },
    ],
    brands: modifiedBrands || [],
    types: modifiedCategories || [],
  };

  return (
    <div className="py-4">
      <MobileTabContent
        tabs={mobileTireData.tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Accordion
        variant="light"
        className="px-2 mt-4">
        <AccordionItem
          key="1"
          aria-label="Brands"
          title={
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
              Popular Brands
            </span>
          }>
          <MobileCategorySection items={mobileTireTireData.brands} />
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Types"
          title={
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
              Categories
            </span>
          }>
          <MobileCategorySection items={mobileTireTireData.types} />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const WheelMobileDropdown = () => {
  const [activeTab, setActiveTab] = useState("shop");
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: wwt } = useGetWheelWidthTypes({ limit: 6 });

  const modifiedBrands = bd?.data?.map((brand: any) => ({
    id: brand._id,
    name: brand.name,
    href: `/wheel?brand=${brand._id}`,
  }));
  const modifiedStyles = wwt?.data?.map((ww: any) => ({
    id: ww._id,
    name: ww.widthType,
    href: `/wheel?widthType=${ww._id}`,
  }));

  const mobileWheelData = {
    tabs: [
      { id: "shop", title: "Wheel Styles", content: modifiedStyles || [] },
    ],
    brands: modifiedBrands || [],
  };

  return (
    <div className="py-4">
      <MobileTabContent
        tabs={mobileWheelData.tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="px-4 mt-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic mb-3">
          Top Wheel Brands
        </h4>
        <MobileCategorySection items={mobileWheelData.brands} />
      </div>
    </div>
  );
};

// --- Main Menu Component ---

const MobileNavItems = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const renderDropdownContent = (label: string) => {
    switch (label) {
      case "TIRES":
        return <TireMobileDropdown />;
      case "WHEELS":
        return <WheelMobileDropdown />;
      case "ACCESSORIES":
        return (
          <div className="py-4 px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase p-2 tracking-widest italic">
              Performance Gear
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { n: "Tire Monitors", h: "/tpms" },
                { n: "Tire Chains", h: "/chains" },
                { n: "Tools", h: "/tools" },
              ].map((item, i) => (
                <NextLink
                  key={i}
                  href={item.h}
                  className="p-4 bg-white dark:bg-gray-900 rounded-2xl flex justify-between items-center">
                  <span className="text-xs font-bold uppercase italic">
                    {item.n}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-orange-500"
                  />
                </NextLink>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-2">
      {siteConfig.navMenuItems.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="w-full">
          <NavbarMenuItem>
            {item.hasDropdown ? (
              <div className="w-full">
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all ${
                    expandedItems.includes(item.label)
                      ? "bg-gray-100 dark:bg-gray-800 shadow-inner"
                      : "bg-transparent"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${index === 0 ? "bg-orange-500" : index === 1 ? "bg-blue-500" : "bg-emerald-500"}`}
                    />
                    <span className="text-sm font-black uppercase tracking-[0.1em] italic text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-500 ${expandedItems.includes(item.label) ? "rotate-180 text-orange-600" : "text-gray-400"}`}
                  />
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="mt-2 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    {renderDropdownContent(item.label)}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-gray-50 transition-all">
                <span
                  className={`text-sm font-black uppercase tracking-[0.1em] italic ${
                    index === siteConfig.navMenuItems.length - 1
                      ? "text-red-600"
                      : "text-gray-900 dark:text-white"
                  }`}>
                  {item.label}
                </span>
                <ChevronRight
                  size={16}
                  className="text-gray-300"
                />
              </Link>
            )}
          </NavbarMenuItem>
          {index < siteConfig.navMenuItems.length - 1 && (
            <div className="h-[1px] bg-gray-100 dark:bg-gray-800 mx-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileNavItems;
