"use client";

import { useState } from "react";
import Link from "next/link";

interface RouteItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 3 Core Public Routes (Logged Out State)
  const publicRoutes: RouteItem[] = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-neutral-200/80 bg-white/70 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 dark:border-neutral-800/50 dark:bg-neutral-950/70">
      <div className="flex w-full max-w-7xl items-center justify-between px-6">
        
        {/* Navbar Brand Area */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle (Custom HeroUI Animated Burger) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 active:scale-95 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-900"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative flex h-5 w-5 flex-col justify-between gap-1.5 transition-transform duration-300">
              <span className={`h-0.5 w-5 rounded bg-current transition-transform duration-300 ${isOpen ? "translate-y-2 rotate-45 text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span className={`h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 rounded bg-current transition-transform duration-300 ${isOpen ? "-translate-y-1.5 -rotate-45 text-indigo-600 dark:text-indigo-400" : ""}`} />
            </div>
          </button>
          
          <Link href="/" className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-0.5 select-none">
            <span>EQUINOX</span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent font-extrabold dark:from-indigo-400 dark:to-violet-400">HUB</span>
          </Link>
        </div>

        {/* Desktop Navigation Items */}
        <ul className="hidden md:flex items-center gap-8">
          {publicRoutes.map((route) => (
            <li key={route.label}>
              <Link
                href={route.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions / CTA Area */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      <div 
        className={`absolute top-16 left-0 z-40 flex w-full flex-col gap-2 bg-white px-6 py-4 border-b border-neutral-100 md:hidden transition-all duration-300 ease-in-out dark:bg-neutral-950 dark:border-neutral-900 ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        {publicRoutes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 text-base font-medium text-neutral-600 hover:text-indigo-600 transition-colors dark:text-neutral-300 dark:hover:text-indigo-400"
          >
            {route.label}
          </Link>
        ))}
        <div className="mt-2 border-t border-neutral-100 pt-4 dark:border-neutral-900">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex w-full h-11 items-center justify-center rounded-xl bg-indigo-600 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}