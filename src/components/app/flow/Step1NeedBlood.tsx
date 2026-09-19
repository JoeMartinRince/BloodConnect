import React from "react";
import { Siren, Droplet, ShieldCheck, MapPin, Clock, ArrowRight, HeartPulse, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";
import { BloodGroupBadge } from "@/components/app/Badges";
import { cn } from "@/lib/utils";

interface Step1Props {
  selectedGroup: BloodGroup;
  onSelectGroup: (group: BloodGroup) => void;
  onProceedToCreate: () => void;
  onFastEmergency: () => void;
}

export function Step1NeedBlood({
  selectedGroup,
  onSelectGroup,
  onProceedToCreate,
  onFastEmergency,
}: Step1Props) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl gradient-critical p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute -right-8 -bottom-8 size-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          34 Active Donors Online
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
            <Siren className="size-4 animate-bounce text-yellow-300" />
            Step 1: Need Blood Emergency Trigger
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Need Blood Urgent Assistance?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
            Connect directly with verified, ranked local blood donors within minutes. Every second counts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="bg-white text-critical hover:bg-white/90 font-extrabold shadow-lg rounded-2xl h-12 px-6 text-base group"
              onClick={onProceedToCreate}
            >
              <Droplet className="size-5 fill-current text-critical group-hover:scale-110 transition-transform" />
              CREATE BLOOD REQUEST
              <ArrowRight className="size-5 ml-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-black/20 border-white/30 text-white hover:bg-black/40 font-semibold rounded-2xl h-12 px-5 text-sm backdrop-blur"
              onClick={onFastEmergency}
            >
              <HeartPulse className="size-4 animate-pulse text-yellow-300 mr-1" />
              1-Tap Critical Auto-Fill
            </Button>
          </div>
        </div>
      </div>

      {/* Select Blood Group Quick Selector */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Droplet className="size-4 text-primary fill-primary/20" />
            Required Blood Group
          </h2>
          <span className="text-xs text-muted-foreground">Select required type</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            const isUniversal = group === "O-";
            return (
              <button
                key={group}
                type="button"
                onClick={() => onSelectGroup(group)}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl p-3 font-bold transition-all cursor-pointer border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-glow ring-2 ring-primary/30 scale-[1.03]"
                    : "bg-background text-foreground border-border hover:bg-muted hover:border-primary/40"
                )}
              >
                <span className="text-base sm:text-lg">{group}</span>
                {isUniversal && (
                  <span className="mt-0.5 text-[9px] font-extrabold opacity-85">Universal</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card border border-border/50">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Avg Donor Response</p>
            <p className="text-base font-bold text-foreground">Under 3.2 Minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card border border-border/50">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <MapPin className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Active Radius</p>
            <p className="text-base font-bold text-foreground">Pathanamthitta (15km)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card border border-border/50">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Donor Verification</p>
            <p className="text-base font-bold text-foreground">100% Pre-Screened</p>
          </div>
        </div>
      </div>
    </div>
  );
}
