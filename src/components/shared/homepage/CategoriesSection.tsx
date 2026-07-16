"use client";

import { Compass } from "lucide-react";
import Link from "next/link";

export interface Stay {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  shortDescription: string;
}
import PropertyCard from "@/components/global/PropertyCard";

// Dynamic mock properties matching the 'Stay' interface props perfectly
const FEATURED_STAYS: Stay[] = [
  {
    id: "stay_01",
    title: "The Glass Pavilion Oasis",
    location: "Malibu, California",
    shortDescription: "Wake up to ambient ocean tides and crystal clear shorelines in a masterpiece of glass design.",
    price: 450,
    rating: 4.98,
    category: "Beachfront",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay_02",
    title: "A-Frame Nordic Hideaway",
    location: "Trondheim, Norway",
    shortDescription: "Deep alpine wood retreats featuring personal stone fireplaces, hot tubs, and pure serenity.",
    price: 280,
    rating: 4.92,
    category: "Cabin",
    imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay_03",
    title: "Boho Chic Desert Dwell",
    location: "Joshua Tree, California",
    shortDescription: "High-end luxury structural layouts designed perfectly to optimize majestic evening sunsets.",
    price: 310,
    rating: 4.87,
    category: "Mansion",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay_04",
    title: "Canopy Redwood Hideaway",
    location: "Portland, Oregon",
    shortDescription: "Elevated modern living spaces completely embedded inside historic dense ancient forests.",
    price: 195,
    rating: 4.95,
    category: "Treehouse",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full bg-white py-20 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-3">
              <Compass className="h-3.5 w-3.5" />
              Curated Collections
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Browse by structural ecosystem
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1 group whitespace-nowrap"
          >
            View all categories 
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Categories Grid - Implemented clean 4-column layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_STAYS.map((stay) => (
            <PropertyCard key={stay.id} stay={stay} />
          ))}
        </div>

      </div>
    </section>
  );
}