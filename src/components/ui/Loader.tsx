"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export default function Loader({ label = "Loading sanctuary", fullscreen = true }: LoaderProps) {
  // Animation configuration for the geometric scaling squares
  const squareVariants = {
    animate: (i: number) => ({
      scale: [1, 1.2, 1, 1],
      rotate: [0, 90, 90, 0],
      borderRadius: ["20%", "20%", "50%", "20%"],
      opacity: [0.6, 1, 0.6, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.3,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 transition-colors duration-300"
    : "w-full min-h-[400px] flex flex-col items-center justify-center bg-transparent";

  return (
    <div className={containerClasses} aria-busy="true" aria-live="polite">
      {/* Visual Indicator Stack */}
      <div className="relative flex items-center justify-center h-16 w-16">
        {/* Layered Geometric Core */}
        <motion.div
          custom={0}
          variants={squareVariants}
          animate="animate"
          className="absolute h-8 w-8 border-2 border-indigo-600 dark:border-indigo-400"
        />
        <motion.div
          custom={1}
          variants={squareVariants}
          animate="animate"
          className="absolute h-12 w-12 border border-neutral-300 dark:border-neutral-700"
        />
        <motion.div
          custom={2}
          variants={squareVariants}
          animate="animate"
          className="absolute h-16 w-16 border border-dashed border-neutral-200 dark:border-neutral-800"
        />
      </div>

      {/* Accessible Text Feedback */}
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 max-w-[200px] text-center"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}