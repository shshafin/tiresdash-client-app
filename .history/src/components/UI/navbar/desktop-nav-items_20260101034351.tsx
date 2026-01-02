"use client";

import { useState } from "react";
import { NavbarItem } from "@heroui/navbar";
import NextLink from "next/link";
import { clsx } from "clsx";
import {
  ChevronDown,
  ArrowRight,
  Activity,
  Zap,
  Compass,
  ShieldCheck,
} from "lucide-react";
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

// --- Polished Premium Dropdown Component ---
const SportyDropdown = ({
  sections,
  brands,
}: {
  sections: any[];
  brands?: any[];
}) => {
  return (
    <div className="bg-white dark:bg-[#0f1115] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] p-10 animate-in fade-in slide-in-from-top-4 duration-300 w-[1000px] overflow-hidden relative">
      {/* Decorative Track Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-50" />

      <div className="grid grid-cols-4 gap-12 relative z-10">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] italic flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-orange-600 rounded-full" />
              {section.title}
            </h4>
            <div className="flex flex-col gap-1">
              {section.items.map((item: any, i: number) => (
                <NextLink
                  key={i}
                  href={item.href}
                  className="group flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-600"
                  />
                </NextLink>
              ))}
            </div>
          </div>
        ))}

        {/* Brand Showcase Card */}
        {brands && (
          <div className="col-span-1 bg-gray-50 dark:bg-black/40 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
            <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] italic mb-6">
              Official Brands
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {brands.map((brand: any, i: number) => (
                <NextLink
                  key={i}
                  href={brand.href}
                  className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-orange-600 flex items-center gap-2 transition-colors">
                  <Zap
                    size={10}
                    className="text-orange-500 fill-orange-500"
                  />
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

// --- Desktop Nav Items Main ---
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
                  { name: "Winter Series", href: "/tire?tag=winter" },
                  { name: "Off-Road", href: "/tire?tag=offroad" },
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
                title: "Application",
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
                  { name: "Forged Monoblock", href: "#" },
                  { name: "Multi-Piece", href: "#" },
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
                /* Dropdown Trigger */
                <div
                  className={clsx(
                    "px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer",
                    "text-[11px] font-black uppercase tracking-[0.2em] italic",
                    hoveredItem === item.label
                      ? "bg-gray-100 dark:bg-white/5 text-orange-600"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                /* ✅ Fixed: Proper Link for Non-dropdown items (Fleet, Deals, etc.) */
                <NextLink
                  href={item.href}
                  className={clsx(
                    "px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2",
                    "text-[11px] font-black uppercase tracking-[0.2em] italic",
                    "text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-gray-100 dark:hover:bg-white/5"
                  )}>
                  {item.label}
                </NextLink>
              )}

              {/* Dropdown Content */}
              {item.hasDropdown && hoveredItem === item.label && (
                <div className="absolute left-0 right-0 top-[90px] flex justify-center z-[9999]">
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
