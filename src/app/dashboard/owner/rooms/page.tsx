"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  Tooltip,
  Modal,
  useOverlayState,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Spinner,
} from "@heroui/react";
import {
  DoorOpen,
  Plus,
  Bed,
  DollarSign,
  Layers,
  Eye,
  Pencil,
  Trash2,
  Building,
  Search,
  SlidersHorizontal,
} from "lucide-react";
// Import room actions and hotel lists
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRooms,
} from "@/lib/actions/room";
import { getHotels } from "@/lib/actions/hotel";

interface Hotel {
  _id: string;
  name: string;
  ownerId: string;
}

interface Room {
  _id: string;
  hotelId: string;
  hotelName?: string; // Optional helper mapping
  roomNumber: string;
  type: string; // e.g., Deluxe, Suite, Standard
  price: number;
  description?: string;
  imageUrl?: string;
}

export default function OwnerRoomsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const state = useOverlayState();

  // State Inventory management
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Form State matching Schema requirements
  const [newRoom, setNewRoom] = useState({
    hotelId: "",
    roomNumber: "",
    type: "Standard",
    price: "",
    description: "",
    imageUrl: "",
  });

  // Fetch hotels and rooms data concurrently
  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      const [hotelsRes, roomsRes] = await Promise.all([
        getHotels(),
        getRooms(),
      ]);

      if (!hotelsRes.success)
        throw new Error(hotelsRes.error || "Failed to load hotels.");
      if (!roomsRes.success)
        throw new Error(roomsRes.error || "Failed to load inventory.");

      // 1. Filter out properties belonging to the logged-in merchant
      const activeOwnerHotels = (hotelsRes.data || []).filter(
        (h: Hotel) => h.ownerId === user.id,
      );
      setHotels(activeOwnerHotels);

      // Create a fast-lookup map for hotel ids -> names
      const hotelMap = new Map(
        activeOwnerHotels.map((h: Hotel) => [h._id, h.name]),
      );

      // 2. Filter out rooms belonging to the merchant's hotels only
      if (roomsRes.data) {
        const ownerRooms = roomsRes.data
          .filter((r: Room) => hotelMap.has(r.hotelId))
          .map((r: Room) => ({
            ...r,
            hotelName: hotelMap.get(r.hotelId) || "Unknown Asset Listing",
          }));
        setRooms(ownerRooms);
      }
    } catch (err: any) {
      setError(err.message || "Failed to pull inventory data arrays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  // Clean form allocations cleanly when modal visibility resets
  useEffect(() => {
    if (!state.isOpen) {
      setEditingId(null);
      setNewRoom({
        hotelId: "",
        roomNumber: "",
        type: "Standard",
        price: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [state.isOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setNewRoom({
      hotelId: hotels[0]?._id || "", // Default select first hotel parameter context if available
      roomNumber: "",
      type: "Standard",
      price: "",
      description: "",
      imageUrl: "",
    });
    state.open();
  };

  const openEditModal = (room: Room) => {
    setEditingId(room._id);
    setNewRoom({
      hotelId: room.hotelId,
      roomNumber: room.roomNumber,
      type: room.type,
      price: String(room.price),
      description: room.description || "",
      imageUrl: room.imageUrl || "",
    });
    state.open();
  };

  const handleSubmit = async (close: () => void) => {
    if (
      !newRoom.hotelId ||
      !newRoom.roomNumber ||
      !newRoom.price ||
      !newRoom.type
    ) {
      setError("Please fill out all required room metrics configurations.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const cleanPayload = {
        hotelId: newRoom.hotelId,
        roomNumber: String(newRoom.roomNumber).trim(),
        type: String(newRoom.type).trim(),
        price: Number(newRoom.price),
        description: newRoom.description
          ? String(newRoom.description).trim()
          : undefined,
        imageUrl: newRoom.imageUrl
          ? String(newRoom.imageUrl).trim()
          : undefined,
      };

      if (editingId) {
        const result = await updateRoom(editingId, cleanPayload);
        if (!result.success)
          throw new Error(result.error || "Execution error modifying record.");
      } else {
        const result = await createRoom(cleanPayload);
        if (!result.success)
          throw new Error(result.error || "Execution error spawning record.");
      }

      await loadData();
      close();
    } catch (err: any) {
      setError(
        err.message || "Failed to finalize database tracking mutations.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this room asset inventory allocation?",
      )
    )
      return;
    try {
      const result = await deleteRoom(id);
      if (!result.success) throw new Error(result.error);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to remove inventory trace.");
    }
  };

  // Dynamic filter and search sorting compute block
  const filteredAndSortedRooms = useMemo(() => {
    let result = [...rooms];

    // 1. Filter by Hotel Property Selection
    if (selectedHotelId !== "all") {
      result = result.filter((room) => room.hotelId === selectedHotelId);
    }

    // 2. Filter by Text Input (Room #, Type or Hotel Name)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (room) =>
          room.roomNumber.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query) ||
          (room.hotelName && room.hotelName.toLowerCase().includes(query)),
      );
    }

    // 3. Sort Order Implementation
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
        default:
          return b._id.localeCompare(a._id);
      }
    });

    return result;
  }, [rooms, searchQuery, selectedHotelId, sortBy]);

  return (
    <div className="space-y-6">
      {/* ACTION HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Room Inventory Allocations
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Assign structures, monitor baseline nightly rates, and append new
            hotel rooms.
          </p>
        </div>

        <Button
          onPress={openCreateModal}
          disabled={hotels.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/10 h-10 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Property Room
        </Button>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      {rooms.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Text Query Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by room #, tier, or hotel name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block shrink-0" />

            {/* Filter by Hotel Listing Option */}
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="h-10 w-full sm:w-[180px] bg-white border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-xs text-slate-900 px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="all" className="text-slate-900 bg-white">
                All Properties
              </option>
              {hotels.map((h) => (
                <option
                  key={h._id}
                  value={h._id}
                  className="text-slate-900 bg-white"
                >
                  {h.name}
                </option>
              ))}
            </select>

            {/* Sort Dropdown option */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 w-full sm:w-[180px] bg-white border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-xs text-slate-900 px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="newest" className="text-slate-900 bg-white">
                Sort by: Newest
              </option>
              <option value="price-low" className="text-slate-900 bg-white">
                Price: Low to High
              </option>
              <option value="price-high" className="text-slate-900 bg-white">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      )}

      {/* ERROR LISTENER */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* RENDER GRID CONTROLS */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Spinner label="Assembling room maps..." />
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/10">
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 mb-4">
            <DoorOpen className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No rooms configured
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
            {hotels.length === 0
              ? "You must register at least one hotel asset before configuring individual inventory spaces."
              : "No units have been allocated yet. Push an element trace configuration onto your dashboard to initialize properties."}
          </p>
          {hotels.length > 0 && (
            <Button
              onPress={openCreateModal}
              variant="secondary"
              size="sm"
              className="font-medium rounded-lg"
            >
              Initialize First Room
            </Button>
          )}
        </div>
      ) : filteredAndSortedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/10">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No rooms matched
          </p>
          <p className="text-xs text-slate-400 mt-1">
            We couldn't find any listings matching your active filters. Try
            adjustments or clear the search input.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedRooms.map((room) => (
            <Card
              key={room._id}
              className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Render Banner */}
              <div className="h-36 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                {room.imageUrl ? (
                  <img
                    src={room.imageUrl}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30">
                    <DoorOpen className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg font-bold text-xs">
                  {room.type}
                </div>
              </div>

              {/* Data Content Matrix */}
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <Building className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[200px]">
                      {room.hotelName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Room Assignment #{room.roomNumber}
                  </h3>
                  {room.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic pt-0.5">
                      "{room.description}"
                    </p>
                  )}
                </div>

                {/* Metrics Breakdown row */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 opacity-75 text-indigo-500" />
                    <span>Unit Placement Block</span>
                  </div>
                  <div className="flex items-center font-bold text-slate-900 dark:text-white text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
                    <span>{room.price}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal text-xxs ml-0.5">
                      /night
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BOTTOM ROW FOOTER */}
              <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end gap-1">
                <Tooltip delay={500} closeDelay={0}>
                  <Tooltip.Trigger>
                    <Link
                      href={`/dashboard/owner/my-rooms/${room._id}`}
                      className={
                        buttonVariants({ variant: "ghost", size: "sm" }) +
                        " w-8 h-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Inspect Unit</Tooltip.Content>
                </Tooltip>

                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-blue-500"
                  onPress={() => openEditModal(room)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-red-500"
                  onPress={() => handleDelete(room._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* POPUP ENTRY OVERLAY MODAL */}
      <Modal state={state}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="md">
            <Modal.Dialog className="border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-2xl">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />
                  <Modal.Header className="border-b border-slate-100 dark:border-slate-800/50">
                    <Modal.Heading className="font-bold text-sm uppercase tracking-wider text-slate-500">
                      {editingId
                        ? "Modify Room Metrics"
                        : "Register New Property Room"}
                    </Modal.Heading>
                  </Modal.Header>

                  <Modal.Body className="py-6 space-y-4">
                    {/* HOTEL SPECIFIC PARENT ALLOCATION LINK DROPDOWN */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Target Hotel Property Listing
                      </Label>
                      <select
                        value={newRoom.hotelId}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, hotelId: e.target.value })
                        }
                        disabled={!!editingId}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 h-10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all"
                      >
                        {hotels.map((h) => (
                          <option key={h._id} value={h._id}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <TextField name="roomNumber" isRequired>
                      <Label>Room / Suite Identifier Number</Label>
                      <Input
                        placeholder="e.g. 304-B"
                        value={newRoom.roomNumber}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, roomNumber: e.target.value })
                        }
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Room Tier Classification Type
                      </Label>
                      <select
                        value={newRoom.type}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, type: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 h-10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="Standard">Standard Luxury Unit</option>
                        <option value="Deluxe">Deluxe Premium Suite</option>
                        <option value="Executive">
                          Executive Panoramic Suite
                        </option>
                        <option value="Presidential">
                          Presidential Penthouse Sanctuary
                        </option>
                      </select>
                    </div>

                    <TextField name="price" type="number" isRequired>
                      <Label>Baseline Price / Night (USD)</Label>
                      <Input
                        placeholder="120"
                        min="1"
                        value={newRoom.price}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, price: e.target.value })
                        }
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="imageUrl" type="url">
                      <Label>Unit Visual Image URL Reference</Label>
                      <Input
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newRoom.imageUrl}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, imageUrl: e.target.value })
                        }
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="description">
                      <Label>Interior Spatial Description</Label>
                      <TextArea
                        placeholder="State distinct structural variables (e.g. King Bed size, beachfront glass layouts)..."
                        value={newRoom.description}
                        onChange={(e) =>
                          setNewRoom({
                            ...newRoom,
                            description: e.target.value,
                          })
                        }
                        variant="secondary"
                        className="rounded-xl"
                        rows={3}
                      />
                      <FieldError />
                    </TextField>
                  </Modal.Body>

                  <Modal.Footer className="border-t border-slate-100 dark:border-slate-800/50">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="font-medium rounded-lg"
                      onPress={close}
                    >
                      Discard Allocation
                    </Button>
                    <Button
                      className="bg-indigo-600 text-white font-semibold text-xs tracking-wide rounded-lg px-4 shadow-sm"
                      size="sm"
                      isPending={submitting}
                      onPress={() => handleSubmit(close)}
                    >
                      {({ isPending }) => (
                        <>
                          {isPending && <Spinner size="sm" color="current" />}
                          {isPending
                            ? editingId
                              ? "Updating Unit..."
                              : "Injecting Unit..."
                            : editingId
                              ? "Save Room Mapping"
                              : "Commit Unit Asset"}
                        </>
                      )}
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
