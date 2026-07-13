"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminSecurityLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  
  // 1. Hook into Better Auth's session validation status
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    // 2. If the loading sequence finishes but the user lacks admin claims, boot them
    if (!isPending && (!user || user.role !== "admin")) {
      router.push("/unauthorized"); 
    }
  }, [user, isPending, router]);

  // 3. Keep the inner content unmounted while testing role verification
  if (isPending) {
    return (
      <div className="flex h-[40vh] w-full flex-col items-center justify-center gap-3">
        <Spinner label="Verifying security clearance level..." color="danger" size="lg" />
      </div>
    );
  }

  // 4. Hard safety gate check
  if (user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}