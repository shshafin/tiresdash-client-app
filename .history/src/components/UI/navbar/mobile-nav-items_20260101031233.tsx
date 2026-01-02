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
  Activity,
  ShieldCheck,
  Gauge,
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

// ✅ Sports Tab Component
const MobileTabContent = ({ tabs, activeTab, setActiveTab }: any) => (
  <div className="space-y-4 px-1">
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 rounded-lg text-center transition-all font-black text-[10px] uppercase tracking-tighter ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md shadow-orange-500/20"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          {tab.title}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-2">
      {tabs
        .filter((tab: any) => tab.id === activeTab)
        .map((tab: any) => (
          <div
            key={tab.id}
            className="space-y-1.5">
            {tab.content.map((item: any, index: number) => (
              <NextLink
                key={index}
                href={item.href}>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1d23] border border-gray-100 dark:border-gray-800 rounded-xl active:scale-[0.98] transition-all">
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase italic">
                    {item.name}
                  </span>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-1 rounded-md">
                    <ChevronRight
                      size={14}
                      className="text-orange-600"
                    />
                  </div>
                </div>
              </NextLink>
            ))}
          </div>
        ))}
    </div>
  </div>
);

// ✅ Sports Category Grid
const MobileCategorySection = ({
  title,
  items,
}: {
  title: string;
  items: any[];
}) => (
  <div className="p-1">
    <div className="grid grid-cols-2 gap-2">
      {items.map((item, index) => (
        <NextLink
          key={index}
          href={item.href}>
          <div className="flex flex-col gap-2 p-4 bg-white dark:bg-[#1a1d23] rounded-xl border border-gray-50 dark:border-gray-800 active:bg-orange-50 dark:active:bg-orange-900/10 transition-all">
            <span className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase italic leading-tight">
              {item.name}
            </span>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">
                Explore
              </span>
              <Activity
                size={10}
                className="text-orange-500 opacity-50"
              />
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  </div>
);

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
        title: "🚗 By Vehicle",
        content: modifiedVehicleTypes || [],
      },
      { id: "size", title: "📏 By Size", content: modifiedTireSizes || [] },
    ],
    brands: modifiedBrands || [],
    types: modifiedCategories || [],
  };

  return (
    <div className="py-2">
      <MobileTabContent
        tabs={mobileTireData.tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Accordion
        variant="light"
        className="px-0 mt-4">
        <AccordionItem
          key="1"
          aria-label="Brands"
          title={
            <div className="flex items-center gap-2">
              <Package
                size={14}
                className="text-orange-500"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                Popular Brands
              </span>
            </div>
          }>
          <MobileCategorySection
            title=""
            items={mobileTireData.brands}
          />
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Types"
          title={
            <div className="flex items-center gap-2">
              <Gauge
                size={14}
                className="text-orange-500"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                Categories
              </span>
            </div>
          }>
          <MobileCategorySection
            title=""
            items={mobileTireData.types}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const WheelMobileDropdown = () => {
  const [activeTab, setActiveTab] = useState("shop");
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: tsd } = useGetTyreSizes({});
  const { data: md } = useGetMakes({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });
  const { data: wwt } = useGetWheelWidthTypes({ limit: 6 });

  const modifiedBrands = bd?.data?.map((brand: any) => ({
    id: brand._id,
    name: brand.name,
    href: `/wheel?brand=${brand._id}`,
  }));
  const modifiedWheelWidthTypes = wwt?.data?.map((ww: any) => ({
    id: ww._id,
    name: ww.widthType,
    href: `/wheel?widthType=${ww._id}`,
  }));
  const modifiedTireSizes = tsd?.data?.map((ts: any) => ({
    id: ts._id,
    name: ts.tireSize,
    href: `/wheel?tireSize=${ts._id}`,
  }));
  const modifiedVehicleTypes = vtd?.data?.map((vt: any) => ({
    id: vt._id,
    name: vt.vehicleType,
    href: `/tire?vehicleType=${vt._id}`,
  }));

  const mobileWheelData = {
    tabs: [
      {
        id: "shop",
        title: "🛒 Wheels Shop",
        content: modifiedWheelWidthTypes || [],
      },
      {
        id: "vehicle",
        title: "🚗 By Vehicle",
        content: modifiedVehicleTypes || [],
      },
    ],
    brands: modifiedBrands || [],
  };

  return (
    <div className="py-2">
      <MobileTabContent
        tabs={mobileWheelData.tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="px-1 mt-4">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Zap
            size={14}
            className="text-orange-500"
          />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
            Elite Wheel Brands
          </h4>
        </div>
        <MobileCategorySection
          title=""
          items={mobileWheelData.brands}
        />
      </div>
    </div>
  );
};

const AccessoriesMobileDropdown = () => {
  const [activeTab, setActiveTab] = useState("tire-accessories");
  const accessoriesTabs = [
    {
      id: "tire-accessories",
      title: "🔧 Tire Gear",
      content: [
        { name: "Tire Monitors", href: "/accessories/tire/tpms" },
        { name: "Tire Chains", href: "/accessories/tire/chains" },
      ],
    },
    {
      id: "tools",
      title: "🛠️ Tools",
      content: [
        { name: "Jack Stands", href: "/accessories/tools/jack-stands" },
        { name: "Torque Wrenches", href: "/accessories/tools/torque-wrenches" },
      ],
    },
  ];
  return (
    <div className="py-2">
      <MobileTabContent
        tabs={accessoriesTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

const FinancingMobileDropdown = () => {
  const [activeTab, setActiveTab] = useState("options");
  const financingTabs = [
    {
      id: "options",
      title: "💳 Plans",
      content: [
        { name: "0% APR Financing", href: "/financing/zero-apr" },
        { name: "No Credit Check", href: "/financing/no-credit-check" },
      ],
    },
    {
      id: "tools",
      title: "🧮 Tools",
      content: [
        { name: "Payment Calculator", href: "/financing/calculator" },
        { name: "Rebates", href: "/financing/rebates" },
      ],
    },
  ];
  return (
    <div className="py-2">
      <MobileTabContent
        tabs={financingTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

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
        return <AccessoriesMobileDropdown />;
      case "FINANCING":
        return <FinancingMobileDropdown />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-1">
      {siteConfig.navMenuItems.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <NavbarMenuItem>
            {item.hasDropdown ? (
              <div className="w-full">
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className={`flex items-center justify-between w-full py-4 px-3 rounded-xl transition-all ${
                    expandedItems.includes(item.label)
                      ? "bg-gray-50 dark:bg-gray-800/50"
                      : "bg-transparent"
                  }`}>
                  <span
                    className={`text-base font-black uppercase italic tracking-tight ${
                      expandedItems.includes(item.label)
                        ? "text-orange-600"
                        : "text-gray-900 dark:text-white"
                    }`}>
                    {item.label}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${expandedItems.includes(item.label) ? "rotate-180 text-orange-600" : "text-gray-400"}`}
                  />
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="mt-2 bg-white dark:bg-[#0f1115] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-top-2">
                    {renderDropdownContent(item.label)}
                  </div>
                )}
              </div>
            ) : (
              <NextLink
                href={item.href}
                className="flex items-center justify-between w-full py-4 px-3 rounded-xl active:bg-gray-50 dark:active:bg-gray-800 transition-all">
                <span
                  className={`text-base font-black uppercase italic tracking-tight ${
                    index === siteConfig.navMenuItems.length - 1
                      ? "text-red-600"
                      : "text-gray-900 dark:text-white"
                  }`}>
                  {item.label}
                </span>
                <ChevronRight
                  size={18}
                  className="text-gray-300"
                />
              </NextLink>
            )}
          </NavbarMenuItem>
          {index < siteConfig.navMenuItems.length - 1 && (
            <Divider className="opacity-40" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileNavItems;
