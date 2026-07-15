// src/app/explore/[id]/page.tsx

import Link from "next/link";
import { ArrowLeft, MapPin, Star, ShieldAlert, Layers } from "lucide-react";
import { getHotel } from "@/lib/actions/hotel";
import { getPublicRoomDetails, getAllPublicRooms } from "@/lib/actions/room";
import AlternativeRoomsGrid from "@/components/explorepage/AlternativeRoomsGrid";
import BookingSection from "@/components/explorepage/BookingSection";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  totalRooms: number;
  rating: number;
  description?: string;
  imageUrl?: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  pricePerNight?: number;
  isAvailable: boolean;
  amenities?: string[];
  description?: string;
  imageUrl?: string;
  hotelId?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailsWithHotelPage({ params }: PageProps) {
  const resolvedParams = await params;
  const targetId = resolvedParams?.id;

  if (!targetId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500 bg-white dark:bg-neutral-950">
        Missing valid system route identifier path mapping.
      </div>
    );
  }

  let primaryRoomRes = null;
  try {
    primaryRoomRes = await getPublicRoomDetails(targetId);
  } catch (error: any) {
    console.error("Critical Room Engine Context Failure:", error.message);
  }

  if (!primaryRoomRes || !primaryRoomRes.success || !primaryRoomRes.data) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-500 mb-2 inline-flex border border-rose-100 dark:border-rose-900/30">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            Room Details Not Found
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {primaryRoomRes?.error ||
              "Unable to extract specific system accommodation data segments using this dynamic identifier node."}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const rawRoomData = primaryRoomRes.data;
  const primaryRoomsArray = (
    Array.isArray(rawRoomData) ? rawRoomData : [rawRoomData]
  ) as Room[];
  const selectedRoom = primaryRoomsArray[0];
  const targetHotelId = selectedRoom?.hotelId;

  let hotelRes = null;
  let globalRoomsCatalogRes = null;

  if (targetHotelId) {
    try {
      const [hotelData, globalCatalogData] = await Promise.all([
        getHotel(targetHotelId),
        getAllPublicRooms(),
      ]);
      hotelRes = hotelData;
      globalRoomsCatalogRes = globalCatalogData;
    } catch (err: any) {
      console.error("Secondary execution data pull failure:", err.message);
    }
  }

  const hotel = (hotelRes?.success ? hotelRes.data : null) as Hotel | null;
  const catalogPayload = globalRoomsCatalogRes?.data;
  const rawCatalogArray = (
    Array.isArray(catalogPayload) ? catalogPayload : []
  ) as Room[];

  const alternativeRoomsRaw = rawCatalogArray.filter(
    (room) => room.hotelId === targetHotelId && room._id !== selectedRoom._id,
  );

  const formattedAlternativeItems = alternativeRoomsRaw.map((room) => {
    const roomPrice = room.price ?? room.pricePerNight ?? 0;

    return {
      id: room._id,
      hotelId: room.hotelId,
      title: `${room.type} Room`,
      subtitle: hotel ? hotel.name : "Exclusive Hotel Asset",
      tag: roomPrice < 200 ? "Top Value" : "Instant Book",
      quantity: room.description || "Premium Space Allocation Listing",
      price: `$${roomPrice} / night`,
      imageUrl:
        room.imageUrl ||
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
      isFavorite: false,
      author: {
        name: hotel?.location || "Global Destination",
        company: "Verified Property",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      },
    };
  });

  const directSelectedPrice =
    selectedRoom.price ?? selectedRoom.pricePerNight ?? 0;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Explore
        </Link>

        {/* Part 1: Hotel Meta Frame */}
        {hotel && (
          <div className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-500 block mb-1">
                  Managed Property Profile
                </span>
                <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mt-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-xs">{hotel.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-200/60 dark:border-neutral-800 w-fit self-start sm:self-auto">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                    {hotel.rating ? hotel.rating.toFixed(1) : "0.0"}
                  </span>
                </div>
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-400 font-medium">
                  {hotel.totalRooms} Units listed
                </span>
              </div>
            </div>
            {hotel.description && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-200/40 dark:border-neutral-800/40">
                {hotel.description}
              </p>
            )}
          </div>
        )}

        {/* Part 2: Main Focused Room Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            Selected Accommodation Profile
          </h2>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-black text-neutral-800 dark:text-neutral-200">
                Room {selectedRoom.roomNumber}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider">
                {selectedRoom.type}
              </span>
            </div>

            {selectedRoom.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {selectedRoom.description}
              </p>
            )}

            {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 px-2.5 py-1 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Replaced static disabled layout with our fresh interactive modal component */}
            <BookingSection
              roomId={selectedRoom._id}
              pricePerNight={directSelectedPrice}
              roomNumber={selectedRoom.roomNumber}
            />
          </div>
        </div>

        {/* Part 3: Alternative Rooms Matrix */}
        <div className="space-y-4 pt-4">
          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">
              Other Accommodations at this Property
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Filtered inventory matching the shared hotel parameters lookup
              chain.
            </p>
          </div>

          {formattedAlternativeItems.length === 0 ? (
            <p className="text-xs text-neutral-400 italic bg-neutral-50 dark:bg-neutral-900/30 p-4 rounded-xl text-center border border-dashed border-neutral-200 dark:border-neutral-800">
              No alternative structural options mapped inside this specific
              property dataset node.
            </p>
          ) : (
            <AlternativeRoomsGrid items={formattedAlternativeItems} />
          )}
        </div>
      </div>
    </div>
  );
}
