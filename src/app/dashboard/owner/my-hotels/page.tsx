"use client";

import React, { useState, useEffect } from "react";
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
  Building2,
  Plus,
  MapPin,
  BedDouble,
  Star,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
// Import Server Actions directly
import { createHotel, updateHotel, deleteHotel, getHotels } from "@/lib/actions/hotel";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  totalRooms: number;
  rating: number;
  ownerId: string;
  description?: string;
  imageUrl?: string;
}

export default function OwnerHotelsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // v2 useDisclosure() -> v3 useOverlayState()
  const state = useOverlayState();

  // Real property inventory, loaded from the database
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null = creating a new hotel; a hotel's _id = editing that hotel
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for adding/editing a hotel property
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    totalRooms: "",
    description: "",
    imageUrl: "",
  });

  // 1. Fetch hotels from database via the Server Action
  const loadHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getHotels();
      if (!res.success) {
        throw new Error(res.error || "Failed to load properties.");
      }

      // Filter properties owned by the logged-in merchant
      if (res.data) {
        setHotels(res.data.filter((h: Hotel) => h.ownerId === user?.id));
        
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadHotels();
    }
  }, [user?.id]);

  // Reset the form + editing mode whenever the modal closes, however it closes
  // (Abort button, X button, backdrop click, Escape key, or a successful submit)
  useEffect(() => {
    if (!state.isOpen) {
      setEditingId(null);
      setNewHotel({ name: "", location: "", totalRooms: "", description: "", imageUrl: "" });
    }
  }, [state.isOpen]);

  const openCreateModal = () => {
    setEditingId(null);
    setNewHotel({ name: "", location: "", totalRooms: "", description: "", imageUrl: "" });
    state.open();
  };

  const openEditModal = (hotel: Hotel) => {
    setEditingId(hotel._id);
    setNewHotel({
      name: hotel.name,
      location: hotel.location,
      totalRooms: String(hotel.totalRooms),
      description: hotel.description || "",
      imageUrl: hotel.imageUrl || "",
    });
    state.open();
  };

  // 2. Create or Update, depending on whether we're editing an existing hotel
  const handleSubmit = async (close: () => void) => {
    if (!newHotel.name || !newHotel.location || !newHotel.totalRooms) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        const result = await updateHotel(editingId, {
          name: newHotel.name,
          location: newHotel.location,
          totalRooms: Number(newHotel.totalRooms),
          description: newHotel.description || undefined,
          imageUrl: newHotel.imageUrl || undefined,
        });

        if (!result.success) {
          throw new Error(result.error || "Something went wrong.");
        }
      } else {
        if (!user?.id) {
          throw new Error("You must be signed in to register a property.");
        }

        const result = await createHotel({
          name: newHotel.name,
          location: newHotel.location,
          totalRooms: Number(newHotel.totalRooms),
          rating: 5, // Default rating for new properties
          ownerId: user.id,
          description: newHotel.description || undefined,
          imageUrl: newHotel.imageUrl || undefined,
        });

        if (!result.success) {
          throw new Error(result.error || "Something went wrong.");
        }
      }

      await loadHotels();
      close();
    } catch (err: any) {
      setError(err.message || (editingId ? "Failed to update property." : "Failed to register property."));
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Hotel using the Server Action
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this property listing?")) return;

    try {
      const result = await deleteHotel(id);
      if (!result.success) throw new Error(result.error);
      loadHotels(); // Refresh on success
    } catch (err: any) {
      setError(err.message || "Failed to delete hotel.");
    }
  };
console.log(hotels);
  return (
    <div className="space-y-6">

      {/* HEADER ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Hotel Portfolios</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Welcome back, {user?.name || "Owner"}. Manage your real estate listings below.
          </p>
        </div>

        <Button
          onPress={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/10 h-10 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Register New Hotel
        </Button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* PROPERTY VIEW GRID */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Spinner label="Loading your properties..." />
        </div>
      ) : hotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/10">
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No properties active</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
            You haven't listed any sanctuaries yet. Onboard your primary asset location to begin tracking room reservations.
          </p>
          <Button onPress={openCreateModal} variant="secondary" size="sm" className="font-medium rounded-lg">
            Initialize First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((hotel) => (
            <Card
              key={hotel._id}
              className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Property Image Cover */}
              <div className="h-36 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                {hotel.imageUrl ? (
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30">
                    <Building2 className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Core Hotel Meta info */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs truncate">{hotel.location}</span>
                  </div>
                  {hotel.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic pt-1">
                      "{hotel.description}"
                    </p>
                  )}
                </div>

                {/* Performance Metric Counters */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 opacity-75 text-indigo-500" />
                    <span>{hotel.totalRooms} Rooms</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{hotel.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* ACTION TOOLBAR FOOTER */}
              <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end gap-1">
                <Tooltip delay={500} closeDelay={0}>
                  <Tooltip.Trigger>
                    <Link
                      href={`/dashboard/owner/my-hotels/${hotel._id}`}
                      className={
                        buttonVariants({ variant: "ghost", size: "sm" }) +
                        " w-8 h-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Live View</Tooltip.Content>
                </Tooltip>
                <Tooltip delay={500} closeDelay={0}>
                  <Tooltip.Trigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-blue-500"
                      onPress={() => openEditModal(hotel)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Modify Settings</Tooltip.Content>
                </Tooltip>
                <Tooltip delay={500} closeDelay={0}>
                  <Tooltip.Trigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-500"
                      onPress={() => handleDelete(hotel._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Decommission Property</Tooltip.Content>
                </Tooltip>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* CREATE NEW PROPERTY MODAL */}
      <Modal state={state}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="md">
            <Modal.Dialog className="border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-2xl">
              {({ close }) => (
                <>
                  <Modal.CloseTrigger />
                  <Modal.Header className="border-b border-slate-100 dark:border-slate-800/50">
                    <Modal.Heading className="font-bold text-sm uppercase tracking-wider text-slate-500">
                      {editingId ? "Update Property Details" : "Property Registration Parameters"}
                    </Modal.Heading>
                  </Modal.Header>

                  <Modal.Body className="py-6 space-y-4">
                    <TextField name="name" isRequired>
                      <Label>Hotel Brand Title</Label>
                      <Input
                        placeholder="e.g. Equinox Ridge Lodge"
                        value={newHotel.name}
                        onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="location" isRequired>
                      <Label>Geographic Location Signature</Label>
                      <Input
                        placeholder="e.g. Kyoto, Higashiyama District"
                        value={newHotel.location}
                        onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="totalRooms" type="number" isRequired>
                      <Label>Total Initial Room Inventory</Label>
                      <Input
                        placeholder="0"
                        min="1"
                        value={newHotel.totalRooms}
                        onChange={(e) => setNewHotel({ ...newHotel, totalRooms: e.target.value })}
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="imageUrl" type="url">
                      <Label>Photo Image URL</Label>
                      <Input
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newHotel.imageUrl}
                        onChange={(e) => setNewHotel({ ...newHotel, imageUrl: e.target.value })}
                        variant="secondary"
                        className="rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="description">
                      <Label>Description</Label>
                      <TextArea
                        placeholder="Describe your premium property amenities..."
                        value={newHotel.description}
                        onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                        variant="secondary"
                        className="rounded-xl"
                        rows={3}
                      />
                      <FieldError />
                    </TextField>
                  </Modal.Body>

                  <Modal.Footer className="border-t border-slate-100 dark:border-slate-800/50">
                    <Button variant="secondary" size="sm" className="font-medium rounded-lg" onPress={close}>
                      Abort Setup
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
                            ? (editingId ? "Saving..." : "Publishing...")
                            : (editingId ? "Save Changes" : "Publish Asset Track")}
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