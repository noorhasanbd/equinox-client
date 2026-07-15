"use client";

import React from "react";
import dynamic from "next/dynamic";
import { authClient } from "@/lib/auth-client";
import { Card, Link } from "@heroui/react";
import { Hotel, BedDouble, CalendarCheck, ArrowUpRight, TrendingUp } from "lucide-react";

// Safe non-SSR dynamic imports for Recharts to prevent Next.js hydration errors
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((mod) => mod.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Mock dynamic data reflecting an owner's hotel portfolio metrics
const revenueData = [
  { month: "Jan", revenue: 42000, bookings: 240 },
  { month: "Feb", revenue: 48000, bookings: 290 },
  { month: "Mar", revenue: 61000, bookings: 370 },
  { month: "Apr", revenue: 58000, bookings: 340 },
  { month: "May", revenue: 73000, bookings: 420 },
  { month: "Jun", revenue: 89000, bookings: 510 },
];

export default function OwnerOverviewPage() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Host";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Summary, {firstName}! 💼</h1>
        <p className="text-sm text-default-500">
          Track revenue momentum, property performance, and checkout patterns across your collection.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Hotels */}
        <Card className="border border-divider bg-content1 shadow-none">
          <Card.Content className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-500">Total Hotels</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">14</h3>
              <p className="text-2xs text-default-400">3 regions globally</p>
            </div>
            <div className="p-3 bg-default-100 rounded-xl">
              <Hotel className="h-5 w-5 text-primary" />
            </div>
          </Card.Content>
        </Card>

        {/* Total Rooms */}
        <Card className="border border-divider bg-content1 shadow-none">
          <Card.Content className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-500">Total Rooms</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">580</h3>
              <p className="text-2xs text-success-500 font-medium">92% active allotment</p>
            </div>
            <div className="p-3 bg-default-100 rounded-xl">
              <BedDouble className="h-5 w-5 text-primary" />
            </div>
          </Card.Content>
        </Card>

        {/* Total Bookings */}
        <Card className="border border-divider bg-content1 shadow-none">
          <Card.Content className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-default-500">Total Bookings (MTD)</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">2,184</h3>
              <p className="text-2xs text-success-500 font-medium">+14.2% vs last month</p>
            </div>
            <div className="p-3 bg-default-100 rounded-xl">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Main Graph & Quick Actions Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recharts Area Performance Graph */}
        <Card className="border border-divider bg-content1 shadow-none md:col-span-2">
          <Card.Content className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue Performance</h3>
                <p className="text-2xs text-default-500">Gross processing value year-to-date</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-success-500">
                <TrendingUp className="h-3 w-3" />
                <span>Steady Growth</span>
              </div>
            </div>

            {/* Container maintains graph sizing dynamically */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Maps automatically to your theme colors */}
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--heroui-primary, #2563eb)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--heroui-primary, #2563eb)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    className="text-default-400"
                  />
                  <YAxis 
                    stroke="currentColor" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    className="text-default-400"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "var(--heroui-content1, #fff)", 
                      borderColor: "var(--heroui-divider, #e5e5e5)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--heroui-foreground, #000)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--heroui-primary, #2563eb)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        {/* Dynamic Navigation/Links Control Panel */}
        <Card className="border border-divider bg-content1 shadow-none">
          <Card.Content className="p-6 flex flex-col justify-between h-full min-h-[250px]">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Operational Portal</h3>
                <p className="text-xs text-default-500">Shortcut links to your daily management tools.</p>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/dashboard/properties" 
                  className="flex items-center justify-between p-3 rounded-xl border border-divider hover:bg-default-50 transition-colors text-xs font-semibold text-foreground w-full"
                >
                  <span>Inventory Matrix</span>
                  <ArrowUpRight className="h-4 w-4 text-default-400" />
                </Link>

                <Link 
                  href="/dashboard/rates" 
                  className="flex items-center justify-between p-3 rounded-xl border border-divider hover:bg-default-50 transition-colors text-xs font-semibold text-foreground w-full"
                >
                  <span>Yield & Dynamic Rates</span>
                  <ArrowUpRight className="h-4 w-4 text-default-400" />
                </Link>

                <Link 
                  href="/dashboard/bookings" 
                  className="flex items-center justify-between p-3 rounded-xl border border-divider hover:bg-default-50 transition-colors text-xs font-semibold text-foreground w-full"
                >
                  <span>Verify Reservations</span>
                  <ArrowUpRight className="h-4 w-4 text-default-400" />
                </Link>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}