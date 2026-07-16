"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
// 1. Import your Better Auth server instance (adjust path to where your auth setup lives)
import { auth } from "@/lib/auth"; 
import { serverMutate } from "./serverMutate";

export interface BookingPayload {
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalCost: number;
  userId?: string;  // Added userId to payload type definition
  status?: string; 
}

/**
 * 1. CREATE BOOKING
 * POST /api/bookings
 */
export async function createBooking(data: Omit<BookingPayload, "userId">) {
  try {
    // 2. Fetch the session securely on the server
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false as const, error: "Unauthorized. You must be logged in to book." };
    }

    // ✅ FIXED: Enforce lowercase to match your Mongoose schema enum criteria ["pending", "confirmed", "cancelled"]
    const formattedData = {
      ...data,
      userId: session.user.id, // Injecting user ID safely here
      status: data.status 
        ? data.status.toLowerCase() 
        : "confirmed"
    };

    const res = await serverMutate({
      path: "/api/bookings",
      method: "POST",
      body: formattedData, 
    });

    // Clear caches so the frontend UI immediately updates
    revalidatePath(`/explore/${data.roomId}`);
    revalidatePath("/explore");

    return res;
  } catch (error: any) {
    console.error("Failed to create booking through API:", error);
    return { success: false as const, error: error.message || "Failed to create booking." };
  }
}

/**
 * 2. READ BOOKINGS
 * GET /api/bookings (Optionally filtering by roomId or automatically by current user)
 */
export async function getBookingsByUserId(roomId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false as const, error: "Unauthorized." };
  }

  // Construct RESTful path: /api/bookings/user/USER_ID
  let path = `/api/bookings/user/${session.user.id}`;
  if (roomId) {
    path += `?roomId=${roomId}`;
  }

  return serverMutate({
    path,
    method: "GET",
  });
}

/**
 * 3. UPDATE / EDIT BOOKING
 * PUT /api/bookings/:id
 */
export async function updateBooking(
  bookingId: string,
  updateData: Partial<BookingPayload> & { status?: string }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false as const, error: "Unauthorized." };
    }

    // ✅ FIXED: Ensure status updates are uniformly forced to all lowercase matching the DB requirements
    const formattedUpdate = { ...updateData };
    if (formattedUpdate.status) {
      formattedUpdate.status = formattedUpdate.status.toLowerCase();
    }

    // Note: The backend API endpoint should verify if this bookingId actually belongs to session.user.id!
    const res = await serverMutate({
      path: `/api/bookings/${bookingId}`,
      method: "PUT",
      body: formattedUpdate,
    });

    revalidatePath("/explore");
    return res;
  } catch (error: any) {
    console.error("Failed to update booking via API:", error);
    return { success: false as const, error: error.message || "Failed to modify booking." };
  }
}

/**
 * 4. DELETE BOOKING
 * DELETE /api/bookings/:id
 */
export async function deleteBooking(bookingId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false as const, error: "Unauthorized." };
    }

    // Note: Ensure your backend API handles checking ownership before deleting!
    const res = await serverMutate({
      path: `/api/bookings/${bookingId}`,
      method: "DELETE",
    });

    revalidatePath("/explore");
    return res;
  } catch (error: any) {
    console.error("Failed to delete booking via API:", error);
    return { success: false as const, error: error.message || "Failed to remove booking." };
  }
}

/**
 * 5. CANCEL BOOKING SPECIFIC WRAPPER
 * Internally utilizes the PUT endpoint to safely transform status contexts.
 */
export async function cancelBookingById(bookingId: string) {
  // Pipes directly into updateBooking, which safely formats it into "cancelled" lowercase
  return updateBooking(bookingId, { status: "cancelled" });
}