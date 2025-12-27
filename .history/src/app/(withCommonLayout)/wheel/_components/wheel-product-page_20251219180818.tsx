"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import "keen-slider/keen-slider.min.css";
import { BrandDropdown } from "./dropdowns/BrandDropdown";
import { GridViewIcon, ListViewIcon } from "@/src/icons";
import { Search, X } from "lucide-react";
import { useGetWheels } from "@/src/hooks/wheel.hook";
import WheelPagination from "./wheel-pagination";
import WheelNotFound from "./wheel-not-found";
import LoadingWheel from "./loading-wheel";
import ErrorLoadingWheel from "./error-loading-wheel";
import ProductCard from "./wheel-product-card";
import { VehicleInfo } from "@/src/types";
import WheelProductListView from "./wheel-product-list-view";
import { CategoryDropdown } from "./dropdowns/CategoryDropdown";
import { useSearchParams } from "next/navigation";
import { WidthDropdown } from "./dropdowns/WidthDropdown";
import { RatioDropdown } from "./dropdowns/RatioDropdown";
import { DiameterDropdown } from "./dropdowns/DiameterDropdown";
import { Button } from "@heroui/button";

// Debounce hook to fix search keystroke lag
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const WheelProductPage = () => {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");
  const diameter = searchParams.get("diameter");

  const {
    data: Wheels,
    isLoading,
    isError,
  } = useGetWheels({
    brand: brand ?? undefined,
    category: category ?? undefined,
    width: width ?? undefined,
    ratio: ratio ?? undefined,
    diameter: diameter ?? undefined,
  });

  // 1. FIX SEARCH ISSUE: Separate raw input from filtered term
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [selectedRatios, setSelectedRatios] = useState<string[]>([]);
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([]);
  const [filteredWheels, setFilteredWheels] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userVehicles, setUserVehicles] = useState<VehicleInfo[]>([]);

  // Pagination states - Updated to 9 items
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // 2. FIX FILTER LOGIC: Handle nested ObjectIds and debounced search
  useEffect(() => {
    if (!Wheels?.data) return;

    let filtered = Wheels.data.filter((wheel: any) => {
      const matchesSearch =
        (wheel.name?.toLowerCase() || "").includes(
          debouncedSearchTerm.toLowerCase()
        ) ||
        (wheel.description?.toLowerCase() || "").includes(
          debouncedSearchTerm.toLowerCase()
        );

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(wheel.brand?.name || "");
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(wheel.category?.name || "");

      // Fix for nested string values in Sidebar Objects
      const matchesWidth =
        selectedWidths.length === 0 ||
        selectedWidths.includes(wheel.width?.width?.toString() || "");
      const matchesRatio =
        selectedRatios.length === 0 ||
        selectedRatios.includes(wheel.ratio?.ratio?.toString() || "");
      const matchesDiameter =
        selectedDiameters.length === 0 ||
        selectedDiameters.includes(wheel.diameter?.diameter?.toString() || "");

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesWidth &&
        matchesRatio &&
        matchesDiameter
      );
    });

    if (sortOption === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === "price-high")
      filtered.sort((a, b) => b.price - a.price);

    setFilteredWheels(filtered);
    setCurrentPage(1);
  }, [
    Wheels,
    debouncedSearchTerm,
    selectedBrands,
    selectedCategories,
    selectedWidths,
    selectedRatios,
    selectedDiameters,
    sortOption,
  ]);

  // 3. FIX TS SET ERRORS: Use Array.from instead of spread
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          Wheels?.data
            ?.map((w: any) => w.brand?.name)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [Wheels]
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          Wheels?.data
            ?.map((w: any) => w.category?.name)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [Wheels]
  );
  const widths = useMemo(
    () =>
      Array.from(
        new Set(
          Wheels?.data
            ?.map((w: any) => w.width?.width)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [Wheels]
  );
  const ratios = useMemo(
    () =>
      Array.from(
        new Set(
          Wheels?.data
            ?.map((w: any) => w.ratio?.ratio)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [Wheels]
  );
  const diameters = useMemo(
    () =>
      Array.from(
        new Set(
          Wheels?.data
            ?.map((w: any) => w.diameter?.diameter)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [Wheels]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedWidths([]);
    setSelectedRatios([]);
    setSelectedDiameters([]);
  };

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWheels.slice(start, start + itemsPerPage);
  }, [filteredWheels, currentPage]);

  const totalPages = Math.ceil(filteredWheels.length / itemsPerPage);

  const FiltersComponent = () => (
    <div className="h-full overflow-y-auto pb-10">
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wheels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Brands</h3>
          <BrandDropdown
            brands={brands}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Width</h3>
          <WidthDropdown
            widths={widths}
            selectedWidths={selectedWidths}
            setSelectedWidths={setSelectedWidths}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Ratio</h3>
          <RatioDropdown
            ratios={ratios}
            selectedRatios={selectedRatios}
            setSelectedRatios={setSelectedRatios}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Diameter</h3>
          <DiameterDropdown
            diameters={diameters}
            selectedDiameters={selectedDiameters}
            setSelectedDiameters={setSelectedDiameters}
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Seasons</h3>
          <CategoryDropdown
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        <Button
          onPress={clearFilters}
          className="w-full bg-orange-600 text-white font-bold py-6 rounded-xl">
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingWheel />;
  if (isError) return <ErrorLoadingWheel />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent uppercase tracking-tight">
            Premium Wheel Collection
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-orange-600 text-white" : "bg-white border"}`}>
              <GridViewIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-orange-600 text-white" : "bg-white border"}`}>
              <ListViewIcon />
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <div
            className={`fixed lg:relative z-40 inset-y-0 left-0 w-72 bg-white dark:bg-gray-950 border-r transform ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform duration-300 lg:block`}>
            <FiltersComponent />
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500 font-medium tracking-tight">
                Showing{" "}
                <span className="text-orange-600">{filteredWheels.length}</span>{" "}
                high-performance wheels
              </p>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold">
                Open Filters
              </button>
            </div>

            {currentItems.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }>
                {currentItems.map((wheel: any) =>
                  viewMode === "grid" ? (
                    <ProductCard
                      key={wheel._id}
                      wheel={wheel}
                    />
                  ) : (
                    <WheelProductListView
                      key={wheel._id}
                      wheel={wheel}
                    />
                  )
                )}
              </div>
            ) : (
              <WheelNotFound clearFilters={clearFilters} />
            )}

            {filteredWheels.length > 0 && (
              <WheelPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default WheelProductPage;
