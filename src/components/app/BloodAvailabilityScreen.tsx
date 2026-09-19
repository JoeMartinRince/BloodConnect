import React, { useState } from "react";
import { Building2, MapPin, Phone, Droplet, Search, ShieldCheck, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge } from "@/components/app/Badges";
import { LocationSelector } from "@/components/app/LocationSelector";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";
import { useLocation } from "@/hooks/useLocation";
import { bloodBanks } from "@/data/facilities";
import { calculateDistance } from "@/utils/geo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function BloodAvailabilityScreen() {
  const { location } = useLocation();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | "all">("all");

  // Dynamic distance computation using Haversine formula
  const facilities = bloodBanks.map((b) => {
    const d = calculateDistance(location.lat, location.lng, b.lat || 9.26, b.lng || 76.78);
    return { ...b, distanceKm: d };
  });

  const filteredFacilities = facilities.filter(
    (b) => selectedGroup === "all" || b.availableGroups.includes(selectedGroup)
  );

  const markers: MapMarker[] = [
    {
      id: "user-me",
      kind: "me",
      position: { x: 50, y: 50 },
      label: "You",
    },
    ...filteredFacilities.map((b) => ({
      id: b.id,
      kind: "bank" as const,
      position: b.position,
      label: b.name.split(" ")[0],
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
            <Building2 className="size-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">District Network</span>
            <h1 className="text-xl font-extrabold text-foreground">Blood Availability Near You</h1>
            <p className="text-xs text-muted-foreground">Live stock availability at blood banks in {location.district}.</p>
          </div>
        </div>

        <LocationSelector />
      </div>

      {/* Filter by Blood Type */}
      <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Filter Stock by Blood Type:
        </span>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedGroup("all")}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border shrink-0 cursor-pointer",
              selectedGroup === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            All Stock
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setSelectedGroup(bg)}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all border shrink-0 cursor-pointer",
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

      {/* District Map Overview */}
      <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <MapPin className="size-4 text-primary" />
            District Blood Banks Map
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
            {filteredFacilities.length} Facilities Open
          </span>
        </div>
        <div className="h-[200px] w-full rounded-2xl overflow-hidden relative">
          <MapPlaceholder markers={markers} className="size-full" />
        </div>
      </div>

      {/* Facility Cards List */}
      <div className="space-y-4">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3.5 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-foreground">{facility.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    🟢 {facility.isOpen ? "Open Now" : "Closed"} ({facility.hours})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <MapPin className="size-3.5 text-primary" />
                  {facility.address} · <strong className="text-foreground">{facility.distanceKm} km away</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${facility.phone}`}
                  className="rounded-xl bg-muted p-2 text-xs font-bold text-foreground hover:bg-accent flex items-center gap-1"
                >
                  <Phone className="size-3.5 text-primary" /> {facility.phone}
                </a>
              </div>
            </div>

            {/* Available Blood Stock Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase block">Available Blood Groups Stock:</span>
              <div className="flex flex-wrap gap-2">
                {facility.availableGroups.map((bg) => (
                  <span
                    key={bg}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-extrabold border shadow-sm",
                      selectedGroup === bg
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/60 text-foreground border-border/60"
                    )}
                  >
                    <BloodGroupBadge group={bg} size="sm" />
                    <span>In Stock</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                size="sm"
                className="h-10 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                onClick={() => toast.success(`Requesting stock reservation at ${facility.name}...`)}
              >
                <Droplet className="size-3.5 mr-1" />
                Request Units Stock
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-10 rounded-2xl font-bold border-border text-foreground hover:bg-muted text-xs"
                onClick={() => alert(`Opening GPS directions to ${facility.name}...`)}
              >
                <Navigation className="size-3.5 mr-1 text-primary" />
                Get Directions
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
