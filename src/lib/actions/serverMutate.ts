"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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
    // 1. Bulletproof Guard against missing config on Vercel
    if (!EXPRESS_API_URL) {
      throw new Error("Missing NEXT_PUBLIC_SERVER_URL environment variable inside application settings.");
    }

    const cookieStore = await cookies();
    // 2. Fix the Multi-Cookie Header drops on external proxy layers
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cookie": cookieHeader, 
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // 3. Prevent structural body inclusions on strict GET options
    if (method !== "GET" && body !== undefined && body !== null) {
      fetchOptions.body = JSON.stringify(body);
    }

    // 4. Clean up trailing/leading slash compilation errors automatically
    const baseClean = EXPRESS_API_URL.replace(/\/$/, "");
    const pathClean = path.replace(/^\//, "");
    const targetUrl = `${baseClean}/${pathClean}`;

    const response = await fetch(targetUrl, fetchOptions);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    if (revalidatePathUrl) {
      revalidatePath(revalidatePathUrl, "page");
    }

    return { 
      success: true as const, 
      // 5. Envelope Fallback: works whether Express wraps payloads in .data or returns it directly
      data: (result.data !== undefined ? result.data : result) as T, 
      message: result.message as string | undefined 
    };

  } catch (error: any) {
    // 6. Log it clearly so you can read it inside Vercel Server Logs dashboard!
    console.error(`[serverMutate Failure] ${method} to ${path}:`, error.message);
    return { 
      success: false as const, 
      error: error.message || "An unexpected error occurred during database mutation." 
    };
  }
}