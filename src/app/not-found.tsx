"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineMap } from "react-icons/hi2";

export default function NotFound() {
  return (
    <main className="relative w-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 flex flex-col items-center justify-center px-6 overflow-hidden selection:bg-indigo-600/10 selection:text-indigo-600">
      {/* Background Micro-Grid Ambient Element */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Geometric Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* Animated Architectural Layer Structure */}
        <div className="relative flex items-center justify-center h-32 w-full mb-8">
          {/* Subtle Outer Boundary Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute h-32 w-32 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-full"
          />

          {/* Main Hero Numbering Layer */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 1.02, 0.43, 1.01] }}
            className="text-8xl md:text-9xl font-black tracking-tighter text-neutral-200 dark:text-neutral-900/60 selection:bg-transparent select-none font-mono"
          >
            404
          </motion.span>

          {/* Foreground Overlay Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/20 shadow-sm"
          >
            <HiOutlineMap className="h-3.5 w-3.5" />
            Uncharted Territory
          </motion.div>
        </div>

        {/* Text Array Headers */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-2xl font-extrabold tracking-tight sm:text-3xl bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400"
        >
          This space does not exist.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-3 text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm"
        >
          The suite, architectural villa, or coordinate layout you are
          attempting to locate has been shifted or decommissioned.
        </motion.p>

        {/* Dynamic Navigation Action Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
        >
          <Button
            onClick={() => window.history.back()}
            variant="light"
            radius="xl"
            className="w-full sm:w-auto h-11 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm px-5 group flex items-center justify-center gap-2 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-98"
          >
            <FaArrowLeftLong className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>

          <Link
            
            href="/"
            color="primary"
           
            className="w-full sm:w-auto h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 transition-all group flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-4xl"
          >
            Return Home
            <FaArrowRightLong className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 " />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
