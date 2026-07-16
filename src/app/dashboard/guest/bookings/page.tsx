"use client";

import React, { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, Link, Spinner } from "@heroui/react";
import { 
  CalendarDays, 
  Plus, 
  Building, 
  MapPin, 
  ShieldCheck,
  ExternalLink,
  Inbox
} from "lucide-react";
// Import the server action we created
import { getBookingsByUserId } from "@/lib/actions/booking";

// Types matching your database population structure
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
  roomId: PopulatedRoom | string; // populated from database
  checkIn: string;
  checkOut: string;
  totalCost: number;
  status: string;
}

// Helper to determine status classes dynamically
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
  return {
    label: status,
    colorClass: "text-default-600 bg-default-100 border-default-200"
  };
}

// Helper to format dates elegantly
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

  const isLoading = isSessionLoading || isFetchingBookings;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Header Management Navigation Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Stays & Bookings</h1>
          <p className="text-sm text-default-500">Track current itineraries, explore confirmation passes, or look up past invoices.</p>
        </div>
        
        {/* Dynamic Navigation Action */}
        <Link 
          href="/" 
          className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold text-xs py-2.5 px-4 rounded-xl shadow-none hover:opacity-95 transition-opacity w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Book a Room
        </Link>
      </div>

      {/* Loading state indicator */}
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
          <Link href="/" className="text-xs font-semibold text-primary hover:underline">
            Explore active properties now
          </Link>
        </Card>
      ) : (
        /* Main Bookings Layout Grid Container */
        <div className="space-y-4">
          {/* Table Wrapper Card */}
          <Card className="border border-divider bg-content1 shadow-none overflow-hidden">
            <Card.Content className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-divider bg-default-50 text-2xs font-bold uppercase tracking-wider text-default-500">
                      <th className="py-3.5 px-4">Reservation & Property</th>
                      <th className="py-3.5 px-4">Room Type</th>
                      <th className="py-3.5 px-4">Stay Windows</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider text-xs text-foreground">
                    {bookings.map((booking) => {
                      const room = typeof booking.roomId === "object" ? booking.roomId : null;
                      const statusInfo = getStatusConfig(booking.status);

                      return (
                        <tr key={booking._id} className="hover:bg-default-50/50 transition-colors">
                          {/* Property Details */}
                          <td className="py-4 px-4 space-y-0.5">
                            <div className="flex items-center gap-2 font-semibold">
                              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{room?.hotelId?.name || `Room ${room?.roomNumber || "N/A"}`}</span>
                            </div>
                            <div className="flex items-center gap-1 text-2xs text-default-400">
                              <MapPin className="h-3 w-3" />
                              <span>{room?.hotelId?.location || "On-property Suite"}</span>
                            </div>
                          </td>

                          {/* Room Type */}
                          <td className="py-4 px-4 text-default-600 vertical-middle">
                            {room?.type || "Standard Unit"}
                          </td>

                          {/* Schedule Calendars */}
                          <td className="py-4 px-4 text-default-600">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-default-400" />
                              <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                            </div>
                          </td>

                          {/* Status Badges */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium border ${statusInfo.colorClass}`}>
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* Financial Sum */}
                          <td className="py-4 px-4 text-right font-bold tracking-tight">
                            ${booking.totalCost.toFixed(2)}
                          </td>

                          {/* Managed Actions */}
                          <td className="py-4 px-4 text-right">
                            <Link 
                              href={`/dashboard/bookings/${booking._id}`}
                              className="text-xs font-semibold text-primary flex items-center justify-end gap-0.5 hover:underline"
                            >
                              Details <ExternalLink className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>

          {/* Informative Safety Notice Bar */}
          <Card className="border border-divider bg-default-50 shadow-none">
            <Card.Content className="p-4 flex flex-row items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs text-default-600">
                Need to alter checkout configurations? You can modify guest parameters or add early check-in notes up to 24 hours prior directly via the individual reservation receipt links.
              </p>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
}