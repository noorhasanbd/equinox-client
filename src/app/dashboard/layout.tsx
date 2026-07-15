"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Card, Avatar } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, CalendarDays, UserCircle, CreditCard,
  Building2, BedDouble, BarChart3, Settings, LogOut, Menu,
  ShieldCheck, ShieldAlert, Sun, Moon, Wrench, User
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/ui/Loader"; // Adjusted import path to target your custom component

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // 1. Monitor active user session tokens
  const { data: session, isPending } = authClient.useSession();

  // 2. Navigation mappings pointing directly to your nested folder tracks
  const adminLinks: SidebarItem[] = [
    { label: "Admin Console", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Owner Approvals", href: "/dashboard/admin/approvals", icon: ShieldAlert },
    { label: "Global Accounts", href: "/dashboard/admin/users", icon: ShieldCheck },
    { label: "System Config", href: "/dashboard/admin/settings", icon: Wrench },
  ];

  const ownerLinks: SidebarItem[] = [
    { label: "Owner Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "Manage Hotels", href: "/dashboard/owner/my-hotels", icon: Building2 },
    { label: "Room Inventory", href: "/dashboard/owner/rooms", icon: BedDouble },
    { label: "Earnings Report", href: "/dashboard/owner/earnings", icon: BarChart3 },
  ];

  const guestLinks: SidebarItem[] = [
    { label: "Guest Overview", href: "/dashboard/guest", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/guest/bookings", icon: CalendarDays },
    { label: "Payments", href: "/dashboard/guest/payments", icon: CreditCard },
  ];

  // 3. Dynamic logout tracking current view context
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { 
        onSuccess: () => { 
          // Capture current sub-path route state on escape
          window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`; 
        } 
      }
    });
  };

  // Swapped default Spinner for your custom geometric Framer Motion component
  if (isPending) {
    return <Loader label="Assembling Workspace..." fullscreen={true} />;
  }

  if (!session?.user) {
    // Build return parameter target for restricted fallbacks
    const loginTarget = `/login?callbackUrl=${encodeURIComponent(pathname)}`;

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full border border-slate-200/60 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <Card.Content className="p-6 text-center space-y-4">
            <h2 className="text-lg font-bold text-red-500">Access Restricted</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Please log in to initialize your security parameters.</p>
            
            <Link
              href={loginTarget}
              className={buttonVariants({ variant: "primary", size: "md" }) + " w-full font-medium flex items-center justify-center"}
            >
              Authentication Portal
            </Link>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // 4. Dynamic Route Matching Engine based on the URL pathname track
  let activeLinks = guestLinks; // Fallback default navigation space
  let currentContextLabel = "Guest Hub";

  if (pathname.startsWith("/dashboard/admin")) {
    activeLinks = adminLinks;
    currentContextLabel = "Admin Node";
  } else if (pathname.startsWith("/dashboard/owner")) {
    activeLinks = ownerLinks;
    currentContextLabel = "Merchant Control";
  } else if (pathname.startsWith("/dashboard/guest")) {
    activeLinks = guestLinks;
    currentContextLabel = "Guest Hub";
  } else if (pathname === "/dashboard/my-profile") {
    const role = session.user.role || "guest";
    currentContextLabel = "Profile Center";
    activeLinks = role === "admin" ? adminLinks : role === "owner" ? ownerLinks : guestLinks;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-200">

      {/* SIDEBAR CONTAINER */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-60" : "w-16"}`}>

        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/50">
          {isSidebarOpen ? (
            <div className="flex flex-col ml-2">
              <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Equinox Engine
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wider uppercase">{currentContextLabel}</span>
            </div>
          ) : (
            <span className="text-xs font-bold mx-auto text-blue-600 tracking-tighter">EQ</span>
          )}
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            className={!isSidebarOpen ? "hidden" : "text-slate-400 hover:text-slate-600"}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Dynamic Nav Routing Section */}
        <nav className="flex-1 space-y-0.5 p-2.5 overflow-y-auto">
          {!isSidebarOpen && (
            <Button
              isIconOnly
              variant="ghost"
              className="w-full h-10 mb-2 text-slate-400"
              onPress={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }) +
                  ` w-full justify-start gap-3.5 text-xs font-medium h-10 px-3 rounded-lg ${
                    isActive
                      ? "font-semibold bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  } ${!isSidebarOpen ? "justify-center px-0" : ""}`
                }
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
                {isSidebarOpen && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}

          {/* SHARED PROFILE ROUTE LINK */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/40">
            <Link
              href="/dashboard/my-profile"
              className={
                buttonVariants({ variant: pathname === "/dashboard/my-profile" ? "secondary" : "ghost" }) +
                ` w-full justify-start gap-3.5 text-xs font-medium h-10 px-3 rounded-lg ${
                  pathname === "/dashboard/my-profile"
                    ? "font-semibold bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                } ${!isSidebarOpen ? "justify-center px-0" : ""}`
              }
            >
              <User className="h-4 w-4 shrink-0 opacity-80" />
              {isSidebarOpen && <span className="truncate">My Profile Settings</span>}
            </Link>
          </div>
        </nav>

        {/* Bottom Configuration Block */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800/60 space-y-1 bg-slate-50/40 dark:bg-slate-900/40">

          {/* Light / Dark Utility Switch */}
          <Button
            variant="ghost"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`w-full justify-start gap-3.5 text-xs font-medium h-9 px-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <Sun className="h-4 w-4 dark:hidden shrink-0" />
            <Moon className="h-4 w-4 hidden dark:block shrink-0" />
            {isSidebarOpen && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </Button>

          {/* Profile Quick Info Frame */}
          <div className={`flex items-center gap-3 p-2 rounded-xl ${!isSidebarOpen ? "justify-center p-0 py-2 border-0" : ""}`}>
            <Avatar size="sm" className="h-7 w-7 shrink-0 ring-1 ring-slate-200/50 dark:ring-slate-800">
              <Avatar.Image src={session.user.image || ""} alt={session.user.name} />
              <Avatar.Fallback className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </Avatar.Fallback>
            </Avatar>

            {isSidebarOpen && (
              <div className="flex flex-col min-w-0 overflow-hidden flex-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate leading-none mb-0.5">{session.user.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mb-1">{session.user.email}</span>
                <span className="text-[8px] tracking-wider font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md w-max uppercase">{session.user.role || "guest"}</span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onPress={handleLogout}
            className={`w-full justify-start gap-3.5 text-xs font-medium h-9 px-3 text-red-500/80 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-600 ${
              !isSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isSidebarOpen && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* BODY INJECTION VIEW WRAPPER */}
      <div className={`flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-60" : "ml-16"}`}>
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}