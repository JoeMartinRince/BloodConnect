import React, { useState } from "react";
import { Siren, Droplet, Building2, MapPin, ArrowRight, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge, RequestStatusBadge } from "@/components/app/Badges";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { useLocation } from "@/hooks/useLocation";
import { bloodBanks } from "@/data/facilities";
import { donors } from "@/data/donors";
import { km } from "@/utils/format";
import { calculateDistance } from "@/utils/geo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SeekerHomeProps {
  onStartCreateRequest: (prefillGroup?: BloodGroup) => void;
  onSelectTab: (tabId: string) => void;
}

export function SeekerHome({ onStartCreateRequest, onSelectTab }: SeekerHomeProps) {
  const { user, requests } = useAppStore();
  const { location } = useLocation();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("O+");

  // Calculate dynamic distance for facilities
  const facilitiesWithDistance = bloodBanks.map((b) => {
    const d = calculateDistance(location.lat, location.lng, b.lat || 9.26, b.lng || 76.78);
    return { ...b, distanceKm: d };
  });

  // Check 2-way availability: Blood Banks with stock vs Donors
  const stockAtBanks = facilitiesWithDistance.filter((b) =>
    b.availableGroups.includes(selectedGroup)
  );

  const compatibleDonors = donors.filter(
    (d) => d.bloodGroup === selectedGroup && d.availability === "available"
  );

  const markers: MapMarker[] = [
    {
      id: "me",
      kind: "me",
      position: { x: 50, y: 50 },
      label: "Your Location",
    },
    ...stockAtBanks.slice(0, 3).map((b) => ({
      id: b.id,
      kind: "bank" as const,
      position: b.position,
      label: `${b.name.split(" ")[0]} (${selectedGroup})`,
    })),
    ...compatibleDonors.slice(0, 4).map((d) => ({
      id: d.id,
      kind: "donor" as const,
      position: d.position,
      label: `${d.name.split(" ")[0]} (${d.bloodGroup})`,
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Greeting */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-critical">Blood Seeker View</span>
        <h1 className="text-2xl font-black text-foreground">
          Good morning, {user?.name || "Alex"} 👋
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Emergency blood search & hospital stock availability engine.
        </p>
      </div>

      {/* Emergency Trigger Hero Card */}
      <div className="relative overflow-hidden rounded-3xl gradient-critical p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute -right-8 -bottom-8 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black tracking-wide uppercase backdrop-blur-md">
            <Siren className="size-4 animate-bounce text-yellow-300" />
            🚨 Need Blood Urgently?
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Donors & Blood Banks Near You
          </h2>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            System automatically scans both nearby verified hospital blood banks and active registered donors.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => onStartCreateRequest()}
              className="bg-white text-critical hover:bg-white/90 font-black shadow-lg rounded-2xl h-12 px-6 text-sm"
            >
              <Droplet className="size-5 fill-current text-critical mr-1.5" />
              CREATE BLOOD REQUEST
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => onSelectTab("find")}
              className="bg-black/20 border-white/30 text-white hover:bg-black/40 font-bold rounded-2xl h-12 px-5 text-sm backdrop-blur"
            >
              <Building2 className="size-4 mr-1.5" />
              Find Blood Banks
            </Button>
          </div>
        </div>
      </div>

      {/* TWO-WAY AVAILABILITY FINDER SECTION */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Search className="size-4 text-primary" />
              Two-Way Blood Availability Checker
            </h2>
            <p className="text-xs text-muted-foreground">
              Select blood type to check both Hospital Blood Banks AND Donor Network.
            </p>
          </div>

          {/* Blood group selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-black text-xs transition-all border shrink-0 cursor-pointer",
                  selectedGroup === bg
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Way Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CHOICE 1: NEARBY BLOOD BANKS */}
          <div className="rounded-2xl bg-primary/10 p-4 border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                <Building2 className="size-4" />
                CHOICE 1: Nearby Blood Banks ({stockAtBanks.length})
              </span>
              <span className="text-[10px] font-bold bg-primary-soft text-primary px-2 py-0.5 rounded-full">
                Instant Stock
              </span>
            </div>

            {stockAtBanks.length > 0 ? (
              <div className="space-y-2">
                {stockAtBanks.slice(0, 2).map((bank) => (
                  <div key={bank.id} className="rounded-xl bg-card p-3 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{bank.name}</span>
                      <span className="font-bold text-emerald-600">{bank.distanceKm} km away</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{bank.address}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                        {selectedGroup} Available in Stock
                      </span>
                      <Button
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-bold bg-primary text-white hover:bg-primary-dark"
                        onClick={() => toast.success(`Request sent to ${bank.name} for ${selectedGroup} blood.`)}
                      >
                        Request Stock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-3 text-center">
                No immediate {selectedGroup} stock in nearby blood banks. Try donor network.
              </p>
            )}
          </div>

          {/* CHOICE 2: COMPATIBLE DONOR NETWORK */}
          <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Users className="size-4" />
                CHOICE 2: Compatible Donors ({compatibleDonors.length})
              </span>
              <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                Active Donors
              </span>
            </div>

            {compatibleDonors.length > 0 ? (
              <div className="space-y-2">
                {compatibleDonors.slice(0, 2).map((donor) => (
                  <div key={donor.id} className="rounded-xl bg-card p-3 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{donor.name}</span>
                      <span className="font-bold text-emerald-600">{donor.distanceKm} km away</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{donor.area} · Active {donor.lastActive}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                      <Button
                        size="sm"
                        className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => onStartCreateRequest(donor.bloodGroup)}
                      >
                        Dispatch Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-3 text-center">
                No donors online for {selectedGroup}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Overview */}
      <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <MapPin className="size-4 text-primary" />
            District Availability Map ({location.district})
          </span>
          <span className="text-[11px] text-muted-foreground">Showing banks & donors</span>
        </div>
        <div className="h-[200px] w-full rounded-2xl overflow-hidden relative">
          <MapPlaceholder markers={markers} className="size-full" />
        </div>
      </div>

      {/* Recent Active Requests */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <h3 className="text-sm font-extrabold text-foreground">Your Active Requests</h3>

        {requests.length > 0 ? (
          <div className="space-y-2.5">
            {requests.slice(0, 3).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={req.bloodGroup} size="sm" />
                  <div>
                    <p className="font-bold text-foreground">#{req.code} · {req.units} Units</p>
                    <p className="text-muted-foreground">{req.hospital}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RequestStatusBadge status={req.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No active blood requests created yet.</p>
        )}
      </div>
    </div>
  );
}
