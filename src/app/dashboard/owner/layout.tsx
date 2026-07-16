"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export default function OwnerSecurityLayout({ children }: OwnerLayoutProps) {
  const router = useRouter();
  
  // 1. Hook into Better Auth's session validation status
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    // 2. Security Gate: If done loading, but they aren't an owner -> redirect
    if (!isPending && (!user || user.role !== "owner")) {
      router.push("/unauthorized"); 
    }
  }, [user, isPending, router]);

  // 3. Render loading state while checking the user's role claims
  if (isPending) {
    return (
      <div className="flex h-[40vh] w-full flex-col items-center justify-center gap-3">
        <Spinner color="danger" size="lg" />
      </div>
    );
  }

  // 4. Final safety guard
  if (user?.role !== "owner") {
    return null;
  }

  return <>{children}</>;
}