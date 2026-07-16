"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default function GuestSecurityLayout({ children }: GuestLayoutProps) {
  const router = useRouter();
  
  // 1. Hook into Better Auth's session validation status
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    // 2. Clear credentials gate: if done loading and they aren't a guest, bounce them
    if (!isPending && (!user || user.role !== "guest")) {
      router.push("/unauthorized"); 
    }
  }, [user, isPending, router]);

  // 3. Render a visual screen buffer while validating permissions
  if (isPending) {
    return (
      <div className="flex h-[40vh] w-full flex-col items-center justify-center gap-3">
        <Spinner color="accent" size="lg" />
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Verifying traveler profile details...
        </span>
      </div>
    );
  }

  // 4. Fallback runtime containment shield
  if (user?.role !== "guest") {
    return null;
  }

  return <>{children}</>;
}