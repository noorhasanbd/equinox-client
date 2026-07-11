"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const DESTINATIONS = [
  {
    id: "dest_01",
    city: "Reykjavík",
    region: "Iceland",
    properties: "34 Active Stays",
    image: "https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=600&q=80",
    size: "md:col-span-2 md:row-span-2", // Large feature card
  },
  {
    id: "dest_02",
    city: "Kyoto",
    region: "Japan",
    properties: "56 Active Stays",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    size: "md:col-span-2 md:row-span-1",
  },
  {
    id: "dest_03",
    city: "Santorini",
    region: "Greece",
    properties: "28 Active Stays",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    size: "md:col-span-1 md:row-span-1",
  },
  {
    id: "dest_04",
    city: "Dolomites",
    region: "Italy",
    properties: "42 Active Stays",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80",
    size: "md:col-span-1 md:row-span-1",
  },
];

export default function DestinationsSection() {
  return (
    <section className="w-full bg-neutral-50 py-24 dark:bg-neutral-900 border-t border-b border-neutral-200/40 dark:border-neutral-800/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-3">
              <Globe className="h-3.5 w-3.5" />
              Global Footprint
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              Explore signature regions
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Hand-selected locations chosen for their architectural integrity and surrounding natural topography.
            </p>
          </div>
          
          <Link
            href="/destinations"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1 group"
          >
            Explore all regions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento-style Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 auto-rows-[240px]">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden bg-white border border-neutral-200/60 dark:border-neutral-800/60 dark:bg-neutral-800 flex flex-col justify-end p-6 ${dest.size}`}
            >
              {/* Background Media Component */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-95" />
                <img
                  src={dest.image}
                  alt={`${dest.city}, ${dest.region}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Text Layout Meta Data */}
              <div className="relative z-20 flex items-end justify-between w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                    <Compass className="h-3 w-3" />
                    {dest.region}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    {dest.properties}
                  </p>
                </div>

                <Link 
                  href={`/explore?location=${dest.city.toLowerCase()}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}