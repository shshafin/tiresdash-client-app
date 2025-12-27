// "use client";

// import { useGetTires } from "@/src/hooks/tire.hook";
// import { useState, useEffect, useRef, useMemo } from "react";
// import "keen-slider/keen-slider.min.css";
// import { BrandDropdown } from "./dropdowns/BrandDropdown";
// import LoadingTire from "./loading-tire";
// import ErrorLoadingTire from "./error-loading-tire";
// import ProductCard from "./tire-product-card";
// import { GridViewIcon, ListViewIcon } from "@/src/icons";
// import TireNotFound from "./tire-not-found";
// import TirePagination from "./tire-pagination";
// import { Search, X } from "lucide-react";
// import ProductCardList from "./product-list-view";
// import { VehicleInfo } from "@/src/types";
// import { CategoryDropdown } from "./dropdowns/CategoryDropdown";
// import { useSearchParams } from "next/navigation";
// import { WidthDropdown } from "./dropdowns/WidthDropdown";
// import { RatioDropdown } from "./dropdowns/RatioDropdown";
// import { DiameterDropdown } from "./dropdowns/DiameterDropdown";

"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useGetTires } from "@/src/hooks/deals.hook"; // Ensure correct hook import
import { useDebounce } from "@/src/hooks/useDebounce"; // You might need to create this simple hook

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

  // 1. FIX SEARCH LAG: Separate Input state and Filter state
  const [searchInput, setSearchInput] = useState("");
  // Use a debounced value so the filtering doesn't trigger on every single keystroke
  const debouncedSearch = useDebounce(searchInput, 300); 

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTrims, setSelectedTrims] = useState<string[]>([]);
  const [selectedDrivingTypes, setSelectedDrivingTypes] = useState<string[]>([]);
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 2. FIX FILTER LOGIC: Ensure nested properties (Width/Ratio/Diameter) are checked
  useEffect(() => {
    if (!Tires?.data) return;

    let filtered = Tires.data.filter((tire: any) => {
      // Search filter using debounced value
      const matchesSearch =
        (tire.name?.toLowerCase() || "").includes(debouncedSearch.toLowerCase()) ||
        (tire.description?.toLowerCase() || "").includes(debouncedSearch.toLowerCase());

      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(tire.brand?.name || "");
      const matchesMake = selectedMakes.length === 0 || selectedMakes.includes(tire.make?.make || "");
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(tire.category?.name || "");
      const matchesDrivingType = selectedDrivingTypes.length === 0 || selectedDrivingTypes.includes(tire.drivingType?.title || "");
      const matchesTrim = selectedTrims.length === 0 || selectedTrims.includes(tire.trim?.trim || "");
      const matchesModel = selectedModels.length === 0 || selectedModels.includes(tire.model?.model || "");
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(tire.year?.year?.toString() || "");

      // FIX Width/Ratio/Diameter Filters
      const matchesWidth = selectedWidths.length === 0 || selectedWidths.includes(tire.width?.width?.toString() || "");
      const matchesRatio = selectedRatios.length === 0 || selectedRatios.includes(tire.ratio?.ratio?.toString() || "");
      const matchesDiameter = selectedDiameters.length === 0 || selectedDiameters.includes(tire.diameter?.diameter?.toString() || "");

      return (
        matchesSearch &&
        matchesBrand &&
        matchesYear &&
        matchesMake &&
        matchesTrim &&
        matchesDrivingType &&
        matchesModel &&
        matchesCategory &&
        matchesWidth &&
        matchesRatio &&
        matchesDiameter
      );
    });

    // Sorting
    if (sortOption === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredTires(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [
    Tires,
    debouncedSearch, // Use debounced search instead of raw searchInput
    selectedBrands,
    selectedYears,
    selectedMakes,
    selectedModels,
    selectedTrims,
    selectedDrivingTypes,
    selectedCategories,
    selectedWidths,
    selectedRatios,
    selectedDiameters,
    sortOption,
  ]);

  // Extracting unique values for Sidebar
  const widths = useMemo(() => {
    return [...new Set(Tires?.data?.map((t: any) => t.width?.width).filter(Boolean))].sort();
  }, [Tires]);

  const ratios = useMemo(() => {
    return [...new Set(Tires?.data?.map((t: any) => t.ratio?.ratio).filter(Boolean))].sort();
  }, [Tires]);

  const diameters = useMemo(() => {
    return [...new Set(Tires?.data?.map((t: any) => t.diameter?.diameter).filter(Boolean))].sort();
  }, [Tires]);

  const toggleWidth = (val: string) => {
    setSelectedWidths(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };
  const toggleRatio = (val: string) => {
    setSelectedRatios(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };
  const toggleDiameter = (val: string) => {
    setSelectedDiameters(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedBrands([]);
    setSelectedMakes([]);
    setSelectedModels([]);
    setSelectedYears([]);
    setSelectedWidths([]);
    setSelectedRatios([]);
    setSelectedDiameters([]);
    // ... clear others
  };

  // Sidebar Component with fixed search
  const FiltersComponent = () => (
    <div className="h-full overflow-y-auto pb-20">
      <div className="space-y-8 p-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tires..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} // Fixed keystroke issue
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border rounded-xl"
            />
          </div>
        </div>

        {/* Widths */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Width</h3>
          <div className="flex flex-wrap gap-2">
            {widths.map((w: any) => (
              <button
                key={w}
                onClick={() => toggleWidth(w.toString())}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  selectedWidths.includes(w.toString()) ? "bg-orange-500 text-white" : "bg-gray-100"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Ratios */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Ratio</h3>
          <div className="flex flex-wrap gap-2">
            {ratios.map((r: any) => (
              <button
                key={r}
                onClick={() => toggleRatio(r.toString())}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  selectedRatios.includes(r.toString()) ? "bg-orange-500 text-white" : "bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Diameters */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Diameter</h3>
          <div className="flex flex-wrap gap-2">
            {diameters.map((d: any) => (
              <button
                key={d}
                onClick={() => toggleDiameter(d.toString())}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  selectedDiameters.includes(d.toString()) ? "bg-orange-500 text-white" : "bg-gray-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={clearFilters} className="w-full bg-orange-600 text-white mt-4">
          Reset All
        </Button>
      </div>
    </div>
  );

  // Pagination Slice
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTires.slice(start, start + itemsPerPage);
  }, [filteredTires, currentPage]);

  const totalPages = Math.ceil(filteredTires.length / itemsPerPage);

  // Mobile Handling
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      {/* Header logic ... */}
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Sidebar wrapper */}
        <aside className={`fixed lg:relative z-50 lg:z-0 inset-y-0 left-0 w-72 bg-white transition-transform ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
             <FiltersComponent />
        </aside>

        <main>
          {/* Active Filters Bar ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentItems.map((tire: any) => (
              <ProductCard key={tire._id} tire={tire} />
            ))}
          </div>
          {/* Pagination Component ... */}
        </main>
      </div>
    </div>
  );
};

export default TireProductPage;
