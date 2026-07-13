"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // Adjust path to your auth-client config

interface RouteItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const { data: session, isPending, refresh } = authClient.useSession();
  const user = session?.user;
  const userRole = user?.role;
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync session state on mount
  useEffect(() => {
    if (typeof refresh === "function") {
      refresh();
    }
  }, [refresh]);

  // Handle outside clicks for desktop profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin"); // Adjust to your preferred sign-in route
          router.refresh();
        },
      },
    });
  };

  const publicRoutes: RouteItem[] = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
  ];

  const dashboardHref =
    userRole === "admin"
      ? "/dashboard/admin/overview"
      : "/dashboard/user/overview";

  const profileHref = "/dashboard/my-profile";

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-neutral-900 dark:bg-neutral-950/80">
      <div className="flex w-full max-w-7xl items-center justify-between px-6">
        
        {/* Navbar Brand Area */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-50 active:scale-95 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-900"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative flex h-4 w-4 flex-col justify-between transition-transform duration-300">
              <span className={`h-[1.5px] w-4 rounded bg-current transition-transform duration-300 origin-left ${isOpen ? "rotate-45 scale-x-125 text-neutral-900 dark:text-white" : ""}`} />
              <span className={`h-[1.5px] w-4 rounded bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-4 rounded bg-current transition-transform duration-300 origin-left ${isOpen ? "-rotate-45 scale-x-125 text-neutral-900 dark:text-white" : ""}`} />
            </div>
          </button>
          
          <Link href="/" className="text-base font-black tracking-tighter text-neutral-900 dark:text-white flex items-center gap-0.5 select-none">
            <span>EQUINOX</span>
            <span className="text-indigo-600 font-medium dark:text-indigo-400">HUB</span>
          </Link>
        </div>

        {/* Desktop Navigation Items */}
        <ul className="hidden md:flex items-center gap-6">
          {publicRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <li key={route.label}>
                <Link
                  href={route.href}
                  className={`relative text-xs font-bold tracking-wide transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:bg-neutral-900 dark:after:bg-white after:transition-all ${
                    isActive
                      ? "text-neutral-900 dark:text-white after:w-full"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white after:w-0 hover:after:w-full"
                  }`}
                >
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions / CTA Area */}
        <div className="flex items-center gap-4">
          {/* Dynamic Theme Toggler */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-transparent text-neutral-500 transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
            aria-label="Toggle structural theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-[15px] w-[15px] text-amber-400" />
            ) : (
              <Moon className="h-[15px] w-[15px] text-neutral-600 dark:text-neutral-400" />
            )}
          </button>

          <span className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          {/* Conditional Desktop Auth Segment */}
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-700 dark:border-t-neutral-400 hidden sm:block" />
          ) : user ? (
            /* Authenticated Dropdown trigger */
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none rounded-full active:scale-95 transition-transform"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={user.image || "/default-avatar.png"} 
                    alt={user.name || "User Dropdown Menu"}
                    fill
                    sizes="32px"
                    priority
                    className="object-cover"
                  />
                </div>
              </button>

              {/* Profile Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-100 bg-white shadow-lg py-1 text-xs font-bold tracking-wide dark:border-neutral-800 dark:bg-neutral-950 z-50">
                  <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-[10px] text-neutral-400 truncate">Signed in as</p>
                    <p className="text-neutral-800 dark:text-neutral-200 truncate">{user.name}</p>
                  </div>
                  <Link
                    href={profileHref}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  >
                    My Profile
                  </Link>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Auth Options */
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
             
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-neutral-900 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu Overlay (Mobile Drawer) */}
      <div 
        className={`absolute top-16 left-0 z-40 flex w-full flex-col gap-1.5 bg-white/95 backdrop-blur-lg px-6 py-4 border-b border-neutral-100 md:hidden transition-all duration-300 ease-in-out dark:bg-neutral-950/95 dark:border-neutral-900 ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        {publicRoutes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.label}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={`w-full py-2 text-sm font-bold transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              {route.label}
            </Link>
          );
        })}

        {/* Mobile-Only Auth Items inside Drawer */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-2 flex flex-col gap-1.5 sm:hidden">
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-700 dark:border-t-neutral-400 py-2 mx-1" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2.5 py-2 px-1">
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt="User Panel Profile Avatar"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{user.name}</span>
              </div>
              <Link
                href={profileHref}
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                My Profile
              </Link>
              <Link
                href={dashboardHref}
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left py-2 text-sm font-bold text-red-500 border-t border-neutral-100 dark:border-neutral-800 mt-1"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}