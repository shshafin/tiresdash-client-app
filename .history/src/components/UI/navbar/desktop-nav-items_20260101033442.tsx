"use client";

import { useState } from "react";
import { NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { clsx } from "clsx";
import { ChevronDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/src/config/site";

// --- Types & Data Mappers ---
const mapData = (data: any[], key: string, queryParam: string, path: string) =>
  data?.map((item) => ({
    id: item._id,
    name: item[key] || item.name || "",
    href: `/${path}?${queryParam}=${item._id}`,
  })) || [];

// --- Shared Reusable Dropdown Component ---
const UniversalDropdown = ({
  tabs,
  brands,
  activeTab,
  setActiveTab,
  width = "900px",
}: any) => {
  const activeTabData = tabs.find((t: any) => t.id === activeTab);

  return (
    <div
      className={clsx(
        "bg-white dark:bg-[#0f1115] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300",
        `w-[${width}]`
      )}
      style={{ width }}>
      <div className="grid grid-cols-4 gap-8">
        {/* Left Side: Navigation Tabs */}
        <div className="space-y-2 border-r border-gray-100 dark:border-gray-800 pr-6">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "block w-full text-left text-[11px] font-black tracking-widest uppercase px-4 py-3 rounded-xl transition-all",
                activeTab === tab.id
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900"
              )}>
              {tab.title}
            </button>
          ))}
        </div>

        {/* Right Side: Content Grid */}
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-8">
            {activeTabData?.sections.map((section: any, idx: number) => (
              <div
                key={idx}
                className="space-y-4">
                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] italic border-b border-orange-100 dark:border-orange-900/30 pb-2">
                  {section.title}
                </h4>
                <div className="flex flex-col gap-2">
                  {section.items.map((item: any, i: number) => (
                    <NextLink
                      key={i}
                      href={item.href}
                      className="group flex items-center justify-between text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {item.name}
                      <ArrowRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-orange-500"
                      />
                    </NextLink>
                  ))}
                </div>
              </div>
            ))}

            {/* Always show Brands if available for specific tabs */}
            {brands && (
              <div className="space-y-4 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                  Top Brands
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {brands.map((brand: any, i: number) => (
                    <NextLink
                      key={i}
                      href={brand.href}
                      className="text-xs font-black uppercase italic text-gray-500 hover:text-orange-600 transition-colors">
                      {brand.name}
                    </NextLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Dropdown Logic Handlers ---
const TireDropdown = () => {
  const [activeTab, setActiveTab] = useState("vehicle");
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: cd } = useGetCategories({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });

  const tabs = [
    {
      id: "vehicle",
      title: "By Vehicle",
      sections: [
        {
          title: "Vehicle Type",
          items: mapData(vtd?.data, "vehicleType", "vehicleType", "tire"),
        },
        {
          title: "Performance",
          items: mapData(cd?.data, "name", "category", "tire"),
        },
      ],
    },
  ];

  return (
    <UniversalDropdown
      tabs={tabs}
      brands={mapData(bd?.data, "name", "brand", "tire")}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

const WheelDropdown = () => {
  const [activeTab, setActiveTab] = useState("shop");
  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: wwt } = useGetWheelWidthTypes({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });

  const tabs = [
    {
      id: "shop",
      title: "Shop Wheels",
      sections: [
        {
          title: "Wheel Style",
          items: mapData(wwt?.data, "widthType", "widthType", "wheel"),
        },
        {
          title: "Vehicle Fits",
          items: mapData(vtd?.data, "vehicleType", "vehicleType", "wheel"),
        },
      ],
    },
  ];

  return (
    <UniversalDropdown
      tabs={tabs}
      brands={mapData(bd?.data, "name", "brand", "wheel")}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

// --- Main Navigation Component ---
const DeskTopNavItems = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Hard filter out VISUALIZER at data level
  const navItems = siteConfig.navItems.filter(
    (item) => item.label !== "VISUALIZER"
  );

  const renderDropdown = (label: string) => {
    switch (label) {
      case "TIRES":
        return <TireDropdown />;
      case "WHEELS":
        return <WheelDropdown />;
      case "ACCESSORIES":
        return (
          <div className="bg-white dark:bg-[#0f1115] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl w-[250px] animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-orange-600 mb-4 tracking-widest italic uppercase">
              Performance Gear
            </p>
            {["Tire Monitors", "Tools", "Jack Stands"].map((item, i) => (
              <NextLink
                key={i}
                href="#"
                className="block py-2 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                {item}
              </NextLink>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavbarItem
            key={item.href}
            className="relative py-4">
            <div
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group">
              <div
                className={clsx(
                  "px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer",
                  "text-[11px] font-black uppercase tracking-[0.15em] italic",
                  hoveredItem === item.label
                    ? "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}>
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown
                    className={clsx(
                      "h-3 w-3 transition-transform duration-300",
                      hoveredItem === item.label && "rotate-180 text-orange-600"
                    )}
                  />
                )}
              </div>

              {item.hasDropdown && hoveredItem === item.label && (
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 pt-4 z-50">
                  {renderDropdown(item.label)}
                </div>
              )}
            </div>
          </NavbarItem>
        ))}
      </ul>
    </div>
  );
};

export default DeskTopNavItems;
