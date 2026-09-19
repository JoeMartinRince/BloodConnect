import React from "react";
import {
  Hospital,
  Boxes,
  Siren,
  Activity,
  Plus,
  AlertTriangle,
  ArrowRight,
  Users,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge, UrgencyBadge } from "@/components/app/Badges";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useLocation } from "@/hooks/useLocation";
import { cn } from "@/lib/utils";

interface HospitalDashboardProps {
  onSelectTab: (tabId: string) => void;
  onStartSupplyRequest: () => void;
}

export function HospitalDashboard({ onSelectTab, onStartSupplyRequest }: HospitalDashboardProps) {
  const { user, inventory, hospitalRequests } = useAppStore();
  const { location } = useLocation();

  const hospitalName = user?.hospitalName || "Pushpagiri Medical College Hospital";
  const activeEmergencyCount = hospitalRequests.length;
  const primaryRequest = hospitalRequests[0];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 1. GREETING & HOSPITAL HEADER */}
      <div className="rounded-3xl bg-card p-5 sm:p-6 shadow-card border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Hospital className="size-4" />
              Pushpagiri Medical College Hospital
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-500/30">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              🟢 Verified Hospital
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Good morning, {user?.name || "Alex"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary shrink-0" />
            Hospital Operations Dashboard · Thiruvalla, Pathanamthitta
          </p>
        </div>

        {/* Primary CTA: + New Blood Request */}
        <Button
          onClick={onStartSupplyRequest}
          size="lg"
          className="rounded-2xl font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 shadow-md shrink-0 text-xs sm:text-sm"
        >
          <Plus className="size-4 mr-1.5" />
          + New Blood Request
        </Button>
      </div>

      {/* 2. EMERGENCY REQUEST SUMMARY (PROMINENT) */}
      <div className="rounded-3xl bg-gradient-to-r from-critical-soft via-card to-card p-5 sm:p-6 shadow-glow border-2 border-critical/40 space-y-4">
        <div className="flex items-center justify-between border-b border-critical/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-critical text-white">
              <Siren className="size-4 animate-bounce" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-foreground uppercase">
              🚨 {activeEmergencyCount} ACTIVE EMERGENCY REQUESTS
            </h2>
          </div>
          <span className="text-xs font-bold text-critical bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full border border-critical/30">
            Real-time Priority
          </span>
        </div>

        {primaryRequest ? (
          <div className="rounded-2xl bg-card p-4 sm:p-5 border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <UrgencyBadge urgency={primaryRequest.urgency} />
                <BloodGroupBadge group={primaryRequest.bloodGroup} size="sm" />
                <span className="text-xs font-bold text-muted-foreground">
                  Patient ID: <strong className="text-foreground">{primaryRequest.patientId}</strong>
                </span>
              </div>

              <h3 className="text-lg font-black text-foreground truncate">
                {primaryRequest.unitsNeeded} Units {primaryRequest.bloodGroup} Required
              </h3>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ✓ 1 / {primaryRequest.unitsNeeded} units secured
                </span>
                <span className="text-muted-foreground hidden sm:inline">·</span>
                <span className="text-muted-foreground">
                  Status: <strong className="text-indigo-600 uppercase">SEARCHING DONORS</strong>
                </span>
              </div>
            </div>

            <Button
              onClick={() => onSelectTab("requests")}
              className="rounded-xl font-black bg-critical text-white hover:bg-critical/90 h-10 px-4 shrink-0 text-xs shadow-sm"
            >
              View Request →
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-3">No active emergency requests right now.</p>
        )}
      </div>

      {/* 3. KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Today&apos;s Requests</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">12</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3.5" /> +15%
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Units Issued</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-600">27</span>
            <span className="text-xs font-semibold text-muted-foreground">units</span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Emergency Matches</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600">8</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              100% Rate
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Donors Connected</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-primary">34</span>
            <span className="text-xs font-semibold text-muted-foreground">nearby</span>
          </div>
        </div>
      </div>

      {/* 4. DISTRICT BLOOD NETWORK OVERVIEW */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-foreground">DISTRICT BLOOD NETWORK</h2>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
            Pathanamthitta Hub
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl bg-indigo-500/10 p-3.5 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block">6 Blood Centres</span>
              <span className="text-muted-foreground text-[11px]">Online in Pathanamthitta</span>
            </div>
            <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
          </div>

          <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block">128 Donors Available</span>
              <span className="text-muted-foreground text-[11px]">Active in 15km radius</span>
            </div>
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-amber-700 dark:text-amber-400 block">3 Blood Groups Low</span>
              <span className="text-muted-foreground text-[11px]">O-, B-, AB- stock alert</span>
            </div>
            <AlertTriangle className="size-4 text-amber-600" />
          </div>
        </div>
      </div>

      {/* 5. HOSPITAL INVENTORY */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="size-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-foreground">HOSPITAL INVENTORY</h2>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("inventory")}
            className="rounded-full border-indigo-500/30 text-indigo-600 font-bold hover:bg-indigo-50 text-xs"
          >
            Manage Inventory
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
                  "rounded-2xl p-3 border transition-all cursor-pointer text-center space-y-1",
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
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. EXPIRY ALERT */}
      <div className="rounded-3xl bg-amber-500/10 p-5 border-2 border-amber-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold shadow-md">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
              🟡 Batch Expiry Alert
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              2 units of O+ expire in 3 days (Batch #b-o2).
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => onSelectTab("inventory")}
          className="rounded-xl font-extrabold bg-amber-600 hover:bg-amber-700 text-white h-9 px-4 shrink-0 text-xs shadow-sm"
        >
          View Inventory
        </Button>
      </div>

      {/* 7. NEARBY BLOOD SUPPLY */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            NEARBY BLOOD SUPPLY
          </h2>
          <span className="text-xs text-muted-foreground">Pathanamthitta Region</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 border border-border/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-foreground text-xs">District Blood Centre</span>
              <span className="font-bold text-emerald-600 text-[11px]">4.2 km away</span>
            </div>
            <p className="text-xs text-muted-foreground">Main District Hub, Pathanamthitta</p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                O+ 8 units available
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectTab("requests")}
                className="h-7 text-[11px] font-bold border-indigo-500/30 text-indigo-600 hover:bg-indigo-50"
              >
                Request Inter-Bank
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4 border border-border/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-foreground text-xs">Believers Church Blood Bank</span>
              <span className="font-bold text-emerald-600 text-[11px]">7.8 km away</span>
            </div>
            <p className="text-xs text-muted-foreground">Kuttapuzha, Thiruvalla</p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                O+ 5 units available
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectTab("requests")}
                className="h-7 text-[11px] font-bold border-indigo-500/30 text-indigo-600 hover:bg-indigo-50"
              >
                Request Inter-Bank
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
