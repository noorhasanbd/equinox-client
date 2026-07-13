"use client";

import React, { useState, useMemo } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import FilterSidebar from "@/components/explorepage/FilterSidebar";
import ListingCard from "@/components/explorepage/ListingCard";
import { CategoryTab, ListingItem, FilterState } from "@/types";

const initialListings: ListingItem[] = Array(9).fill(null).map((_, index) => ({
  id: `room-${index}`,
  title: index % 3 === 0 ? "Deluxe King Suite" : index % 3 === 1 ? "Panoramic Ocean Villa" : "Minimalist Penthouse",
  subtitle: index % 2 === 0 ? "Equinox Sanctuary Stays" : "The Meridian Resort",
  tag: index % 3 === 0 ? "Instant Book" : index % 3 === 1 ? "Free Cancellation" : "Top Rated",
  quantity: index % 2 === 0 ? "2 Guests · 1 King Bed" : "4 Guests · 2 Queen Beds",
  price: index % 3 === 0 ? "$180 / night" : index % 3 === 1 ? "$320 / night" : "$250 / night",
  imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
  isFavorite: false,
  author: {
    name: index % 2 === 0 ? "Sarah Jenkins" : "Marcus Vance",
    company: index % 2 === 0 ? "Property Manager" : "Resort Concierge",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  }
}));

const categories: CategoryTab[] = [
  { id: "all-stays", label: "All Stays", count: 4820 },
  { id: "villas", label: "Luxury Villas", count: 1240 },
  { id: "suites", label: "Boutique Suites", count: 890 },
];

const initialFilterState: FilterState = {
  bookingType: "all",
  bedConfig: "all",
  minPrice: "",
  maxPrice: "",
};

export default function ExplorePage() {
  const [listings, setListings] = useState<ListingItem[]>(initialListings);
  const [activeTab, setActiveTab] = useState("all-stays");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const handleToggleFavorite = (id: string) => {
    setListings(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  // Memoized Functional Filter Execution Layer
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBookingType = filters.bookingType === "all" || item.tag === "Instant Book";
      const matchesBed = filters.bedConfig === "all" || item.quantity.includes(filters.bedConfig);

      // Parse "$180 / night" to 180 securely
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
      const matchesMinPrice = !filters.minPrice || numericPrice >= parseInt(filters.minPrice, 10);
      const matchesMaxPrice = !filters.maxPrice || numericPrice <= parseInt(filters.maxPrice, 10);

      // Tab Category Switch Simulation
      const matchesTab = activeTab === "all-stays" || 
        (activeTab === "villas" && item.title.includes("Villa")) ||
        (activeTab === "suites" && item.title.includes("Suite"));

      return matchesSearch && matchesBookingType && matchesBed && matchesMinPrice && matchesMaxPrice && matchesTab;
    });
  }, [listings, searchQuery, filters, activeTab]);

  return (
    <div className="w-full min-h-screen bg-neutral-50/50 flex flex-col justify-between">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow space-y-6">
        <nav className="text-xs text-neutral-400 font-medium flex gap-1.5 items-center">
          <span className="hover:text-neutral-600 cursor-pointer">Home</span>
          <span>/</span>
          <span className="text-neutral-800">Explore Stays</span>
        </nav>

        <section className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-2 gap-4">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Explore Stays</h1>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-8 px-4 text-xs font-bold rounded-full transition-all ${
                  activeTab === tab.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 border border-neutral-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={handleResetFilters} />

          <div className="flex-grow w-full space-y-6">
            <div className="relative w-full flex items-center">
              <HiOutlineSearch className="absolute left-4 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search accommodations, villas or boutique suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 text-xs font-medium rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-indigo-600 transition-all text-neutral-800 shadow-sm"
              />
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map(item => (
                  <ListingCard key={item.id} item={item} onToggleFavorite={handleToggleFavorite} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-neutral-200 rounded-2xl bg-white max-w-xl mx-auto">
                <p className="text-xs font-bold text-neutral-400">No rooms match your active filter criteria.</p>
                <button onClick={handleResetFilters} className="mt-3 text-xs font-bold text-indigo-600 underline">Reset all parameters</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}