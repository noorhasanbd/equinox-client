"use client";

import React, { useState } from "react";
import ListingCard from "./ListingCard";

interface AlternativeRoomsGridProps {
  items: any[];
}

export default function AlternativeRoomsGrid({ items }: AlternativeRoomsGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <ListingCard
          key={item.id}
          item={{
            ...item,
            isFavorite: !!favorites[item.id],
          }}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}