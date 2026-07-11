import React from "react";
import { FaHeart, FaRegHeart, FaEllipsisH } from "react-icons/fa";
import { ListingItem } from "@/types";

interface ListingCardProps {
  item: ListingItem;
  onToggleFavorite: (id: string) => void;
}

export default function ListingCard({ item, onToggleFavorite }: ListingCardProps) {
  const tagStyles = {
    "Instant Book": "bg-emerald-500 text-white",
    "Free Cancellation": "bg-sky-500 text-white",
    "Top Rated": "bg-purple-600 text-white"
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${tagStyles[item.tag]}`}>
          {item.tag}
        </span>
        <button 
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md text-neutral-600 hover:text-red-500 rounded-full transition-colors shadow-sm"
        >
          {item.isFavorite ? <FaHeart className="text-red-500 h-3.5 w-3.5" /> : <FaRegHeart className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 leading-tight">{item.title}</h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">{item.subtitle}</p>
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 transition-colors pt-1">
              <FaEllipsisH className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-neutral-100">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Capacity</span>
              <span className="text-xs font-bold text-neutral-800">{item.quantity}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium uppercase tracking-wider">Rate</span>
              <span className="text-xs font-black text-neutral-900">{item.price}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2.5">
          <img src={item.author.avatarUrl} alt={item.author.name} className="h-7 w-7 rounded-full object-cover bg-neutral-200 border border-neutral-100" />
          <div className="min-w-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-tight">Host Manager</span>
            <p className="text-xs font-bold text-neutral-800 truncate leading-none mt-0.5">{item.author.name}</p>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">{item.author.company}</p>
          </div>
        </div>
      </div>
    </div>
  );
}