"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import FilterSidebar from "@/components/explorepage/FilterSidebar";
import ListingCard from "@/components/explorepage/ListingCard";
import { getAllPublicRooms } from "@/lib/actions/room";
import { getHotels } from "@/lib/actions/hotel";
import { CategoryTab, ListingItem, FilterState } from "@/types";

const categories: CategoryTab[] = [
  { id: "all-stays", label: "All Stays", count: 0 },
  { id: "Standard", label: "Standard Rooms", count: 0 },
  { id: "Deluxe", label: "Deluxe Suites", count: 0 },
  { id: "Executive", label: "Executive Rooms", count: 0 },
  { id: "Presidential", label: "Presidential Villas", count: 0 },
];

const initialFilterState: FilterState = {
  bookingType: "all",
  bedConfig: "all",
  minPrice: "",
  maxPrice: "",
};

export default function ExplorePage() {
  // DB Inventory States
  const [rawRooms, setRawRooms] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI Navigation states
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all-hotels");
  const [activeTab, setActiveTab] = useState("all-stays");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // 1. Data Fetch Sync with debug logging
  useEffect(() => {
    async function loadExploreData() {
      try {
        setLoading(true);
        setError(null);

        const [roomsRes, hotelsRes] = await Promise.all([
          getAllPublicRooms(),
          getHotels(),
        ]);

        // --- DEBUG LOGGER FOR SERVER RESPONSES ---
        console.log("=== EXPLORE DATA FETCH MATRIX ===");
        console.log("Rooms Server Action Payload:", roomsRes);
        console.log("Hotels Server Action Payload:", hotelsRes);

        if (!roomsRes.success)
          throw new Error(roomsRes.error || "Failed loading inventory.");
        if (!hotelsRes.success)
          throw new Error(hotelsRes.error || "Failed loading properties.");

        setRawRooms(roomsRes.data || []);
        setHotels(hotelsRes.data || []);
      } catch (err: any) {
        console.error("CRITICAL EXPLORE FETCH CATCHED ERROR:", err);
        setError(err.message || "An error occurred while loading content.");
      } finally {
        setLoading(false);
      }
    }
    loadExploreData();
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setSearchQuery("");
  };

  // 2. Structural Data Grid Transformation & Active Layer Matrix Evaluation
  const filteredListings = useMemo<any[]>(() => {
    const hotelMap = new Map(hotels.map((h) => [h._id, h]));

    // --- DEBUG LOGGER FOR COMPONENT INVENTORY STATE ---
    console.log("=== MEMO PIPELINE CHECK ===");
    console.log("Raw Rooms In State Array:", rawRooms);
    console.log("Hotels In State Map Structure:", hotels);

    return rawRooms
      .filter((room) => {
        const parentHotel = hotelMap.get(room.hotelId);

        // A. Property Selection Matrix Constraint
        if (
          selectedHotelId !== "all-hotels" &&
          room.hotelId !== selectedHotelId
        )
          return false;

        // B. Top Category Pills Filter (Fallback Lowercase check)
        if (
          activeTab !== "all-stays" && 
          room.type?.toLowerCase() !== activeTab.toLowerCase()
        ) 
          return false;

        // C. Input Search Fields Evaluation
        const matchesSearch =
          (room.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (parentHotel &&
            (parentHotel.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;

        // D. Sidebar: Booking Type Toggle Evaluation
        if (filters.bookingType === "instant") {
          const isInstant = room.price >= 200;
          if (!isInstant) return false;
        }

        // E. Sidebar: Bed Configurations Text Parser Scan
        if (filters.bedConfig !== "all") {
          const description = room.description || "";
          if (
            !description.toLowerCase().includes(filters.bedConfig.toLowerCase())
          )
            return false;
        }

        // F. Sidebar: Price Threshold Boundings Evaluator
        if (filters.minPrice && room.price < parseInt(filters.minPrice, 10))
          return false;
        if (filters.maxPrice && room.price > parseInt(filters.maxPrice, 10))
          return false;

        return true;
      })
      .map((room) => {
        const parentHotel = hotelMap.get(room.hotelId);
        return {
          id: room._id,
          hotelId: room.hotelId,
          title: `${room.type} Room`,
          subtitle: parentHotel ? parentHotel.name : "Exclusive Hotel Asset",
          tag: room.price < 200 ? "Top Value" : "Instant Book",
          quantity: room.description || "Premium Space Allocation Listing",
          price: `$${room.price} / night`,
          imageUrl:
            room.imageUrl ||
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
          isFavorite: !!favorites[room._id],
          author: {
            name: parentHotel?.location || "Global Destination",
            company: "Verified Property",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          },
        };
      });
  }, [
    rawRooms,
    hotels,
    selectedHotelId,
    activeTab,
    searchQuery,
    filters,
    favorites,
  ]);

  // Dynamic Room Tab Aggregation Counts
  const computedCategories = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      count:
        cat.id === "all-stays"
          ? rawRooms.filter(
              (r) =>
                selectedHotelId === "all-hotels" ||
                r.hotelId === selectedHotelId,
            ).length
          : rawRooms.filter(
              (r) =>
                (selectedHotelId === "all-hotels" ||
                  r.hotelId === selectedHotelId) &&
                (r.type || "").toLowerCase() === cat.id.toLowerCase(),
            ).length,
    }));
  }, [rawRooms, selectedHotelId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
          LOADING SECURE INVENTORY...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col justify-between selection:bg-indigo-500/30">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-grow space-y-6">
        {/* Navigation Breadcrumbs */}
        <nav className="text-xs text-neutral-500 dark:text-neutral-500 font-medium flex gap-1.5 items-center">
          <span className="hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors">
            Home
          </span>
          <span>/</span>
          <span className="text-neutral-800 dark:text-neutral-300">
            Explore Stays
          </span>
        </nav>

        {/* Section Header & Type Switcher */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              Explore Available Stays
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Verified public room assets across our global boutique network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {computedCategories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-8 px-4 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md shadow-neutral-950/5 dark:shadow-white/5"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* HOTEL-WISE PROPERTY SELECTION MATRIX */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm transition-colors dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Filter By Property Location
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedHotelId("all-hotels");
                setActiveTab("all-stays");
              }}
              className={`h-8 px-4 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 border ${
                selectedHotelId === "all-hotels"
                  ? "bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white"
                  : "bg-transparent text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600 dark:hover:text-white"
              }`}
            >
              <span>All Hotels</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                  selectedHotelId === "all-hotels"
                    ? "bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {rawRooms.length}
              </span>
            </button>

            {hotels.map((hotel) => {
              const roomsCount = rawRooms.filter(
                (r) => r.hotelId === hotel._id,
              ).length;
              const isSelected = selectedHotelId === hotel._id;

              return (
                <button
                  key={hotel._id}
                  onClick={() => {
                    setSelectedHotelId(hotel._id);
                    setActiveTab("all-stays");
                  }}
                  className={`h-8 px-4 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white"
                      : "bg-transparent text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600 dark:hover:text-white"
                  }`}
                >
                  <span>{hotel.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? "bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {roomsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Layout Framework Grid */}
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm text-neutral-800 dark:text-neutral-200">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          <div className="flex-grow w-full space-y-6">
            <div className="relative w-full flex items-center">
              <HiOutlineSearch className="absolute left-4 text-neutral-400 dark:text-neutral-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search specific rooms, styles, or structural keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 text-xs font-medium rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 transition-all shadow-inner dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
              />
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/40 max-w-xl mx-auto">
                <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                  No active rooms found under the current parameter options.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline transition-colors"
                >
                  Clear Matrix Options
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}