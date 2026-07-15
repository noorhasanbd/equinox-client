"use client";

import React from "react";
import { Card } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Card className="max-w-md w-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl">
        <Card.Content className="p-8 flex flex-col items-center text-center space-y-6">

          {/* Visual Alert Icon Shield */}
          <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl animate-pulse">
            <ShieldAlert className="h-12 w-12" />
          </div>

          {/* Heading Text Block */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Security Clearance Required</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 px-2">
              Your account current security role token does not possess authorization parameters to access this node.
            </p>
          </div>

          {/* Divider Graphic line */}
          <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800" />

          {/* User Route Recovery Options Actions */}
          <div className="flex flex-col sm:flex-row w-full gap-3">
            {/* v3 Button has no `as` prop — style a real next/link with buttonVariants instead */}
            <Link
              href="/dashboard"
              className={
                buttonVariants({ variant: "secondary" }) +
                " w-full flex items-center justify-center gap-2 font-medium"
              }
            >
              <ArrowLeft className="h-4 w-4" />
              My Dashboard
            </Link>

            <Link
              href="/"
              className={
                buttonVariants({ variant: "primary" }) +
                " w-full flex items-center justify-center gap-2 font-medium shadow-md shadow-blue-500/10"
              }
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </div>

        </Card.Content>
      </Card>

      {/* Subtle branding node tag */}
      <span className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-6 tracking-widest uppercase">
        Equinox Security Mesh
      </span>
    </div>
  );
}