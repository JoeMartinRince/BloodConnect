import React, { useEffect, useState } from "react";
import { Send, Clock, PhoneCall, Radio, CheckCircle2, ArrowRight, Smartphone, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/app/Primitives";
import { BloodGroupBadge } from "@/components/app/Badges";
import type { BloodGroup, Donor } from "@/types";
import { km } from "@/utils/format";

interface Step5Props {
  donor: Donor;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  onProceedToDonorDashboard: () => void;
}

export function Step5SendRequest({
  donor,
  bloodGroup,
  units,
  hospital,
  onProceedToDonorDashboard,
}: Step5Props) {
  const [secondsLeft, setSecondsLeft] = useState(179);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold">
            <Radio className="size-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Step 5 of 9</span>
            <h1 className="text-xl font-extrabold text-foreground">Alert Transmitted to Donor</h1>
            <p className="text-xs text-muted-foreground">Emergency dispatch notification sent to {donor.name}.</p>
          </div>
        </div>
      </div>

      {/* Transmission Pulse Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-amber-500/10 p-6 shadow-glow border-2 border-amber-500/30 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 relative">
          <span className="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-ping opacity-75" />
          <Radio className="size-10 text-amber-600 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 uppercase tracking-wide">
          <Clock className="size-3.5 animate-spin" />
          STATUS: ALERT TRANSMITTED · PENDING ACCEPTANCE
        </span>

        <h2 className="mt-3 text-2xl font-black text-foreground">
          Waiting for {donor.name} to Accept...
        </h2>

        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
          High-priority push notification and SMS alert delivered to donor&apos;s registered device in {donor.area}.
        </p>

        {/* Live Countdown Timer */}
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-muted/80 px-5 py-2.5 border border-border/60">
          <span className="text-xs font-semibold text-muted-foreground">Response Timeout:</span>
          <span className="text-xl font-black text-amber-600 tabular-nums font-mono">
            {formatTimer(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Target Donor Summary Card */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Target Donor Details
        </h3>

        <div className="flex items-center gap-4">
          <Avatar name={donor.name} size="lg" className="shadow-md ring-2 ring-primary/20" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-foreground text-base">{donor.name}</h4>
              <BloodGroupBadge group={donor.bloodGroup} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="size-3.5 text-primary" /> {donor.area} · {km(donor.distanceKm)} away
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> Verified Active Donor ({donor.donations} donations)
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA: Switch to Donor Dashboard Simulator */}
      <div className="rounded-3xl bg-card p-5 shadow-card border-2 border-primary/40 space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-extrabold text-primary">
          <Smartphone className="size-4 animate-bounce" />
          DUAL-PERSPECTIVE SIMULATOR
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Now experience the donor&apos;s perspective! Switch to the <strong>Donor Dashboard</strong> to see how {donor.name} receives this urgent notification and clicks &quot;Accept&quot;.
        </p>

        <Button
          size="lg"
          onClick={onProceedToDonorDashboard}
          className="w-full h-14 rounded-2xl font-extrabold text-base shadow-glow gradient-brand text-white hover:opacity-95"
        >
          SWITCH TO DONOR DASHBOARD (VIEW INCOMING ALERT 📱)
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
