"use client";

import { motion } from "framer-motion";
import { MapPin, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";


interface PropertyCardProps {
  stay: Stay;
}
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

export default function PropertyCard({ stay }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/5 dark:border-neutral-800/60 dark:bg-neutral-900"
    >
      {/* Dynamic Image Studio Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {/* Category Overlay Pill */}
        <div className="absolute top-3 left-3 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 backdrop-blur-md dark:bg-neutral-800/90 dark:text-neutral-200">
          {stay.category}
        </div>

        {/* Dynamic Price floating sticker */}
        <div className="absolute bottom-3 right-3 z-20 rounded-xl bg-neutral-900/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md dark:bg-neutral-800/80">
          <span className="text-sm font-extrabold text-indigo-500 dark:text-indigo-400">${stay.price}</span>
          <span className="text-[10px] font-normal text-neutral-300 dark:text-neutral-400"> / night</span>
        </div>

        {/* Visual Media Element */}
        <img
          src={stay.imageUrl}
          alt={stay.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Meta Content Frame */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Geo Location & Star Rating Wrapper */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="truncate max-w-[150px]">{stay.location}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-amber-50/60 px-1.5 py-0.5 font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{stay.rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Structural Text Details */}
        <h3 className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-indigo-600 transition-colors dark:text-neutral-100 dark:group-hover:text-indigo-400">
          {stay.title}
        </h3>
        
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 line-clamp-2 dark:text-neutral-400 flex-1">
          {stay.shortDescription}
        </p>

        {/* Action Button Segment */}
        <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
          <Link
            href={`/items/${stay.id}`}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-50 px-4 text-xs font-semibold text-neutral-700 transition-all group-hover:bg-indigo-600 group-hover:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:bg-indigo-500 dark:group-hover:text-white"
          >
            View Details
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}