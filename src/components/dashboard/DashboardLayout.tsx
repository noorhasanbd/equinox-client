"use client";

import React, { useState } from "react";
import {
  Button,

  Card,
  Avatar,
  Spinner, // Added to show loading while session is fetched
} from "@heroui/react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  CreditCard,
  Building2,
  BedDouble,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 1. Hook directly into Better Auth's real live session tracking state
  const { data: session, isPending } = authClient.useSession();

  const guestLinks: SidebarItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserCircle },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  ];

  const ownerLinks: SidebarItem[] = [
    { label: "Analytics Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Manage Hotels", href: "/dashboard/my-hotels", icon: Building2 },
    { label: "Room Inventory", href: "/dashboard/rooms", icon: BedDouble },
    {
      label: "Financial Reports",
      href: "/dashboard/earnings",
      icon: BarChart3,
    },
    { label: "Hotel Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // 2. Handle loading state while checking authentication tokens
  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Spinner color="accent" />
      </div>
    );
  }

  // 3. Fallback check if user wanders to dashboard page unauthorized
  if (!session?.user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
        <Card className="max-w-md p-6 text-center border border-neutral-200 dark:border-neutral-800">
          <Card.Content>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              You must be logged in to view your dashboard.
            </p>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Go to Login
            </Link>
          </Card.Content>
        </Card>
      </div>
    );
  }

  const user = session.user;
  // Fallback cleanly to "guest" if the custom database role property hasn't been set yet
  const userRole = (user.role as "guest" | "owner") || "guest";
  const activeLinks = userRole === "owner" ? ownerLinks : guestLinks;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* SIDEBAR BLOCK */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 transform 
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-16 translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          {isSidebarOpen ? (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate ml-2">
              Equinox Stay
            </span>
          ) : (
            <span className="text-sm font-bold mx-auto text-blue-600">EQ</span>
          )}
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={!isSidebarOpen ? "hidden" : ""}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Dynamic Navigation Items Section */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {!isSidebarOpen && (
            <Button
              isIconOnly
              variant="ghost"
              className="w-full h-11 mb-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-neutral-500" />
            </Button>
          )}

          {activeLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full flex items-center justify-start gap-4 text-sm h-11 px-3 rounded-xl transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ${
                  !isSidebarOpen ? "justify-center" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-neutral-500 shrink-0" />
                {isSidebarOpen && (
                  <span className="truncate">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Real User Profile Block */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 bg-neutral-50/50 dark:bg-neutral-950/20">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Avatar size="sm" className="shrink-0">
              <Avatar.Image
                src={
                  user.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                }
                alt={user.name}
              />
              <Avatar.Fallback>
                {user.name ? user.name.charAt(0) : "U"}
              </Avatar.Fallback>
            </Avatar>

            {isSidebarOpen && (
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-xs font-semibold leading-tight truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-neutral-400 truncate">
                  {user.email}
                </span>
                <span className="text-[9px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium px-1.5 py-0.5 rounded w-max mt-1 uppercase tracking-wider">
                  {userRole}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            
            onClick={handleLogout}
            className={`w-full justify-start gap-4 text-sm h-10 px-3 ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT CONTAINER FRAME */}
      <div
        className={`flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-16"}`}
      >
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-950">
          <Card className="shadow-sm border border-neutral-200 dark:border-neutral-800 h-full min-h-[calc(100vh-3rem)]">
            <Card.Content className="p-6">{children}</Card.Content>
          </Card>
        </main>
      </div>
    </div>
  );
}
