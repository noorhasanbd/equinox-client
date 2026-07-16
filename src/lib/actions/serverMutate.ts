// /src/actions/serverMutate.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"; // Default to localhost if not set

interface MutateOptions {
  path: string;                // e.g. "/api/hotels" or "/api/hotels/123"
  method: "POST" | "PUT" | "DELETE" | "GET";
  body?: any;
  revalidatePathUrl?: string;  // e.g. "/dashboard/hotels"
}

/**
 * Reusable utility to safely communicate with your separate Express backend.
 * Handles authentication header forwarding, server-side parsing, and Next.js revalidation.
 */
export async function serverMutate<T = any>({
  path,
  method,
  body,
  revalidatePathUrl,
}: MutateOptions) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cookie": cookieHeader, // Forward browser credentials to the external domain
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${EXPRESS_API_URL}${path}`, fetchOptions);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    // Trigger on-demand Next.js caching updates if requested
    if (revalidatePathUrl) {
      revalidatePath(revalidatePathUrl);
    }

    return { 
      success: true as const, 
      data: result.data as T, 
      message: result.message as string | undefined 
    };

  } catch (error: any) {
    return { 
      success: false as const, 
      error: error.message || "An unexpected error occurred during database mutation." 
    };
  }
}