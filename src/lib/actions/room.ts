// /src/actions/room.ts
"use server";

import { serverMutate } from "./serverMutate";
import { auth } from "@/lib/auth"; // Your main server-side auth instance
import { headers } from "next/headers"; // Next.js headers helper

export interface RoomInput {
  hotelId: string;
  roomNumber: string;
  type: string; // e.g., Standard, Deluxe, Executive, Presidential
  price: number;
  description?: string;
  imageUrl?: string;
}

// ==========================================
// PRIVATE CORE UTILITY (Session Safeguard)
// ==========================================
/**
 * Internal helper to guarantee we have a valid merchant session.
 * Always resolves on the server where cookies cannot be spoofed by the client.
 */
async function getAuthenticatedUserOrThrow() {
  // Better Auth requires passing current headers on the server side
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const user = session?.user;
  
  if (!user || !user.id) {
    throw new Error("Unauthorized: You must be logged in to execute this operation.");
  }
  return user;
}
// ==========================================
// MERCHANDISE DASHBOARD ACTIONS (Secure / Private)
// ==========================================

/**
 * READ MERCHANT ROOMS (Implicitly scoped)
 * Pulls only the rooms belonging to the logged-in user's hotels.
 */
export async function getRooms() {
  try {
    const user = await getAuthenticatedUserOrThrow();

    return await serverMutate({
      path: `/api/rooms?ownerId=${user.id}`,
      method: "GET",
    });
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
}

/**
 * CREATE ROOM
 * Safe insertion verifying that the session user is valid.
 */
export async function createRoom(data: RoomInput) {
  try {
    await getAuthenticatedUserOrThrow();
    
    return await serverMutate({
      path: "/api/rooms",
      method: "POST",
      body: data,
      revalidatePathUrl: "/dashboard/rooms",
    });
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
}

/**
 * READ SINGLE ROOM (Private Detail)
 * Fetches one room for editing or checking on the private dashboard.
 */
export async function getRoom(id: string) {
  try {
    const user = await getAuthenticatedUserOrThrow();

    return await serverMutate({
      path: `/api/rooms/${id}?requestedBy=${user.id}`,
      method: "GET",
    });
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
}

/**
 * UPDATE ROOM
 * Updates a room while transmitting the matching requester ID for ownership checks.
 */
export async function updateRoom(id: string, data: Partial<RoomInput>) {
  try {
    const user = await getAuthenticatedUserOrThrow();

    return await serverMutate({
      path: `/api/rooms/${id}`,
      method: "PUT",
      body: { ...data, requestedBy: user.id }, 
      revalidatePathUrl: "/dashboard/rooms",
    });
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
}

/**
 * DELETE ROOM
 * Completely strips a room configuration from the dashboard.
 */
export async function deleteRoom(id: string) {
  try {
    const user = await getAuthenticatedUserOrThrow();

    return await serverMutate({
      path: `/api/rooms/${id}`,
      method: "DELETE",
      body: { requestedBy: user.id }, 
      revalidatePathUrl: "/dashboard/rooms",
    });
  } catch (err: any) {
    return { success: false as const, error: err.message };
  }
}


// ==========================================
// VISITOR BRANDING ACTIONS (Unauthenticated / Public)
// ==========================================

/**
 * PUBLIC: GET ALL ROOMS FOR A HOTEL
 * Openly retrieves standard room list for booking. Only processes safe GET arrays.
 */
export async function getPublicRoomsByHotel(hotelId: string) {
  if (!hotelId) {
    return { success: false as const, error: "Missing required query parameter: hotelId." };
  }

  return await serverMutate({
    path: `/api/public/rooms?hotelId=${hotelId}`,
    method: "GET",
  });
}

/**
 * PUBLIC: GET SINGLE ROOM DETAILS
 * Openly retrieves details for a single room for booking pages.
 */
export async function getPublicRoomDetails(id: string) {
  if (!id) {
    return { success: false as const, error: "Missing required identifier parameter: id." };
  }

  return await serverMutate({
    path: `/api/public/rooms/${id}`,
    method: "GET",
  });
}

export async function getAllPublicRooms() {
  return await serverMutate({
    path: "/api/public/rooms",
    method: "GET",
  });
}