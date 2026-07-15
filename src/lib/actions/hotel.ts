// /src/actions/hotel.ts
"use server";

import { serverMutate } from "./serverMutate";

export interface HotelInput {
  name: string;
  location: string;
  totalRooms: number;
  rating: number;
  ownerId: string;
  description?: string;
  imageUrl?: string;
}

// ==========================================
// CREATE HOTEL
// ==========================================
export async function createHotel(data: HotelInput) {
  return serverMutate({
    path: "/api/hotels",
    method: "POST",
    body: data,
    revalidatePathUrl: "/dashboard/hotels",
  });
}

// ==========================================
// READ HOTELS
// ==========================================
export async function getHotels() {
  return serverMutate({
    path: "/api/hotels",
    method: "GET",
  });
}

// ==========================================
// READ SINGLE HOTEL
// ==========================================
export async function getHotel(id: string) {
  return serverMutate({
    path: `/api/hotels/${id}`,
    method: "GET",
  });
}

// ==========================================
// UPDATE HOTEL
// ==========================================
export async function updateHotel(id: string, data: Partial<HotelInput>) {
  return serverMutate({
    path: `/api/hotels/${id}`,
    method: "PUT",
    body: data,
    revalidatePathUrl: "/dashboard/hotels",
  });
}

// ==========================================
// DELETE HOTEL
// ==========================================
export async function deleteHotel(id: string) {
  return serverMutate({
    path: `/api/hotels/${id}`,
    method: "DELETE",
    revalidatePathUrl: "/dashboard/hotels",
  });
}