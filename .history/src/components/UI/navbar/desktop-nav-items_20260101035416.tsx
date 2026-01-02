"use client";

import { useState } from "react";
import { NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { clsx } from "clsx";
import { ChevronDown, Zap, Target, Gauge, ChevronRight } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";

// --- Data Mapper Helper ---
const mapData = (data: any[], key: string, queryParam: string, path: string) =>
  data?.map((item) => ({
    id: item._id,
    name: item[key] || item.name || "",
    href: `/${path}?${queryParam}=${item._id}`,
  })) || [];

const SportyDropdown = ({
  sections,
  brands,
}: {
  sections: any[];
  brands?: any[];
}) => {
  return (
    <div className="bg-white dark:bg-[#0b0d11] border-t-4 border-orange-600 rounded-b-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] p-10 animate-in fade-in slide-in-from-top-4 duration-300 w-[1000px] border-x border-b hover:border-gray-100 dark:border-white/5">
      <div className="grid grid-cols-4 gap-12">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="space-y-6">
            <div className="flex items-center gap-2 group/title">
              <div className="h-4 w-1 bg-orange-600 rounded-full skew-x-[-15deg] group-hover/title:h-6 transition-all" />
              <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] italic">
                {section.title}
              </h4>
            </div>
            <div className="flex flex-col gap-2">
              {section.items.map((item: any, i: number) => (
                <NextLink
                  key={i}
                  href={item.href}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all">
                    {item.name}
                  </span>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 text-orange-500 transition-all"
                  />
                </NextLink>
              ))}
            </div>
          </div>
        ))}
        {brands && (
          <div className="col-span-1 bg-gray-900 dark:bg-black/40 rounded-[2rem] p-8 border border-gray-800 relative overflow-hidden group/brand">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover/brand:scale-110 transition-transform text-white">
              <Gauge size={120} />
            </div>
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] italic mb-8 flex items-center gap-2">
              <Target size={14} /> ELITE SERIES
            </h4>
            <div className="grid grid-cols-1 gap-3 relative z-10">
              {brands.map((brand: any, i: number) => (
                <NextLink
                  key={i}
                  href={brand.href}
                  className="text-[11px] font-black uppercase italic text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                  <div className="h-1 w-0 group-hover:w-3 bg-orange-600 transition-all rounded-full" />
                  {brand.name}
                </NextLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DeskTopNavItems = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { data: bd } = useGetBrands({ limit: 6 });
  const { data: cd } = useGetCategories({ limit: 6 });
  const { data: vtd } = useGetVehicleTypes({ limit: 6 });
  const { data: wwt } = useGetWheelWidthTypes({ limit: 6 });

  const navItems = siteConfig.navItems.filter(
    (item) => item.label !== "VISUALIZER"
  );

  const renderDropdown = (label: string) => {
    switch (label) {
      case "TIRES":
        return (
          <SportyDropdown
            sections={[
              {
                title: "Vehicle Fits",
                items: mapData(vtd?.data, "vehicleType", "vehicleType", "tire"),
              },
              {
                title: "Performance",
                items: mapData(cd?.data, "name", "category", "tire"),
              },
              {
                title: "Specialty",
                items: [
                  { name: "Run Flat", href: "#" },
                  { name: "Off-Road", href: "#" },
                ],
              },
            ]}
            brands={mapData(bd?.data, "name", "brand", "tire")}
          />
        );
      case "WHEELS":
        return (
          <SportyDropdown
            sections={[
              {
                title: "Main Styles",
                items: mapData(wwt?.data, "widthType", "widthType", "wheel"),
              },
              {
                title: "Fitment Guides",
                items: mapData(
                  vtd?.data,
                  "vehicleType",
                  "vehicleType",
                  "wheel"
                ),
              },
              {
                title: "Finish",
                items: [
                  { name: "Gloss Black", href: "#" },
                  { name: "Matte Bronze", href: "#" },
                ],
              },
            ]}
            brands={mapData(bd?.data, "name", "brand", "wheel")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex h-full items-center">
      <ul className="flex items-center gap-2">
        {navItems.map((item) => (
          <NavbarItem
            key={item.href}
            className="static flex items-center h-full">
            <div
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center h-full relative group/nav">
              {item.hasDropdown ? (
                <div
                  className={clsx(
                    "px-5 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer border border-transparent",
                    "text-[11px] font-black uppercase tracking-[0.15em] italic",
                    hoveredItem === item.label
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-900/30 shadow-[0_5px_15px_rgba(249,115,22,0.1)]"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/5"
                  )}>
                  {item.label}
                  <ChevronDown
                    className={clsx(
                      "h-3 w-3 transition-transform duration-500",
                      hoveredItem === item.label && "rotate-180"
                    )}
                  />
                </div>
              ) : (
                <NextLink
                  href={item.href}
                  className="px-5 py-2 rounded-xl transition-all duration-300 flex items-center text-[11px] font-black uppercase tracking-[0.15em] italic text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:text-orange-600 hover:border-orange-200 dark:hover:border-orange-900/30 hover:shadow-lg hover:shadow-orange-500/10">
                  {item.label}
                </NextLink>
              )}

              {/* Decorative active line under the button */}
              <div
                className={clsx(
                  "absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-orange-600 transition-all duration-300 rounded-full",
                  hoveredItem === item.label
                    ? "w-1/2 opacity-100"
                    : "w-0 opacity-0"
                )}
              />

              {item.hasDropdown && hoveredItem === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full flex justify-center z-[9999] pt-3">
                  <div onMouseEnter={() => setHoveredItem(item.label)}>
                    {renderDropdown(item.label)}
                  </div>
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
