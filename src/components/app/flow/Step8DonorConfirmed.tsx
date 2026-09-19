import React from "react";
import { CheckCheck, Sparkles, PhoneCall, Navigation, MessageSquare, ShieldCheck, MapPin, Clock, ArrowRight, Share2, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/app/Primitives";
import { BloodGroupBadge } from "@/components/app/Badges";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import type { BloodGroup, Donor } from "@/types";
import { km } from "@/utils/format";

interface Step8Props {
  donor: Donor;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  requestCode: string;
  onProceedToNotification: () => void;
}

export function Step8DonorConfirmed({
  donor,
  bloodGroup,
  units,
  hospital,
  requestCode,
  onProceedToNotification,
}: Step8Props) {
  const donorPhoneNumber = "+91 98765 43210";

  const mapMarkers: MapMarker[] = [
    {
      id: "hospital-target",
      kind: "request",
      position: { x: 50, y: 50 },
      label: hospital.split(",")[0],
      highlight: true,
    },
    {
      id: donor.id,
      kind: "donor",
      position: donor.position,
      label: `${donor.name.split(" ")[0]} (En Route)`,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* CELEBRATION HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-black tracking-wide uppercase backdrop-blur-md">
            <Sparkles className="size-4 animate-bounce text-yellow-300" />
            STEP 8: DONOR CONFIRMED
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
                DONOR CONFIRMED! 🩸✅
              </h1>
              <p className="mt-2 text-sm text-emerald-100 font-medium">
                {donor.name} is on their way to <strong>{hospital}</strong>.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 text-center border border-white/20 shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Tracking Code</span>
              <span className="text-lg font-black font-mono tracking-widest">{requestCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMED DONOR CONTACT & STATUS CARD */}
      <div className="rounded-3xl bg-card p-6 shadow-card border-2 border-emerald-500/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-4">
            <Avatar name={donor.name} size="xl" className="shadow-lg ring-4 ring-emerald-500/30" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">{donor.name}</h2>
                <BloodGroupBadge group={donor.bloodGroup} size="md" />
              </div>

              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                Status: En Route (ETA 12-15 Mins)
              </p>

              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{donor.area}</span>
                <span>·</span>
                <span>{km(donor.distanceKm)} away</span>
                <span>·</span>
                <span className="font-bold text-foreground">{donor.donations} Past Donations</span>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 px-3.5 py-2 text-xs font-black text-emerald-700 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="size-4" /> Verified Blood Donor
          </span>
        </div>

        {/* Direct Action Buttons: Phone Call & Directions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`tel:${donorPhoneNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm h-14 shadow-glow hover:bg-emerald-700 transition-all"
          >
            <PhoneCall className="size-5 animate-pulse" />
            CALL DONOR ({donorPhoneNumber})
          </a>

          <Button
            size="lg"
            variant="outline"
            onClick={() => alert(`Opening live navigation route to ${hospital}...`)}
            className="h-14 rounded-2xl font-bold text-sm border-primary/40 text-primary hover:bg-primary-soft"
          >
            <Navigation className="size-4 mr-1.5 text-primary" />
            Get Live Directions / Track Route
          </Button>
        </div>
      </div>

      {/* Route & Map Tracking */}
      <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <MapPin className="size-4 text-emerald-600" />
            Donor Live Route Tracking
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
            Active GPS Route
          </span>
        </div>

        <div className="h-[200px] w-full rounded-2xl overflow-hidden relative">
          <MapPlaceholder markers={mapMarkers} className="size-full" />
        </div>
      </div>

      {/* Next Step Action */}
      <Button
        onClick={onProceedToNotification}
        size="lg"
        className="w-full h-14 rounded-2xl font-extrabold text-base gradient-brand text-white shadow-glow"
      >
        VIEW SYSTEM NOTIFICATIONS & TIMELINE (STEP 9)
        <ArrowRight className="size-5 ml-2" />
      </Button>
    </div>
  );
}
