"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SlideItem {
  id: number;
  title: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  tagline: string;
}

// 1. Hyper-Modern Cinematic Transitions
// 🟢 FIXED: Explicitly typed as Variants to correctly evaluate the cubic-bezier easing arrays
const fadeScaleVariants: Variants = {
  enter: {
    scale: 1.1,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, 
      opacity: { duration: 0.6, ease: "linear" },
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// 2. Text Content Independent Spring Animations
const textContentVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1, 
    },
  },
};

const childTextVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "The Glass Pavilion Oasis",
    location: "Malibu, California",
    rating: 4.98,
    price: 450,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    tagline: "Exclusive Coastal Luxury",
  },
  {
    id: 2,
    title: "A-Frame Nordic Hideaway",
    location: "Trondheim, Norway",
    rating: 4.92,
    price: 280,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    tagline: "Secluded Winter Escape",
  },
  {
    id: 3,
    title: "Boho Chic Desert Dwell",
    location: "Joshua Tree, California",
    rating: 4.87,
    price: 310,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
    tagline: "Sun-Drenched Serenity",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative h-[65vh] w-full overflow-hidden bg-neutral-950">
      
      {/* Background Cinematic Image Slider */}
      <div className="absolute inset-0 h-full w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current}
            variants={fadeScaleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 h-full w-full"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-950/85 via-neutral-950/40 to-transparent" />
            <img
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content Wrapper */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            variants={textContentVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl text-white"
          >
            {/* Tagline */}
            <motion.div variants={childTextVariants} className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
              {SLIDES[current].tagline}
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={childTextVariants} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Perfect Stay
              </span>
            </motion.h1>

            {/* Dynamic Snippet Metadata */}
            <motion.div variants={childTextVariants} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-300">
              <span className="text-xl font-medium text-white">{SLIDES[current].title}</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>{SLIDES[current].location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{SLIDES[current].rating}</span>
              </div>
            </motion.div>

            {/* CTA Option Group */}
            <motion.div variants={childTextVariants} className="mt-8 flex items-center gap-4">
              <Link
                href={`/items/${SLIDES[current].id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Book for ${SLIDES[current].price}/night
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layout Manual Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        <button onClick={handlePrev} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-neutral-900/40 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={handleNext} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-neutral-900/40 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Progression Indicators */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-1.5">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-indigo-500" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}