import React from "react";
import { LayoutDashboard, Siren, MapPin, Clock, ShieldCheck, CheckCircle2, XCircle, Navigation, Phone, Droplet, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/app/Primitives";
import { BloodGroupBadge, UrgencyBadge } from "@/components/app/Badges";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import type { BloodGroup, Donor, Urgency } from "@/types";
import { km } from "@/utils/format";

interface Step6Props {
  donor: Donor;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: Urgency;
  patientNote?: string;
  onAccept: () => void;
  onDecline?: () => void;
}

export function Step6DonorDashboard({
  donor,
  bloodGroup,
  units,
  hospital,
  urgency,
  patientNote,
  onAccept,
  onDecline,
}: Step6Props) {
  const hospitalMarker: MapMarker = {
    id: "hosp-1",
    kind: "request",
    position: { x: 50, y: 50 },
    label: hospital.split(",")[0],
    highlight: true,
  };

  const donorMarker: MapMarker = {
    id: "donor-me",
    kind: "me",
    position: { x: 42, y: 38 },
    label: "Your Location",
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Perspective Switch Header */}
      <div className="rounded-3xl bg-card p-5 shadow-card border-2 border-emerald-500/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
              <UserCheck className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 6 of 9 · Donor Mode</span>
              <h1 className="text-xl font-extrabold text-foreground">Donor Dashboard Overview</h1>
              <p className="text-xs text-muted-foreground">Logged in as: <strong className="text-foreground">{donor.name} ({donor.bloodGroup})</strong></p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500 text-white px-3 py-1 text-xs font-black shadow-sm">
            Active Ready Donor
          </span>
        </div>
      </div>

      {/* INCOMING EMERGENCY ALERT CARD (Pulsating Critical Banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-critical-soft via-card to-critical-soft/40 p-6 shadow-glow border-2 border-critical/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-critical text-white px-3.5 py-1 text-xs font-black tracking-wide uppercase shadow">
            <Siren className="size-4 animate-bounce" />
            INCOMING CRITICAL ALERT
          </div>
          <span className="text-xs font-bold text-critical bg-critical-soft px-2.5 py-1 rounded-full border border-critical/30">
            Just Now (2.1 km away)
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-foreground">{units} Unit{units > 1 ? "s" : ""} of {bloodGroup} Blood Required</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-foreground">
                <MapPin className="size-4 text-critical shrink-0" />
                {hospital}
              </p>
            </div>
            <BloodGroupBadge group={bloodGroup} size="lg" className="shadow-md bg-critical text-white" />
          </div>

          {patientNote && (
            <div className="rounded-2xl bg-card p-3 border border-border/60 text-xs font-medium text-foreground italic">
              &quot;{patientNote}&quot;
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground pt-1">
            <span className="flex items-center gap-1 text-foreground">
              <Navigation className="size-3.5 text-primary" /> Est Travel: 12-14 mins drive
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="size-3.5" /> Verified Hospital Request
            </span>
          </div>
        </div>

        {/* Map route preview */}
        <div className="h-[140px] w-full rounded-2xl overflow-hidden border border-border/60 shadow-inner relative">
          <MapPlaceholder markers={[hospitalMarker, donorMarker]} legend={false} className="size-full" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            size="lg"
            onClick={onAccept}
            className="h-14 rounded-2xl font-extrabold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow"
          >
            <CheckCircle2 className="size-5 mr-2" />
            ACCEPT REQUEST (I CAN DONATE NOW)
          </Button>

          {onDecline && (
            <Button
              size="lg"
              variant="outline"
              onClick={onDecline}
              className="h-14 rounded-2xl font-bold text-sm border-border text-muted-foreground hover:bg-muted"
            >
              <XCircle className="size-4 mr-1.5" />
              Decline / Currently Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
