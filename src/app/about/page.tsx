"use client";

import { motion } from "framer-motion";
import { 
 
  FaKey, 
  FaShieldHeart, 
  FaUsers,
  FaArrowRightLong 
} from "react-icons/fa6";

import { FaGlobeAmericas } from "react-icons/fa";
import { 
  HiOutlineSparkles, 
  HiOutlineCircleStack, 
  HiOutlineUserGroup 
} from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@heroui/react";

// Text configuration matrices to prevent component clutter
const STATS = [
  { value: "140+", label: "Architectural Gems", sub: "Handpicked locations" },
  { value: "99.4%", label: "Seamless Check-ins", sub: "Automated digital access" },
  { value: "24/7", label: "Dedicated Concierge", sub: "Real-time elite support" },
  { value: "4.9★", label: "Average Guest Score", sub: "From 12,000+ experiences" },
];

const VALUES = [
  {
    icon: FaKey,
    title: "Uncompromising Integrity",
    desc: "Every villa, suite, and workspace listed passes a rigorous 40-point architectural and structural evaluation. What you see is exactly what you step into.",
  },
  {
    icon: FaShieldHeart,
    title: "Intuitive Sanctuary",
    desc: "Hospitality should feel continuous, not transactional. From secure digital keys to dynamic space modifications, our rooms adjust to you—not the other way around.",
  },
  {
    icon: FaGlobeAmericas,
    title: "Sustainable Footprint",
    desc: "Premium doesn't dictate ecological disregard. We consciously partner with properties operating on local green energy, low-impact waste matrices, and water restoration.",
  },
];

const LEADERSHIP = [
  {
    name: "Marcus Vance",
    role: "Chief Executive Officer & Founder",
    bio: "Ex-hospitality development lead with 15 years in luxury property design and real-estate optimization frameworks.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Elena Rostova",
    role: "Head of Spaces & Architecture",
    bio: "Architect and interior curator specializing in Scandinavian minimal environments and sustainable smart-home integration.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
  },
  {
    name: "Tariq Kincaid",
    role: "Chief Technology Officer",
    bio: "Systems architect builder dedicated to seamless booking cryptography, tokenized keys, and low-latency infrastructure.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"
  }
];

// Motion presets for ultra-smooth layout rendering
const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.21, 1.02, 0.43, 1.01] }
  })
};

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 overflow-x-hidden selection:bg-indigo-600/10 selection:text-indigo-600">
      
      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative px-6 pt-32 pb-20 mx-auto max-w-7xl lg:px-8 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        <motion.div 
          custom={0} initial="hidden" animate="visible" variants={fadeInVariant}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-6 border border-indigo-200/30"
        >
          <HiOutlineSparkles className="h-3.5 w-3.5" />
          Redefining Sanctuary
        </motion.div>
        
        <motion.h1 
          custom={1} initial="hidden" animate="visible" variants={fadeInVariant}
          className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-500"
        >
          We build space architectures for premium focus and deep rest.
        </motion.h1>

        <motion.p 
          custom={2} initial="hidden" animate="visible" variants={fadeInVariant}
          className="mt-6 max-w-2xl text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed"
        >
          Equinox emerged out of a distinct frustration: booking luxury rooms felt transactional, while boutique properties lacked reliable technology. We fixed both.
        </motion.p>
      </section>

      {/* SECTION 2: BENTO VISUAL FRAMEWORK */}
      <section className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px] md:auto-rows-[340px]">
          
          {/* Big Feature Hero Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" 
              alt="Premium architectural suite interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 max-w-lg">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">Signature Aesthetics</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">Villas that respect natural geography.</h2>
            </div>
          </motion.div>

          {/* Side Panel 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40"
          >
            <div className="absolute inset-0 bg-neutral-950/40 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" 
              alt="Minimalist design interior detailing" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Side Panel 2 - Text Callout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 p-8 flex flex-col justify-end border border-neutral-200/60 dark:border-neutral-800/60"
          >
            <HiOutlineCircleStack className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-6" />
            <h3 className="text-lg font-bold tracking-tight">Fully Connected Ecosystem</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Integrate local transit access, temperature configuration arrays, and dynamic lighting presets directly from your account page.
            </p>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: METRIC PLATFORM MATRIX */}
      <section className="py-24 my-12 border-t border-b border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-100/40 dark:bg-neutral-900/10">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 text-center">
            {STATS.map((stat, idx) => (
              <motion.div 
                key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-2">
                  {stat.label}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {stat.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE VALUE MATRIX */}
      <section className="px-6 py-16 mx-auto max-w-7xl lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          
          <div className="lg:pr-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Our Foundations</h2>
            <p className="text-3xl font-extrabold tracking-tight mt-2 sm:text-4xl">What drives every placement decision.</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
              We operate strictly in the service of high architectural character, predictable technology platforms, and ultimate human privacy patterns.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div 
                  key={val.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 flex flex-col items-start shadow-sm"
                >
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-4">
                    {val.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 5: LEADERSHIP MATRIX */}
      <section className="px-6 py-16 mx-auto max-w-7xl lg:px-8 lg:py-24 border-t border-neutral-200/40 dark:border-neutral-800/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 justify-center">
            <HiOutlineUserGroup className="h-4 w-4" />
            Curators & Structors
          </div>
          <h2 className="text-3xl font-bold tracking-tight mt-2 sm:text-4xl">The Team</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Engineers, designers, and real estate operators aligning elite spaces with seamless code templates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP.map((member, idx) => (
            <motion.div 
              key={member.name} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-start p-4 rounded-3xl border border-neutral-200/30 dark:border-neutral-800/30 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md group"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-4">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 filter grayscale group-hover:grayscale-0" 
                />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {member.name}
              </h3>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {member.role}
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: CONVERTING ACTION BAR */}
      <section className="px-6 py-20 mx-auto max-w-7xl lg:px-8 text-center">
        <div className="relative rounded-3xl bg-neutral-900 px-6 py-16 shadow-2xl overflow-hidden sm:px-12 md:py-20 border border-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-neutral-900/50 z-0" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to feel the difference?
            </h2>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
              Book your initial spatial exploration setting. Enjoy full automated checking protocols and immediate premium configurations.
            </p>
            <Button
              as={Link}
              href="/rooms"
              color="primary"
              radius="xl"
              className="mt-8 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 transition-all group flex items-center gap-2 active:scale-98"
            >
              Browse Premium Stays
              <FaArrowRightLong className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}