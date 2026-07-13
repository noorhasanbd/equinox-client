"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Card, Button, Link } from "@heroui/react";
import { Compass, CalendarDays, ArrowRight, Sparkles } from "lucide-react";

export default function GuestOverviewPage() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}! 👋</h1>
        <p className="text-sm text-neutral-500">Ready for your next adventure? Manage your stays right here.</p>
      </div>

      {/* Action Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-none border-0">
          <Card.Content className="p-6 justify-between min-h-[160px] flex flex-col">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 opacity-90" />
                <h3 className="text-lg font-bold">Discover New Stays</h3>
              </div>
              <p className="text-xs text-blue-100 mt-2 max-w-sm">
                Explore premium hotels, beachfront villas, and hidden retreats curated for your next escape.
              </p>
            </div>
            <Button as={Link} href="/" size="sm" className="bg-white text-blue-700 font-semibold w-max mt-4">
              Explore Hotels
            </Button>
          </Card.Content>
        </Card>

        <Card className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900/50">
          <Card.Content className="p-6 flex flex-row items-start gap-4">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl shrink-0">
              <CalendarDays className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold">Upcoming Bookings</h3>
              <p className="text-xs text-neutral-500">You don't have any stays scheduled right now.</p>
              <Button 
                as={Link} 
                href="/dashboard/bookings" 
                variant="light" 
                color="primary"
                size="sm"
                className="p-0 h-auto font-medium flex items-center gap-1 mt-3"
              >
                View booking archive <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Tip Banner */}
      <Card className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 shadow-none">
        <Card.Content className="p-4 flex flex-row items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Complete your profile settings verification to unlock instant booking validations on selected luxury suites.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}