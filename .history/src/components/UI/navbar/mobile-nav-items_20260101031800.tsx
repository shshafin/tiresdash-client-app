"use client";

import { useState } from "react";
import { NavbarMenuItem } from "@heroui/navbar";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Search,
  Zap,
  Gauge,
} from "lucide-react";
import NextLink from "next/link";
import { siteConfig } from "@/src/config/site";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";

// ✅ Sporty Sub-Menu Card
const MobileTabContent = ({
  tabs,
  activeTab,
  setActiveTab,
  closeMenu,
}: any) => (
  <div className="space-y-4 px-1">
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 rounded-lg text-center transition-all font-black text-[10px] uppercase ${
            activeTab === tab.id
              ? "bg-orange-600 text-white shadow-lg"
              : "text-gray-500"
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
                href={item.href}
                onClick={closeMenu}>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 border border-transparent active:border-orange-500 rounded-xl transition-all">
                  <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase italic">
                    {item.name}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-orange-500"
                  />
                </div>
              </NextLink>
            ))}
          </div>
        ))}
    </div>
  </div>
);

// ✅ Main Component
const MobileNavItems = ({ closeMenu }: { closeMenu: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Hooks (Keeping your logic intact)
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: cd } = useGetCategories({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });
  const { data: tsd } = useGetTyreSizes({});

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const renderDropdownContent = (label: string) => {
    const commonBrands = bd?.data?.map((b: any) => ({
      name: b.name,
      href: `/tire?brand=${b._id}`,
    }));

    if (label === "TIRES") {
      const tabs = [
        {
          id: "vehicle",
          title: "🚗 By Vehicle",
          content:
            vtd?.data?.map((v: any) => ({
              name: v.vehicleType,
              href: `/tire?vehicleType=${v._id}`,
            })) || [],
        },
        {
          id: "size",
          title: "📏 By Size",
          content:
            tsd?.data?.map((t: any) => ({
              name: t.tireSize,
              href: `/tire?tireSize=${t._id}`,
            })) || [],
        },
      ];
      return (
        <MobileTabContent
          tabs={tabs}
          activeTab="vehicle"
          closeMenu={closeMenu}
        />
      );
    }

    return null; // Add other cases as needed
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
                      ? "bg-orange-50 dark:bg-orange-950/10"
                      : ""
                  }`}>
                  <span
                    className={`text-base font-black uppercase italic ${expandedItems.includes(item.label) ? "text-orange-600" : "text-gray-900 dark:text-white"}`}>
                    {item.label}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${expandedItems.includes(item.label) ? "rotate-180 text-orange-600" : ""}`}
                  />
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="mt-2 animate-in slide-in-from-top-2 duration-300">
                    {renderDropdownContent(item.label)}
                  </div>
                )}
              </div>
            ) : (
              <NextLink
                href={item.href}
                onClick={closeMenu} // ✅ Fix: Close menu on link click
                className="flex items-center justify-between w-full py-4 px-3 rounded-xl active:bg-gray-100 dark:active:bg-gray-800 transition-all">
                <span
                  className={`text-base font-black uppercase italic ${index === siteConfig.navMenuItems.length - 1 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                  {item.label}
                </span>
                <ChevronRight
                  size={18}
                  className="text-gray-300"
                />
              </NextLink>
            )}
          </NavbarMenuItem>
        </div>
      ))}
    </div>
  );
};

export default MobileNavItems;
