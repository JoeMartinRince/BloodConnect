import React, { useState } from "react";
import {
  Heart,
  Siren,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  PhoneCall,
  Navigation,
  XCircle,
  AlertTriangle,
  Award,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BloodGroupBadge, UrgencyBadge } from "@/components/app/Badges";
import { useAppStore } from "@/hooks/useAppStore";
import { useLocation } from "@/hooks/useLocation";
import { bloodRequests } from "@/data/requests";
import type { Availability, BloodGroup, BloodRequest } from "@/types";
import { km } from "@/utils/format";
import { calculateDistance } from "@/utils/geo";
import { MEDICAL_DISCLAIMER } from "@/utils/compatibility";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DonorHome() {
  const { user, donorAvailabilityState, setDonorAvailabilityState, unavailableUntilDate } =
    useAppStore();
  const { location } = useLocation();

  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [confirmedRequest, setConfirmedRequest] = useState<BloodRequest | null>(null);
  const [customUntilDate, setCustomUntilDate] = useState<string>(
    unavailableUntilDate || "2026-10-15"
  );

  const donorBloodGroup: BloodGroup = user?.bloodGroup || "O+";
  const donorName = user?.name || "Rahul Raj";
  const isAvailable = donorAvailabilityState === "available";

  // Dynamic distance calculation for nearby emergency requests
  const nearbyEmergencyRequests = bloodRequests.map((req) => {
    const d = calculateDistance(location.lat, location.lng, req.position.x ? 9.26 : 9.26, 76.78);
    return { ...req, distanceKm: d };
  });

  const handleAcceptRequest = (req: BloodRequest) => {
    setSelectedRequest(null);
    setConfirmedRequest(req);
    toast.success(`Donation Confirmed! Thank you ${donorName} for helping save a life.`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Donor Greeting Header */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Donor Portal</span>
        <h1 className="text-2xl font-black text-foreground">
          Good morning, {donorName.split(" ")[0]} 👋
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Thank you for being part of the Pathanamthitta emergency donor network.
        </p>
      </div>

      {/* LARGE DONOR STATUS CARD & AVAILABILITY TOGGLE */}
      <div
        className={cn(
          "rounded-3xl p-6 shadow-glow border-2 transition-all space-y-4",
          isAvailable
            ? "bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/20 border-emerald-500"
            : "bg-gradient-to-br from-amber-500/10 via-card to-amber-500/20 border-amber-500"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              YOUR DONOR STATUS
            </span>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase shadow-sm",
                  isAvailable ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                )}
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full bg-white",
                    isAvailable && "animate-ping"
                  )}
                />
                {isAvailable ? "🟢 AVAILABLE" : "🔴 UNAVAILABLE"}
              </span>
              <p className="text-xs font-semibold text-foreground">
                {isAvailable
                  ? "You're currently visible to nearby blood requests."
                  : `Marked unavailable until ${customUntilDate}.`}
              </p>
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1.5 bg-muted/80 p-1.5 rounded-2xl border shrink-0">
            <button
              type="button"
              onClick={() => {
                setDonorAvailabilityState("available");
                toast.success("You are now visible as AVAILABLE to nearby emergency requests!");
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                isAvailable
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              AVAILABLE
            </button>
            <button
              type="button"
              onClick={() => {
                setDonorAvailabilityState("unavailable", customUntilDate);
                toast.info(`Marked as UNAVAILABLE until ${customUntilDate}`);
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer",
                !isAvailable
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              UNAVAILABLE
            </button>
          </div>
        </div>

        {/* Date Picker if Unavailable */}
        {!isAvailable && (
          <div className="rounded-2xl bg-card p-4 border border-amber-500/40 text-xs space-y-2 animate-fade-up">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="size-4 text-amber-600" />
              Available again on:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customUntilDate}
                onChange={(e) => {
                  setCustomUntilDate(e.target.value);
                  setDonorAvailabilityState("unavailable", e.target.value);
                }}
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-muted-foreground font-medium">
                (You will not receive urgent donor dispatches while unavailable)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DONOR STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 text-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase block">Blood Group</span>
          <span className="text-2xl font-black text-primary mt-1 block">{donorBloodGroup}</span>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 text-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase block">District</span>
          <span className="text-sm font-black text-foreground mt-2 block truncate">
            {location.district}
          </span>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 text-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase block">Total Donations</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">5</span>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-card border border-border/60 text-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase block">People Helped</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">5</span>
        </div>
      </div>

      {/* 🚨 NEARBY EMERGENCY REQUESTS LIST */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-critical text-white">
              <Siren className="size-4 animate-bounce" />
            </span>
            <h2 className="text-base font-extrabold text-foreground">🚨 NEARBY EMERGENCY REQUESTS</h2>
          </div>
          <span className="text-xs font-bold text-critical bg-critical-soft px-2.5 py-0.5 rounded-full">
            {nearbyEmergencyRequests.length} Active
          </span>
        </div>

        {isAvailable ? (
          <div className="space-y-3">
            {nearbyEmergencyRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl bg-gradient-to-r from-critical-soft/50 via-card to-card p-4 border border-critical/30 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BloodGroupBadge group={req.bloodGroup} size="sm" />
                    <h3 className="font-extrabold text-foreground text-sm">
                      {req.bloodGroup} BLOOD NEEDED · {req.units} Unit{req.units > 1 ? "s" : ""}
                    </h3>
                    <UrgencyBadge urgency={req.urgency} />
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <MapPin className="size-3.5 text-critical" /> {req.hospital}
                    </span>
                    <span>·</span>
                    <span className="font-bold text-emerald-600">{km(req.distanceKm)} away</span>
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setSelectedRequest(req)}
                  className="rounded-xl font-black bg-critical hover:bg-critical/90 text-white px-4 h-10 shrink-0"
                >
                  VIEW REQUEST
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-5 text-center border border-amber-500/30 space-y-2">
            <AlertTriangle className="size-6 text-amber-600 mx-auto" />
            <p className="font-bold text-xs text-foreground">
              You are currently marked UNAVAILABLE.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Toggle your status to AVAILABLE to accept emergency blood donation requests in {location.district}.
            </p>
          </div>
        )}
      </div>

      {/* DONATION ELIGIBILITY INFORMATIONAL CHECKLIST */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Info className="size-4 text-primary" />
          Donation Eligibility Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold">
          <div className="rounded-2xl bg-muted/50 p-3 border border-border/50 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Age 18 - 65 years</span>
          </div>
          <div className="rounded-2xl bg-muted/50 p-3 border border-border/50 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Weight &gt; 50 kg</span>
          </div>
          <div className="rounded-2xl bg-muted/50 p-3 border border-border/50 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>Last Donation &gt; 90 days ago</span>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground bg-muted p-3 rounded-2xl">
          {MEDICAL_DISCLAIMER}
        </p>
      </div>

      {/* DONOR REQUEST DETAIL MODAL */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-black flex items-center gap-2">
                <Siren className="size-5 text-critical animate-bounce" />
                Emergency Blood Request
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <div className="rounded-2xl bg-critical-soft p-4 border border-critical/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-foreground">
                    {selectedRequest.units} Unit(s) of {selectedRequest.bloodGroup} Blood
                  </span>
                  <UrgencyBadge urgency={selectedRequest.urgency} />
                </div>
                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                  <MapPin className="size-3.5 text-critical" /> {selectedRequest.hospital}
                </p>
                <p className="text-xs text-emerald-600 font-bold">
                  Distance: {km(selectedRequest.distanceKm)} away (Est 12 min drive)
                </p>
              </div>

              {selectedRequest.patientNote && (
                <div className="rounded-2xl bg-card p-3 border border-border/60 text-xs font-medium text-foreground italic">
                  &quot;{selectedRequest.patientNote}&quot;
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  size="lg"
                  onClick={() => handleAcceptRequest(selectedRequest)}
                  className="h-12 rounded-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-glow"
                >
                  <Heart className="size-4 mr-1.5 fill-current" />
                  ACCEPT
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                  className="h-12 rounded-2xl font-bold border-border text-muted-foreground"
                >
                  <XCircle className="size-4 mr-1.5" />
                  Decline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* DONATION CONFIRMED MODAL */}
      {confirmedRequest && (
        <Dialog open={!!confirmedRequest} onOpenChange={() => setConfirmedRequest(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-glow">
              <CheckCircle2 className="size-10 animate-pop" />
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-black text-foreground">
                DONATION CONFIRMED! 🩸✅
              </DialogTitle>
              <p className="text-xs text-emerald-600 font-bold">
                &quot;Thank you for helping save a life.&quot;
              </p>
            </DialogHeader>

            <div className="rounded-2xl bg-muted/60 p-4 border border-border/60 text-left space-y-2 text-xs">
              <p className="font-bold text-foreground text-sm">{confirmedRequest.hospital}</p>
              <p className="text-muted-foreground">{location.address || "Pathanamthitta, Kerala"}</p>
              <p className="text-emerald-600 font-bold">Estimated Travel: 12 mins drive</p>
              <p className="text-primary font-bold">Contact Helpline: +91 98765 43210</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs h-11 shadow-sm"
              >
                <PhoneCall className="size-4" /> Call Hospital
              </a>
              <Button
                variant="outline"
                onClick={() => alert(`Opening live navigation directions to ${confirmedRequest.hospital}...`)}
                className="h-11 rounded-2xl font-bold text-xs border-primary/40 text-primary"
              >
                <Navigation className="size-4 mr-1" /> Get Directions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
