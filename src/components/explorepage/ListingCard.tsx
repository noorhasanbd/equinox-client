// @/components/explorepage/ListingCard.tsx
import React from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaEllipsisH } from "react-icons/fa";
import { ListingItem } from "@/types";

interface ListingCardProps {
  item: ListingItem;
  onToggleFavorite: (id: string) => void;
}

export default function ListingCard({ item, onToggleFavorite }: ListingCardProps) {
  // Theme-aware dynamic styles for tags
  const tagStyles: Record<string, string> = {
    "Instant Book": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    "Free Cancellation": "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
    "Top Rated": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    "Top Value": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-md dark:shadow-xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700/60 transition-all flex flex-col h-[340px] w-full max-w-sm mx-auto">
      {/* Image Block */}
      <div className="relative h-40 w-full bg-neutral-100 dark:bg-neutral-950 flex-shrink-0">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${tagStyles[item.tag] || 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
          {item.tag}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-neutral-950/60 backdrop-blur-md text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors border border-neutral-200 dark:border-neutral-800/80 shadow-sm"
        >
          {item.isFavorite ? <FaHeart className="text-red-500 h-3.5 w-3.5" /> : <FaRegHeart className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Content Space */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="flex flex-col h-full justify-between">
          {/* Header Row */}
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight truncate">{item.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5 truncate">{item.subtitle}</p>
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors flex-shrink-0 pt-0.5">
              <FaEllipsisH className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Feature Set: Two metrics block columns */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="min-w-0">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-bold uppercase tracking-wider">Configuration</span>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate block mt-0.5">{item.quantity}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-bold uppercase tracking-wider">Rate</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">{item.price}</span>
            </div>
          </div>

          {/* Detail Link */}
          <Link
            href={`/explore/${item.id}`}
            className="w-full mt-3 py-2 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-colors border border-neutral-200/50 dark:border-neutral-700/50 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}