"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, ShieldCheck, Award } from "lucide-react";

// Mock Data for Platform Analytics (Real structural context data)
const CHART_DATA = [
  { month: "Jan", bookings: 1200 },
  { month: "Feb", bookings: 1900 },
  { month: "Mar", bookings: 3200 },
  { month: "Apr", bookings: 4500 },
  { month: "May", bookings: 5100 },
  { month: "Jun", bookings: 6800 },
];

const STAT_CARDS = [
  {
    id: 1,
    icon: <Users className="h-5 w-5 text-indigo-500" />,
    value: "45,000+",
    label: "Global Guests",
    desc: "Verified active platform travelers.",
  },
  {
    id: 2,
    icon: <Award className="h-5 w-5 text-violet-500" />,
    value: "4.92 / 5",
    label: "Average Stay Rating",
    desc: "Consistently exceptional host experiences.",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-5 w-5 text-indigo-500" />,
    value: "100%",
    label: "Secure Booking",
    desc: "Encrypted structural escrow protection.",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-neutral-50 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Grid Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Side: Real Copy Copywriting Context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Platform Telemetry
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              Why thousands of travelers trust Equinox Stays
            </h2>

            <p className="text-base leading-7 text-neutral-600 dark:text-neutral-400">
              We maintain strict quality control criteria across all listings. From coastal architectural masterpieces to minimal urban studios, our data speaks directly to our dedication to hospitality excellence.
            </p>

            {/* Micro Stats Grid Stack */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STAT_CARDS.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col rounded-xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    {stat.icon}
                  </div>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Recharts Interactive Area Graph */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-100 w-full rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 flex flex-col justify-center"
          >
            <div className="mb-4 flex flex-col">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Monthly Bookings Trajectory
              </span>
              <span className="text-xs text-neutral-500">
                Total completed dynamic reservations across the network
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}