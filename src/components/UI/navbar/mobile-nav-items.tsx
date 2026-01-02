"use client";

import { useState } from "react";
import { NavbarMenuItem } from "@heroui/navbar";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Ruler,
  Layers,
  ShieldCheck,
  Settings,
  CreditCard,
  Activity,
} from "lucide-react";
import NextLink from "next/link";
import { siteConfig } from "@/src/config/site";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";

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
          <div className="flex items-center justify-center gap-1.5">
            {tab.icon && <tab.icon size={12} />}
            {tab.title}
          </div>
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
                    className="text-orange-600"
                  />
                </div>
              </NextLink>
            ))}
          </div>
        ))}
    </div>
  </div>
);

const MobileNavItems = ({ closeMenu }: { closeMenu: () => void }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState("vehicle");

  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: cd } = useGetCategories({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });
  const { data: tsd } = useGetTyreSizes({});
  const { data: wwt } = useGetWheelWidthTypes({ limit: 6 });

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const renderDropdownContent = (label: string) => {
    if (label === "TIRES") {
      const tabs = [
        {
          id: "vehicle",
          title: "Vehicle",
          icon: Activity,
          content:
            vtd?.data?.map((v: any) => ({
              name: v.vehicleType,
              href: `/tire?vehicleType=${v._id}`,
            })) || [],
        },
        {
          id: "size",
          title: "Size",
          icon: Ruler,
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
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
          closeMenu={closeMenu}
        />
      );
    }

    if (label === "WHEELS") {
      const tabs = [
        {
          id: "style",
          title: "Style",
          icon: LayoutGrid,
          content:
            wwt?.data?.map((w: any) => ({
              name: w.widthType,
              href: `/wheel?widthType=${w._id}`,
            })) || [],
        },
        {
          id: "brand",
          title: "Brand",
          icon: ShieldCheck,
          content:
            bd?.data?.map((b: any) => ({
              name: b.name,
              href: `/wheel?brand=${b._id}`,
            })) || [],
        },
      ];
      return (
        <MobileTabContent
          tabs={tabs}
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
          closeMenu={closeMenu}
        />
      );
    }

    if (label === "ACCESSORIES") {
      const tabs = [
        {
          id: "acc",
          title: "Gear",
          icon: Settings,
          content: [
            { name: "Tire Monitors", href: "/accessories/tire/tpms" },
            { name: "Tools", href: "/accessories/tools/gauges" },
          ],
        },
      ];
      return (
        <MobileTabContent
          tabs={tabs}
          activeTab="acc"
          setActiveTab={() => {}}
          closeMenu={closeMenu}
        />
      );
    }

    if (label === "FINANCING") {
      const tabs = [
        {
          id: "fin",
          title: "Plans",
          icon: CreditCard,
          content: [
            { name: "0% APR", href: "/financing/zero-apr" },
            { name: "No Credit Check", href: "/financing/no-credit-check" },
          ],
        },
      ];
      return (
        <MobileTabContent
          tabs={tabs}
          activeTab="fin"
          setActiveTab={() => {}}
          closeMenu={closeMenu}
        />
      );
    }

    return null;
  };

  return (
    <div className="w-full space-y-1">
      {siteConfig.navMenuItems
        .filter((i) => i.label !== "VISUALIZER")
        .map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <NavbarMenuItem>
              {item.hasDropdown ? (
                <div className="w-full">
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`flex items-center justify-between w-full py-4 px-3 rounded-xl transition-all ${expandedItems.includes(item.label) ? "bg-orange-50 dark:bg-orange-950/10" : ""}`}>
                    <span
                      className={`text-base font-black uppercase italic ${expandedItems.includes(item.label) ? "text-orange-600" : "text-gray-900 dark:text-white"}`}>
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`transition-transform duration-300 ${expandedItems.includes(item.label) ? "rotate-180 text-orange-600" : ""}`}
                    />
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="mt-2 animate-in slide-in-from-top-2">
                      {renderDropdownContent(item.label)}
                    </div>
                  )}
                </div>
              ) : (
                <NextLink
                  href={item.href}
                  onClick={closeMenu}
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
