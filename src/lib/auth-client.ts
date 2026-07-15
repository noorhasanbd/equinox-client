// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"; // or better-auth/client depending on setup

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  // 🟢 ADD THIS: Tell the client TypeScript registry about the role property
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "guest"
      }
    }
  }
});