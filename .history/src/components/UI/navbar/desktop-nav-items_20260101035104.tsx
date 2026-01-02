"use client";

import { useState } from "react";
import { NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { clsx } from "clsx";
import { ChevronDown, Zap, Target, Gauge } from "lucide-react";
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
    <div className="bg-white dark:bg-[#0b0d11] border-t-4 border-orange-600 rounded-b-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-10 animate-in fade-in slide-in-from-top-4 duration-300 w-[950px]">
      <div className="grid grid-cols-4 gap-10">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-orange-600 rounded-full skew-x-[-15deg]" />
              <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] italic">
                {section.title}
              </h4>
            </div>
            <div className="flex flex-col gap-1.5">
              {section.items.map((item: any, i: number) => (
                <NextLink
                  key={i}
                  href={item.href}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all">
                    {item.name}
                  </span>
                  <Zap
                    size={10}
                    className="opacity-0 group-hover:opacity-100 text-orange-500 fill-orange-500 transition-all"
                  />
                </NextLink>
              ))}
            </div>
          </div>
        ))}
        {brands && (
          <div className="col-span-1 bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Gauge size={80} />
            </div>
            <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
              <Target size={14} /> Elite Brands
            </h4>
            <div className="grid grid-cols-1 gap-3 relative z-10">
              {brands.map((brand: any, i: number) => (
                <NextLink
                  key={i}
                  href={brand.href}
                  className="text-xs font-black uppercase italic text-gray-400 hover:text-white hover:bg-orange-600 px-3 py-2 rounded-md transition-all inline-block">
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
                title: "By Vehicle Type",
                items: mapData(vtd?.data, "vehicleType", "vehicleType", "tire"),
              },
              {
                title: "By Performance",
                items: mapData(cd?.data, "name", "category", "tire"),
              },
              {
                title: "Specialty Series",
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
                title: "Wheel Styles",
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
                title: "Custom Finish",
                items: [
                  { name: "Gloss Black", href: "#" },
                  { name: "Matte Bronze", href: "#" },
                ],
              },
            ]}
            brands={mapData(bd?.data, "name", "brand", "wheel")}
          />
        );
      case "ACCESSORIES":
        return (
          <div className="bg-white dark:bg-[#0b0d11] p-8 rounded-3xl border-t-4 border-orange-600 shadow-2xl w-[300px] animate-in zoom-in-95 duration-200">
            <h4 className="text-[11px] font-black text-orange-600 italic uppercase tracking-widest mb-4">
              Gear & Protection
            </h4>
            <div className="flex flex-col gap-1">
              {[
                "TPMS Sensors",
                "Torque Wrenches",
                "Wheel Locks",
                "Cleaning Kits",
              ].map((item, i) => (
                <NextLink
                  key={i}
                  href="#"
                  className="py-2 text-sm font-bold text-gray-500 hover:text-orange-600 hover:translate-x-1 transition-all">
                  {item}
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
    <div className="mx-auto flex h-full items-center">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavbarItem
            key={item.href}
            className="static flex items-center h-full">
            <div
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center h-full relative">
              {item.hasDropdown ? (
                <div
                  className={clsx(
                    "px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer",
                    "text-[11px] font-black uppercase tracking-[0.2em] italic",
                    hoveredItem === item.label
                      ? "text-orange-600 bg-orange-50/50 dark:bg-orange-500/10 shadow-inner"
                      : "text-gray-600 dark:text-gray-400 hover:text-orange-600"
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
                  className="px-4 py-2 rounded-xl transition-all duration-300 flex items-center text-[11px] font-black uppercase tracking-[0.2em] italic text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-gray-50/50 dark:hover:bg-orange-500/10">
                  {item.label}
                </NextLink>
              )}

              {/* ✅ পজিশন ফিক্সড: ড্রপডাউন এখন একদম নেভবারের ঠিক নিচ থেকে শুরু হবে */}
              {item.hasDropdown && hoveredItem === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full flex justify-center z-[9999] pt-2">
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
