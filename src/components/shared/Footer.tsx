"use client";

import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaGithub, 
  FaXTwitter 
} from "react-icons/fa6";
import { HiOutlineBuildingOffice } from "react-icons/hi2";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Rooms", href: "/rooms" },
  { name: "Browse Hotels", href: "/hotels" },
  { name: "Destinations", href: "/destinations" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const SERVICES = [
  { name: "Room Booking", href: "/services/booking" },
  { name: "Luxury Suites", href: "/services/luxury" },
  { name: "Business Stays", href: "/services/business" },
  { name: "Family Rooms", href: "/services/family" },
  { name: "Offers", href: "/offers" },
  { name: "Help Center", href: "/help" },
];

const SUPPORT = [
  { name: "FAQ", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Refund Policy", href: "/refund" },
  { name: "Customer Support", href: "/support" },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter/X" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
];

export default function Footer() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full border-t border-neutral-200/60 bg-white dark:border-neutral-800/60 dark:bg-neutral-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 xl:gap-8">
          
          <div className="flex flex-col space-y-5 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Equinox Home">
              <HiOutlineBuildingOffice className="h-6 w-6 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                Equinox
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Find and reserve premium rooms, apartments, and stays effortlessly. Equinox makes booking simple, secure, and reliable.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={social.label}
                    as={Link}
                    href={social.href}
                    isIconOnly
                    variant="light"
                    radius="full"
                    aria-label={social.label}
                    className="text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-indigo-400 dark:hover:bg-neutral-800 transition-all"
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          <nav aria-label="Footer Quick Links" className="flex flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              Quick Links
            </span>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer Services Links" className="flex flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              Services
            </span>
            <ul className="space-y-2.5">
              {SERVICES.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer Support Links" className="flex flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              Support
            </span>
            <ul className="space-y-2.5">
              {SUPPORT.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        <div className="mt-12 max-w-md border-t border-neutral-100 pt-8 dark:border-neutral-800/40 lg:mt-16 lg:max-w-none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-1">
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 block">
                Stay Updated
              </span>
              <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 block">
                Get exclusive deals, travel inspiration, and booking offers delivered to your inbox.
              </span>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 lg:col-span-2 w-full max-w-md sm:max-w-none ml-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                aria-label="Email address for newsletter"
                radius="xl"
                variant="bordered"
                className="w-full sm:max-w-xs md:max-w-sm ml-auto text-sm placeholder:text-neutral-400 border-neutral-200 hover:border-neutral-300 focus-within:!border-indigo-600 dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus-within:!border-indigo-400"
              />
              <Button
                type="submit"
                color="primary"
                radius="xl"
                className="h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 transition-all shadow-md shadow-indigo-600/10 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-8 dark:border-neutral-800/40 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-400 dark:text-neutral-500">
          <address className="not-italic font-medium">
            &copy; 2026 Equinox. All rights reserved.
          </address>
          <div className="font-medium">
            Crafted with ❤️ using Next.js, HeroUI & TypeScript
          </div>
        </div>

      </div>
    </footer>
  );
}