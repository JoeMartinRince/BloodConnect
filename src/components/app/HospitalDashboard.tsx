import React, { useState } from "react";
import {
  Hospital,
  Boxes,
  Siren,
  Activity,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge, UrgencyBadge } from "@/components/app/Badges";
import { BLOOD_GROUPS, type BloodGroup, type HospitalRequest } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useLocation } from "@/hooks/useLocation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ANALYTICS_DATA = [
  { name: "A+", units: 12, color: "#e11d48" },
  { name: "A-", units: 3, color: "#f43f5e" },
  { name: "B+", units: 18, color: "#e11d48" },
  { name: "B-", units: 2, color: "#f43f5e" },
  { name: "AB+", units: 7, color: "#e11d48" },
  { name: "AB-", units: 1, color: "#f43f5e" },
  { name: "O+", units: 15, color: "#e11d48" },
  { name: "O-", units: 2, color: "#f43f5e" },
];

interface HospitalDashboardProps {
  onSelectTab: (tabId: string) => void;
  onStartSupplyRequest: () => void;
}

export function HospitalDashboard({ onSelectTab, onStartSupplyRequest }: HospitalDashboardProps) {
  const { user, inventory, hospitalRequests } = useAppStore();
  const { location } = useLocation();

  const hospitalTitle = user?.hospitalName || "District Blood Centre";

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
            <Hospital className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{hospitalTitle}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-500/30">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Operational
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              District Central Blood Bank & Emergency Dispatch Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onStartSupplyRequest}
            size="sm"
            className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-4 shadow-md"
          >
            <Plus className="size-4 mr-1" />
            New Supply Request
          </Button>
        </div>
      </div>

      {/* ANALYTICS STATS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Today&apos;s Requests</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">12</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3.5" /> +15%
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Units Issued</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-600">27</span>
            <span className="text-xs font-semibold text-muted-foreground">units</span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Emergency Matches</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600">8</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              100% Rate
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase text-muted-foreground">Donors Connected</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-primary">34</span>
            <span className="text-xs font-semibold text-muted-foreground">nearby</span>
          </div>
        </div>
      </div>

      {/* INVENTORY SUMMARY GRID (8 BLOOD GROUPS) */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="size-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-foreground">Hospital Blood Inventory Summary</h2>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("inventory")}
            className="rounded-full border-indigo-500/30 text-indigo-600 font-bold hover:bg-indigo-50 text-xs"
          >
            Manage Inventory & Expiry
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {BLOOD_GROUPS.map((bg) => {
            const item = inventory[bg] || { availableUnits: 0, reservedUnits: 0 };
            const isLow = item.availableUnits <= 2;
            return (
              <div
                key={bg}
                onClick={() => onSelectTab("inventory")}
                className={cn(
                  "rounded-2xl p-3.5 border transition-all cursor-pointer text-center space-y-1",
                  isLow
                    ? "bg-amber-500/10 border-amber-500/40 hover:border-amber-500"
                    : "bg-muted/40 border-border/60 hover:border-indigo-500/50 hover:bg-indigo-500/5"
                )}
              >
                <BloodGroupBadge group={bg} size="sm" />
                <span className="text-xl font-black text-foreground block tabular-nums mt-1">
                  {item.availableUnits} <span className="text-[10px] font-bold text-muted-foreground">units</span>
                </span>
                {item.reservedUnits > 0 && (
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded-full block">
                    {item.reservedUnits} Reserved
                  </span>
                )}
                {isLow && (
                  <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded-full block">
                    Low Stock
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RECHARTS VISUALIZATION CHART */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <Activity className="size-4 text-indigo-600" />
          Blood Inventory Distribution Chart
        </h3>

        <div className="h-[220px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "1rem",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="units" radius={[8, 8, 0, 0]}>
                {ANALYTICS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.units <= 3 ? "#f59e0b" : "#6366f1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVE EMERGENCY REQUESTS */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Siren className="size-5 text-critical animate-pulse" />
            <h2 className="text-base font-extrabold text-foreground">🚨 ACTIVE EMERGENCY REQUESTS</h2>
          </div>

          <Button
            size="sm"
            onClick={onStartSupplyRequest}
            className="rounded-full bg-critical hover:bg-critical/90 text-white font-bold text-xs"
          >
            + New Emergency Request
          </Button>
        </div>

        {hospitalRequests.length > 0 ? (
          <div className="space-y-3">
            {hospitalRequests.map((hr) => (
              <div
                key={hr.id}
                className="rounded-2xl bg-gradient-to-r from-critical-soft/30 via-card to-card p-4 border border-critical/30 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BloodGroupBadge group={hr.bloodGroup} size="sm" />
                    <h3 className="font-extrabold text-foreground text-sm">
                      {hr.bloodGroup} · {hr.unitsNeeded} Units Required (Patient: {hr.patientId})
                    </h3>
                    <UrgencyBadge urgency={hr.urgency} />
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>Internal Stock Used: <strong>{hr.internalInventoryUsed}</strong></span>
                    <span>·</span>
                    <span>Donors Needed: <strong>{hr.donorUnitsRequested}</strong></span>
                    <span>·</span>
                    <span className="font-bold text-emerald-600">
                      Confirmed Donors: {hr.confirmedDonors.length}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => onSelectTab("requests")}
                    className="rounded-xl font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 text-xs px-3"
                  >
                    View 3-Step Supply Match
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No active emergency supply requests.</p>
        )}
      </div>
    </div>
  );
}
