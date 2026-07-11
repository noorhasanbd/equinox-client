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
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
        <h2 className="text-sm font-black text-neutral-800 tracking-tight">Filters</h2>
        <button 
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-neutral-400 hover:text-indigo-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Booking Framework Segment */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Booking Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => handleInputChange("bookingType", "all")}
            className={`h-9 text-xs font-bold rounded-xl border-2 transition-all ${
              filters.bookingType === "all" 
                ? "border-indigo-600 bg-indigo-600/5 text-indigo-700" 
                : "border-neutral-200 bg-white text-neutral-600"
            }`}
          >
            All Rooms
          </button>
          <button 
            type="button"
            onClick={() => handleInputChange("bookingType", "instant")}
            className={`h-9 text-xs font-bold rounded-xl border-2 transition-all ${
              filters.bookingType === "instant" 
                ? "border-indigo-600 bg-indigo-600/5 text-indigo-700" 
                : "border-neutral-200 bg-white text-neutral-600"
            }`}
          >
            Instant Book
          </button>
        </div>
      </div>

      {/* Suite Specifications Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Bed Configuration</label>
        <select 
          value={filters.bedConfig}
          onChange={(e) => handleInputChange("bedConfig", e.target.value)}
          className="w-full h-10 px-3 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-indigo-600 text-neutral-700 font-medium"
        >
          <option value="all">All Bed Types</option>
          <option value="1 King Bed">1 King Bed</option>
          <option value="2 Queen Beds">2 Queen Beds</option>
          <option value="1 Queen Bed">1 Queen Bed</option>
        </select>
      </div>

      {/* Price Boundary Matrix */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Price Per Night</label>
        <div className="space-y-2">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-neutral-400">$</span>
            <input 
              type="number" 
              placeholder="Min price" 
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-indigo-600 text-neutral-800" 
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-neutral-400">$</span>
            <input 
              type="number" 
              placeholder="Max price" 
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="w-full h-10 pl-7 pr-3 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-indigo-600 text-neutral-800" 
            />
          </div>
        </div>
      </div>
    </aside>
  );
}