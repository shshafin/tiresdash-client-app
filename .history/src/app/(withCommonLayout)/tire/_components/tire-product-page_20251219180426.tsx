"use client";

import { useGetTires } from "@/src/hooks/tire.hook";
import { useState, useEffect, useRef, useMemo } from "react";
import "keen-slider/keen-slider.min.css";
import { BrandDropdown } from "./dropdowns/BrandDropdown";
import LoadingTire from "./loading-tire";
import ErrorLoadingTire from "./error-loading-tire";
import ProductCard from "./tire-product-card";
import { GridViewIcon, ListViewIcon } from "@/src/icons";
import TireNotFound from "./tire-not-found";
import TirePagination from "./tire-pagination";
import { Search, X } from "lucide-react";
import ProductCardList from "./product-list-view";
import { VehicleInfo } from "@/src/types";
import { CategoryDropdown } from "./dropdowns/CategoryDropdown";
import { useSearchParams } from "next/navigation";
import { WidthDropdown } from "./dropdowns/WidthDropdown";
import { RatioDropdown } from "./dropdowns/RatioDropdown";
import { DiameterDropdown } from "./dropdowns/DiameterDropdown";

// Simple debounce hook to fix the search keystroke issue
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const TireProductPage = () => {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const tireSize = searchParams.get("tireSize");
  const vehicleType = searchParams.get("vehicleType");
  const drivingType = searchParams.get("drivingType");
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");
  const diameter = searchParams.get("diameter");

  const {
    data: Tires,
    isLoading,
    isError,
  } = useGetTires({
    brand: brand ?? undefined,
    category: category ?? undefined,
    tireSize: tireSize ?? undefined,
    vehicleType: vehicleType ?? undefined,
    drivingType: drivingType ?? undefined,
    width: width ?? undefined,
    ratio: ratio ?? undefined,
    diameter: diameter ?? undefined,
  });

  // 1. FIX SEARCH ISSUE: Separate raw input from filtered term
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([]);
  const [selectedDrivingTypes, setSelectedDrivingTypes] = useState<string[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [selectedRatios, setSelectedRatios] = useState<string[]>([]);
  const [selectedDiameters, setSelectedDiameters] = useState<string[]>([]);

  const [filteredTires, setFilteredTires] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userVehicles, setUserVehicles] = useState<VehicleInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Total pages
  const totalPages = Math.ceil(filteredTires.length / itemsPerPage);

  // Load user vehicles
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVehicles = localStorage.getItem("userVehicles");
      if (savedVehicles) {
        const parsed = JSON.parse(savedVehicles);
        setUserVehicles(Array.isArray(parsed) ? parsed : [parsed]);
      }
    }
  }, []);

  // Responsiveness
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // 2. FIX FILTER LOGIC: Added proper handling for nested ObjectIds (Width, Ratio, Diameter)
  useEffect(() => {
    if (!Tires?.data) return;

    let filtered = Tires.data.filter((tire: any) => {
      // Search filter using DEBOUNCED term
      const matchesSearch =
        (tire.name?.toLowerCase() || "").includes(
          debouncedSearchTerm.toLowerCase()
        ) ||
        (tire.description?.toLowerCase() || "").includes(
          debouncedSearchTerm.toLowerCase()
        );

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(tire.brand?.name || "");
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(tire.category?.name || "");
      const matchesDrivingType =
        selectedDrivingTypes.length === 0 ||
        selectedDrivingTypes.includes(tire.drivingType?.title || "");
      const matchesModel =
        selectedModels.length === 0 ||
        selectedModels.includes(tire.model?.model || "");
      const matchesYear =
        selectedYears.length === 0 ||
        selectedYears.includes(tire.year?.year?.toString() || "");

      // Nested ObjectId Logic: Match based on the string value inside the objects
      const matchesWidth =
        selectedWidths.length === 0 ||
        selectedWidths.includes(tire.width?.width?.toString() || "");
      const matchesRatio =
        selectedRatios.length === 0 ||
        selectedRatios.includes(tire.ratio?.ratio?.toString() || "");
      const matchesDiameter =
        selectedDiameters.length === 0 ||
        selectedDiameters.includes(tire.diameter?.diameter?.toString() || "");

      let matchesUserVehicle = true;
      if (userVehicles.length > 0) {
        matchesUserVehicle = userVehicles.some(
          (v) => !v.model || v.model === (tire.model?.model || "")
        );
      }

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesCategory &&
        matchesDrivingType &&
        matchesModel &&
        matchesWidth &&
        matchesRatio &&
        matchesDiameter &&
        matchesUserVehicle
      );
    });

    // Sort logic
    if (sortOption === "price-low")
      filtered.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
    else if (sortOption === "price-high")
      filtered.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));

    setFilteredTires(filtered);
    setCurrentPage(1); // Reset page when filters change
  }, [
    Tires,
    debouncedSearchTerm,
    selectedBrands,
    selectedYears,
    selectedModels,
    selectedDrivingTypes,
    selectedCategories,
    selectedWidths,
    selectedRatios,
    selectedDiameters,
    sortOption,
    userVehicles,
  ]);

  // Sidebar dynamic extraction
  // Extracting unique values for Sidebar
  const widths = useMemo(
    () =>
      Array.from(
        new Set(Tires?.data?.map((t: any) => t.width?.width).filter(Boolean))
      ).sort(),
    [Tires]
  );

  const ratios = useMemo(
    () =>
      Array.from(
        new Set(Tires?.data?.map((t: any) => t.ratio?.ratio).filter(Boolean))
      ).sort(),
    [Tires]
  );

  const diameters = useMemo(
    () =>
      Array.from(
        new Set(
          Tires?.data?.map((t: any) => t.diameter?.diameter).filter(Boolean)
        )
      ).sort(),
    [Tires]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(Tires?.data?.map((t: any) => t.brand?.name).filter(Boolean))
      ).sort(),
    [Tires]
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(Tires?.data?.map((t: any) => t.category?.name).filter(Boolean))
      ).sort(),
    [Tires]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedWidths([]);
    setSelectedRatios([]);
    setSelectedDiameters([]);
    setSelectedModels([]);
    setSelectedYears([]);
  };

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTires.slice(start, start + itemsPerPage);
  }, [filteredTires, currentPage]);

  const FiltersComponent = () => (
    <div className="h-full overflow-y-auto pb-10">
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Search
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )}
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

        <button
          onClick={clearFilters}
          className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-medium">
          Reset Filters
        </button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingTire />;
  if (isError) return <ErrorLoadingTire />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Premium Tire Collection
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-orange-600 text-white" : "bg-white border"}`}>
              <GridViewIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-orange-600 text-white" : "bg-white border"}`}>
              <ListViewIcon />
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <div
            className={`fixed lg:relative z-40 inset-y-0 left-0 w-72 lg:w-full bg-white dark:bg-gray-900 transform ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform duration-300 border-r lg:block`}>
            <FiltersComponent />
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm">
                Showing <b>{filteredTires.length}</b> products
              </p>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 border rounded-lg">
                Filters
              </button>
            </div>

            {currentItems.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }>
                {currentItems.map((tire: any) =>
                  viewMode === "grid" ? (
                    <ProductCard
                      key={tire._id}
                      tire={tire}
                    />
                  ) : (
                    <ProductCardList
                      key={tire._id}
                      tire={tire}
                    />
                  )
                )}
              </div>
            ) : (
              <TireNotFound clearFilters={clearFilters} />
            )}

            {filteredTires.length > 0 && (
              <TirePagination
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default TireProductPage;
