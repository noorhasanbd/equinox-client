// src/app/explore/[id]/page.tsx
"use client"
import Link from "next/link";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { getPublicRoomDetails } from "@/lib/actions/room";
import { getHotels } from "@/lib/actions/hotel";

interface Room {
  _id: string;
  hotelId: string;
  type: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface Hotel {
  _id: string;
  name: string;
  location: string;
  rating: number;
  // ownerId intentionally not read/rendered here — this is a public page.
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id, "Room ID from params");

  // Fetch the room and the hotel list in parallel — same join pattern
  // the explore grid already uses (room.hotelId -> hotel._id)
  const [roomRes, hotelsRes] = await Promise.all([
    getPublicRoomDetails(id),
    getHotels(),
  ]);

  console.log(roomRes, "Room response");

  if (!roomRes.success || !roomRes.data) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400 mb-2 inline-flex">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Listing not found</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {roomRes.success ? "This listing may have been removed or the link is incorrect." : roomRes.error}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const room = roomRes.data as Room;
  console.log(room, "Room data")
  const hotels = (hotelsRes.success ? hotelsRes.data : []) as Hotel[];
  const hotel = hotels.find((h) => h._id === room.hotelId);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Explore
        </Link>

        {/* Hero Image */}
        <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-900">
          <img
            src={room.imageUrl || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"}
            alt={room.type}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {room.price < 200 ? "Top Value" : "Instant Book"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                {room.type} Room
              </h1>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mt-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {hotel ? `${hotel.name} · ${hotel.location}` : "Exclusive Hotel Asset"}
                </span>
              </div>
            </div>

            {room.description && (
              <div className="space-y-2 py-4 border-y border-neutral-100 dark:border-neutral-800">
                <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">About this room</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}

            {hotel && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">Property</h2>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{hotel.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{hotel.location}</p>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm space-y-4">
              <div>
                <span className="text-2xl font-black text-neutral-900 dark:text-white">${room.price}</span>
                <span className="text-xs text-neutral-400"> / night</span>
              </div>
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wide transition-colors"
              >
                Check Availability
              </button>
              <p className="text-[11px] text-neutral-400 text-center">You won't be charged yet</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}