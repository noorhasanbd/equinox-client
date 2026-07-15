"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Card, Link } from "@heroui/react";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  CalendarDays, 
  ChevronRight, 
  ArrowUpRight, 
  Gift, 
  ArrowRight,
  BedDouble
} from "lucide-react";

// Mock data representing current traveler context
const currentItinerary = {
  hotelName: "The Grand Horizon Resort",
  location: "Maui, Hawaii",
  roomType: "Signature Oceanfront Suite",
  dates: "Jul 24 - Jul 27, 2026",
  status: "Check-in ready",
  image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80"
};

const trendingDestinations = [
  { name: "Amangiri Retreat", location: "Canyon Point, Utah", price: "$450/pn", icon: BedDouble },
  { name: "Kyoto Machiya Villa", location: "Kyoto, Japan", price: "$320/pn", icon: Compass },
];

export default function GuestOverviewPage() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Traveler";

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="h-3 w-3" /> Personalized Dashboard
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Where next, {firstName}? ✨</h1>
          <p className="text-sm text-default-500">Manage your high-tier properties, itineraries, and member rewards.</p>
        </div>
        
        {/* Quick Utility Action */}
        <Link 
          href="/dashboard/bookings" 
          className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 transition-opacity flex items-center gap-1.5 w-max"
        >
          View Bookings Archive <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Asymmetric Modern Dashboard Layout */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column Stack (2/3 width on wide viewports) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Trip Hero Highlight Card */}
          <Card className="border border-divider bg-content1 shadow-none overflow-hidden relative group">
            <Card.Content className="p-0 flex flex-col sm:flex-row">
              {/* Visual Split */}
              <div className="sm:w-2/5 min-h-[160px] relative bg-default-100 overflow-hidden">
                <img 
                  src={currentItinerary.image} 
                  alt={currentItinerary.hotelName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-2xs font-bold uppercase bg-background/90 backdrop-blur-md rounded-lg text-primary shadow-sm border border-divider">
                  Upcoming Stay
                </span>
              </div>

              {/* Text Matrix Content */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-2xs text-default-400 font-medium">
                    <MapPin className="h-3 w-3" /> {currentItinerary.location}
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{currentItinerary.hotelName}</h3>
                  <p className="text-xs text-default-500">{currentItinerary.roomType}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-divider/60">
                  <div className="flex items-center gap-1.5 text-xs text-default-600">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>{currentItinerary.dates}</span>
                  </div>
                  
                  <Link 
                    href="/dashboard/bookings" 
                    className="text-xs font-semibold text-primary flex items-center gap-0.5 hover:underline"
                  >
                    Manage <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Quick Curated Destinations Discovery Feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-default-400">Curated Collections for you</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {trendingDestinations.map((dest, idx) => {
                const IconComponent = dest.icon;
                return (
                  <Card key={idx} className="border border-divider bg-content1 shadow-none hover:border-default-400 transition-colors">
                    <Card.Content className="p-4 flex items-start gap-4">
                      <div className="p-3 bg-default-50 border border-divider rounded-xl shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h5 className="text-xs font-bold text-foreground truncate">{dest.name}</h5>
                        <p className="text-2xs text-default-400 truncate">{dest.location}</p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-semibold text-foreground">{dest.price}</span>
                          <Link href="/" className="text-2xs font-semibold text-primary flex items-center gap-0.5 hover:underline">
                            Explore <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar Stack (1/3 width) */}
        <div className="space-y-6">
          
          {/* Elite Loyalty Tier Progress Indicator Panel */}
          <Card className="border border-divider bg-content1 shadow-none">
            <Card.Content className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <span className="text-2xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                  Gold Status
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">Loyalty Rewards Track</h4>
                <p className="text-2xs text-default-500">2 more nights until unlocking complimentary room upgrades globally.</p>
              </div>

              {/* Inline Graphical Level Indicator */}
              <div className="space-y-1">
                <div className="w-full bg-default-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-4/5 rounded-full" />
                </div>
                <div className="flex justify-between text-3xs font-semibold text-default-400">
                  <span>8 / 10 Nights</span>
                  <span>Platinum Tier</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Verification Callout Action Grid */}
          <Card className="border border-divider bg-default-50 shadow-none">
            <Card.Content className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Verify Profile Settings</span>
              </div>
              <p className="text-2xs text-default-600 leading-normal">
                Complete your identity token profile setup to activate automatic instantaneous checking status procedures across all luxury properties.
              </p>
              <Link 
                href="/dashboard/profile" 
                className="inline-flex text-2xs font-bold text-primary hover:underline pt-1"
              >
                Go to settings &rarr;
              </Link>
            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
}