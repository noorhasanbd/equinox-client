"use client";

import React, { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, Link, Spinner, Button } from "@heroui/react";
import { 
  CalendarDays, 
  Plus, 
  Building, 
  MapPin, 
  ShieldCheck,
  Inbox,
  Trash2
} from "lucide-react";
import { getBookingsByUserId, cancelBookingById } from "@/lib/actions/booking";

interface PopulatedRoom {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  hotelId?: {
    name: string;
    location: string;
  };
}

interface BookingData {
  _id: string;
  roomId: PopulatedRoom | string; 
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status: string;
}

function getStatusConfig(status: string = "Confirmed") {
  const normStatus = status.toLowerCase();
  if (normStatus === "confirmed" || normStatus === "active") {
    return {
      label: "Confirmed",
      colorClass: "text-success bg-success-50 dark:bg-success-950/20 border-success-200"
    };
  }
  if (normStatus === "pending" || normStatus === "pending payout") {
    return {
      label: "Pending",
      colorClass: "text-warning bg-warning-50 dark:bg-warning-950/20 border-warning-200"
    };
  }
  if (normStatus === "cancelled" || normStatus === "canceled") {
    return {
      label: "Cancelled",
      colorClass: "text-danger bg-danger-50 dark:bg-danger-950/20 border-danger-200"
    };
  }
  return {
    label: status,
    colorClass: "text-default-600 bg-default-100 border-default-200"
  };
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function GuestBookingManagementPage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isFetchingBookings, startFetching] = useTransition();
  const [isCancelling, startCancelling] = useTransition();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    startFetching(async () => {
      const res = await getBookingsByUserId();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        console.error("Failed loading user reservations:", res.error);
      }
    });
  }, [session?.user?.id]);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this room reservation? This action is permanent."
    );
    if (!confirmCancel) return;

    setCancellingId(bookingId);
    startCancelling(async () => {
      const res = await cancelBookingById(bookingId);
      
      if (res.success) {
        // Optimistically update the status locally to match server expectations
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      } else {
        alert(res.error || "Could not successfully complete reservation cancellation.");
      }
      setCancellingId(null);
    });
  };

  const isLoading = isSessionLoading || isFetchingBookings;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Stays & Bookings</h1>
          <p className="text-sm text-default-500">Track current itineraries, explore confirmation passes, or look up past invoices.</p>
        </div>
        
        <Link 
          href="/explore" 
          className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold text-xs py-2.5 px-4 rounded-xl shadow-none hover:opacity-95 transition-opacity w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Book a Room
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner color="accent" />
          <span className="text-xs text-default-500">Retrieving your reservation history...</span>
        </div>
      ) : !session ? (
        <Card className="border border-divider bg-content1 shadow-none p-12 text-center flex flex-col items-center gap-4">
          <h3 className="text-base font-bold">Please sign in to view your bookings</h3>
          <p className="text-xs text-default-400 max-w-sm">You must be logged in to access secure account history and active room configurations.</p>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="border border-divider bg-content1 shadow-none p-16 text-center flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-default-100 flex items-center justify-center">
            <Inbox className="h-5 w-5 text-default-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No bookings discovered</h3>
            <p className="text-xs text-default-400">It looks like you haven&apos;t scheduled any hotel reservations yet.</p>
          </div>
          <Link href="/explore" className="text-xs font-semibold text-primary hover:underline">
            Explore active properties now
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border border-divider bg-content1 shadow-none overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[750px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-divider bg-default-50 text-xs font-bold uppercase tracking-wider text-default-500">
                    <th className="py-3.5 px-4">Reservation & Property</th>
                    <th className="py-3.5 px-4">Room Type</th>
                    <th className="py-3.5 px-4">Stay Windows</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider text-xs text-foreground">
                  {bookings.map((booking) => {
                    const room = typeof booking.roomId === "object" ? booking.roomId : null;
                    const statusInfo = getStatusConfig(booking.status);

                    // Guarded with a fallback — booking.status can be missing/null on
                    // some records, and calling .toLowerCase() on undefined here would
                    // throw during render and crash the whole page, not just this row.
                    const isBookingCancelled = 
                      (booking.status || "").toLowerCase() === "cancelled" || 
                      (booking.status || "").toLowerCase() === "canceled";
                    
                    const isCurrentItemProcessing = isCancelling && cancellingId === booking._id;

                    return (
                      <tr key={booking._id} className="hover:bg-default-50/50 transition-colors">
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="flex items-center gap-2 font-semibold">
                            <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{room?.hotelId?.name || `Room ${room?.roomNumber || "N/A"}`}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-default-400">
                            <MapPin className="h-3 w-3" />
                            <span>{room?.hotelId?.location || "On-property Suite"}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-default-600">
                          {room?.type || "Standard Unit"}
                        </td>

                        <td className="py-4 px-4 text-default-600">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-default-400" />
                            <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.colorClass}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right font-bold tracking-tight">
                          ${booking.totalCost.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              
                              isDisabled={isBookingCancelled || (isCancelling && cancellingId !== null)}
                              
                              onPress={() => handleCancelBooking(booking._id)}
                              className="h-8 min-w-0 px-3 rounded-lg text-xs font-bold uppercase tracking-wide gap-1"
                            >
                              {!isCurrentItemProcessing && <Trash2 className="h-3 w-3" />}
                              {isBookingCancelled ? "Cancelled" : "Cancel Stay"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border border-divider bg-default-50 shadow-none p-4 flex flex-row items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <p className="text-xs text-default-600">
              Need to alter checkout configurations? You can modify guest parameters or add early check-in notes up to 24 hours prior directly via the individual reservation receipt links.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}