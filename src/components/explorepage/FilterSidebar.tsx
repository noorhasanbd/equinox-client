// @/components/explorepage/FilterSidebar.tsx
import React from "react";
import { FilterState } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export default function FilterSidebar({ filters, setFilters, onReset }: FilterSidebarProps) {
  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <aside className="w-full flex-shrink-0 space-y-6">
      {/* Sidebar Header Block */}
      <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-black text-neutral-900 dark:text-white tracking-tight">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-neutral-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Booking Framework Segment */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Booking Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleInputChange("bookingType", "all")}
            className={`h-9 text-xs font-bold rounded-xl border transition-all ${
              filters.bookingType === "all"
                ? "border-indigo-600 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : ""
            }`}
          >
            All Rooms
          </button>
          <button
            type="button"
            onClick={() => handleInputChange("bookingType", "instant")}
            className={`h-9 text-xs font-bold rounded-xl border transition-all ${
              filters.bookingType === "instant"
                ? "border-indigo-600 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : ""
            }`}
          >
            Instant Book
          </button>
        </div>
      </div>

      {/* Suite Specifications Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Bed Configuration</label>
        <select
          value={filters.bedConfig}
          onChange={(e) => handleInputChange("bedConfig", e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-700 focus:outline-none focus:border-indigo-500 font-medium transition-colors [color-scheme:light] dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:[color-scheme:dark]"
        >
          <option value="all" className="bg-white text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">All Bed Types</option>
          <option value="1 King Bed" className="bg-white text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">1 King Bed</option>
          <option value="2 Queen Beds" className="bg-white text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">2 Queen Beds</option>
          <option value="1 Queen Bed" className="bg-white text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">1 Queen Bed</option>
        </select>
      </div>

      {/* Price Boundary Matrix */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Price Per Night</label>
        <div className="space-y-2">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-neutral-400 dark:text-neutral-600">$</span>
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-neutral-200 bg-red-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600"
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-neutral-400 dark:text-neutral-600">$</span>
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}