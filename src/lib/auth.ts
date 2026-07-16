import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI configuration inside environment variables (.env)",
  );
}

const client = new MongoClient(uri);
const db = client.db("equinox-db"); // Replace 'your-database-name' with your actual database name

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // ADD THIS BLOCK TO MAP THE ADDITIONAL FIELDS FOR MONGODB
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false, // Set to false if some users don't have roles immediately
        defaultValue: "guest",
      },
    },
  },
});
