"use client";

import { useState } from "react";
import { NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { clsx } from "clsx";
import { ChevronDown, ArrowRight, Zap, Target } from "lucide-react";
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

// --- Polished Sporty Dropdown (No Tab Style) ---
const SportyDropdown = ({
  sections,
  brands,
}: {
  sections: any[];
  brands?: any[];
}) => {
  return (
    <div className="bg-white dark:bg-[#0b0d11] border-t-4 border-orange-600 rounded-b-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] p-10 animate-in fade-in slide-in-from-top-4 duration-300 w-[1000px]">
      <div className="grid grid-cols-4 gap-10">
        {/* Dynamic Sections */}
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
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  {/* Text color changed to Dark Grey/Black as requested */}
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-all">
                    {item.name}
                  </span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-orange-600 transition-all"
                  />
                </NextLink>
              ))}
            </div>
          </div>
        ))}

        {/* Brands Column */}
        {brands && (
          <div className="col-span-1 bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5">
            <h4 className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
              <Target size={14} /> ELITE BRANDS
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {brands.map((brand: any, i: number) => (
                <NextLink
                  key={i}
                  href={brand.href}
                  className="text-[11px] font-black uppercase italic text-gray-500 hover:text-white hover:bg-orange-600 px-3 py-2 rounded-lg transition-all flex items-center justify-between group">
                  {brand.name}
                  <Zap
                    size={10}
                    className="opacity-0 group-hover:opacity-100 fill-white"
                  />
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

  // Hooks
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
                title: "Vehicle Application",
                items: mapData(vtd?.data, "vehicleType", "vehicleType", "tire"),
              },
              {
                title: "Performance Category",
                items: mapData(cd?.data, "name", "category", "tire"),
              },
              {
                title: "Terrain Type",
                items: [
                  { name: "Mud-Terrain", href: "#" },
                  { name: "All-Season", href: "#" },
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
              // ✅ Fixed: Ensure widthType key matches your hook data
              {
                title: "Main Styles",
                items: mapData(wwt?.data, "widthType", "widthType", "wheel"),
              },
              {
                title: "Fitment Guide",
                items: mapData(
                  vtd?.data,
                  "vehicleType",
                  "vehicleType",
                  "wheel"
                ),
              },
              {
                title: "Construction",
                items: [
                  { name: "Forged", href: "#" },
                  { name: "Cast Aluminum", href: "#" },
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
    <div className="mx-auto">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavbarItem
            key={item.label}
            className="static">
            <div
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="py-6">
              {item.hasDropdown ? (
                <div
                  className={clsx(
                    "px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer",
                    "text-[11px] font-black uppercase tracking-[0.2em] italic",
                    hoveredItem === item.label
                      ? "text-orange-600 bg-gray-100 dark:bg-white/5 shadow-inner"
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
                  className="px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center text-[11px] font-black uppercase tracking-[0.2em] italic text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-gray-100 dark:hover:bg-white/5">
                  {item.label}
                </NextLink>
              )}

              {item.hasDropdown && hoveredItem === item.label && (
                <div className="absolute left-0 right-0 top-[85px] flex justify-center z-[9999]">
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
