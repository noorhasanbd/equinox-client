"use client";

import React from "react";
import { Card, Button, Link } from "@heroui/react";
import { ShieldAlert, Users, Percent, AlertTriangle, Terminal } from "lucide-react";

export default function AdminOverviewPage() {
  const globalMetrics = [
    { label: "Total Platform Users", value: "14,820", icon: Users },
    { label: "Pending Owner Approvals", value: "12", icon: ShieldAlert, alert: true },
    { label: "Platform Take Rate Fee", value: "12.5%", icon: Percent },
  ];

  return (
    <div className="space-y-6">
      {/* Infrastructure Node Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global System Admin Node</h1>
        <p className="text-sm text-neutral-500">Realtime tracking across platform infrastructure and accounts metrics.</p>
      </div>

      {/* Platform Status Blocks */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {globalMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900/50">
              <Card.Content className="p-5 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${
                  metric.alert 
                    ? "bg-red-50 dark:bg-red-950/40 text-red-600" 
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Critical Core Operational Alert Cards */}
      <div className="space-y-3">
        <Card className="border border-amber-200 dark:border-amber-900/30 bg-amber-50/10 shadow-none">
          <Card.Content className="p-4 flex flex-row items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Scheduled Routine Base Maintenances</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Database storage replication updates are queued to deploy automatically at 02:00 UTC. Performance drops should remain minimal.
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-none">
          <Card.Content className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-neutral-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Verification Audit Logs</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Review platform-wide authorization overrides and login histories.</p>
              </div>
            </div>
            <Button as={Link} href="/dashboard/global-analytics" size="sm" color="default" variant="flat">
              Open Audit Console
            </Button>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}