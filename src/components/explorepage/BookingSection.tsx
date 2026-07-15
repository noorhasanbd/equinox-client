"use client";

import React, { useState, useTransition } from "react";
import { X, CalendarDays, Sparkles, Loader2, Lock } from "lucide-react";
import { createBooking } from "@/lib/actions/booking";
// 1. Import your Better Auth client instance helper (adjust the path to your auth-client file)
import { authClient } from "@/lib/auth-client"; 

interface BookingSectionProps {
  roomId: string;
  pricePerNight: number;
  roomNumber: string;
}

export default function BookingSection({ roomId, pricePerNight, roomNumber }: BookingSectionProps) {
  // 2. Fetch the session status on the client side
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  
  const [isOpen, setIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isPending, startTransition] = useTransition();
  const [uiError, setUiError] = useState<string | null>(null);

  // Calculate dynamic night count matrix
  const totalNights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const totalCost = totalNights * pricePerNight;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUiError(null);

    // Extra safeguard: Block form submission if the user isn't authenticated
    if (!session) {
      setUiError("You must be logged in to reserve a unit.");
      return;
    }

    startTransition(async () => {
      const res = await createBooking({
        roomId,
        checkIn,
        checkOut,
        totalCost
      });

      if (res.success) {
        alert("Success! Your booking has been registered in the database.");
        setIsOpen(false);
        setCheckIn("");
        setCheckOut("");
      } else {
        setUiError(res.error || "Something went wrong saving your booking.");
      }
    });
  };

  return (
    <>
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-neutral-400 block uppercase tracking-wider font-bold">Standard Nightly Rate</span>
          <span className="text-2xl font-black text-neutral-900 dark:text-white">${pricePerNight}</span>
          <span className="text-xs text-neutral-400 font-medium ml-1">USD</span>
        </div>

        {/* 3. Render state conditionally based on Better Auth session */}
        {isSessionLoading ? (
          <button
            disabled
            className="px-6 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-xs font-black tracking-wide flex items-center gap-2"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Checking Auth...
          </button>
        ) : session ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black text-white text-xs tracking-wide transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Reserve Unit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => alert("Please sign in to make a reservation.")} // Or route them to your sign-in page: router.push('/login')
            className="px-6 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-black text-neutral-600 dark:text-neutral-300 text-xs tracking-wide transition-all flex items-center gap-2"
          >
            <Lock className="h-3.5 w-3.5" />
            Sign in to Reserve
          </button>
        )}
      </div>

      {/* Booking Modal Overlay Layer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-6 relative text-neutral-900 dark:text-neutral-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-black tracking-tight">Create Booking Entry</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Registering Stay for Room {roomNumber}</p>
              </div>
              <button 
                onClick={() => !isPending && setIsOpen(false)}
                disabled={isPending}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message Display block */}
            {uiError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 rounded-xl text-xs font-medium">
                {uiError}
              </div>
            )}

            {/* Date Picker Form Structure */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-400 block">Check In</label>
                  <input 
                    type="date" 
                    required
                    disabled={isPending}
                    min={new Date().toISOString().split("T")[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-900 focus:outline-none focus:border-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-400 block">Check Out</label>
                  <input 
                    type="date" 
                    required
                    disabled={isPending}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-900 focus:outline-none focus:border-indigo-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Dynamic Cost Breakdowns */}
              {totalNights > 0 && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>${pricePerNight} × {totalNights} nights</span>
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">${totalCost}</span>
                  </div>
                  <div className="h-px bg-neutral-200/60 dark:bg-neutral-800/60" />
                  <div className="flex justify-between text-xs items-baseline">
                    <span className="font-black text-neutral-800 dark:text-neutral-200">Total System Price</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">${totalCost}</span>
                  </div>
                </div>
              )}

              {/* Action Operations */}
              <button
                type="submit"
                disabled={totalNights <= 0 || isPending}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white text-xs font-black tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving to Records...
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-3.5 w-3.5" />
                    Confirm Reservation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}