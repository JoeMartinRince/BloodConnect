import React, { useState } from "react";
import { Users, Award, MapPin, Clock, Send, ShieldCheck, CheckCircle2, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge, StatusBadge } from "@/components/app/Badges";
import { Avatar } from "@/components/app/Primitives";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import type { BloodGroup, Donor, Match } from "@/types";
import { rankDonors, sortMatches, type MatchSort } from "@/utils/matching";
import { km } from "@/utils/format";
import { cn } from "@/lib/utils";

interface Step4Props {
  bloodGroup: BloodGroup;
  hospital: string;
  donors: Donor[];
  selectedDonor: Donor | null;
  onSelectDonor: (donor: Donor) => void;
  onSendRequest: (donor: Donor) => void;
  onBroadcastAll: () => void;
}

export function Step4RankedDonors({
  bloodGroup,
  hospital,
  donors,
  selectedDonor,
  onSelectDonor,
  onSendRequest,
  onBroadcastAll,
}: Step4Props) {
  const [sortOption, setSortOption] = useState<MatchSort>("priority");

  // Compute matched donor priorities
  const matches: Match[] = rankDonors({ bloodGroup, urgency: "critical" }, donors);
  const sortedMatches = sortMatches(matches, sortOption);
  const topMatch = sortedMatches[0]?.donor || donors[0];

  const activeDonor = selectedDonor || topMatch;

  // Prepare map markers
  const markers: MapMarker[] = [
    {
      id: "hospital-target",
      kind: "request",
      position: { x: 50, y: 50 },
      label: hospital.split(",")[0],
      highlight: true,
    },
    ...sortedMatches.slice(0, 6).map((m, idx) => ({
      id: m.donor.id,
      kind: "donor" as const,
      position: m.donor.position,
      label: `#${idx + 1} ${m.donor.name.split(" ")[0]} (${m.priority}%)`,
      highlight: m.donor.id === activeDonor.id,
      onClick: () => onSelectDonor(m.donor),
    })),
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
              <Award className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 4 of 9</span>
              <h1 className="text-xl font-extrabold text-foreground">Ranked Matched Donors</h1>
              <p className="text-xs text-muted-foreground">
                Found {sortedMatches.length} compatible {bloodGroup} donors ranked by proximity & response rate.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onBroadcastAll}
            className="rounded-full border-primary/30 text-primary font-bold hover:bg-primary-soft text-xs"
          >
            <Send className="size-3.5 mr-1" />
            Broadcast to Top 3
          </Button>
        </div>
      </div>

      {/* Top #1 Matched Featured Hero Donor */}
      {topMatch && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-soft via-card to-emerald-500/10 p-5 shadow-glow border-2 border-primary/40">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-extrabold shadow-sm">
              <Sparkles className="size-3.5 animate-bounce" />
              #1 PRIORITISED MATCH (98% SCORE)
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Estimated 12-14 min arrival
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={topMatch.name} size="lg" className="shadow-md ring-4 ring-primary/20" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-foreground">{topMatch.name}</h3>
                  <BloodGroupBadge group={topMatch.bloodGroup} size="sm" />
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1 text-foreground">
                    <MapPin className="size-3.5 text-primary" /> {topMatch.area} ({km(topMatch.distanceKm)} away)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Clock className="size-3.5" /> Active {topMatch.lastActive}
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm border">
                    ✓ Same Blood Type
                  </span>
                  <span className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm border">
                    ✓ {topMatch.donations} Past Donations
                  </span>
                  <span className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-bold text-foreground shadow-sm border">
                    ✓ High Response Velocity
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-12 px-6 font-extrabold rounded-2xl bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 shrink-0"
              onClick={() => onSendRequest(topMatch)}
            >
              SEND REQUEST TO {topMatch.name.split(" ")[0].toUpperCase()}
              <Send className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Interactive Map view */}
      <div className="rounded-3xl bg-card p-3 shadow-card border border-border/60 space-y-2">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <MapPin className="size-4 text-primary" />
            Live Donors Map Overview
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">Click pin to inspect donor</span>
        </div>
        <div className="h-[200px] w-full rounded-2xl overflow-hidden relative">
          <MapPlaceholder markers={markers} className="size-full" />
        </div>
      </div>

      {/* Sort Filter Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-1.5">
          <Users className="size-4 text-primary" />
          All Matched Donors ({sortedMatches.length})
        </h3>
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border text-xs">
          <button
            type="button"
            onClick={() => setSortOption("priority")}
            className={cn(
              "px-2.5 py-1 rounded-xl font-bold transition-all",
              sortOption === "priority" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Priority
          </button>
          <button
            type="button"
            onClick={() => setSortOption("closest")}
            className={cn(
              "px-2.5 py-1 rounded-xl font-bold transition-all",
              sortOption === "closest" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Distance
          </button>
        </div>
      </div>

      {/* Donor List Cards */}
      <div className="space-y-3">
        {sortedMatches.map((m, index) => {
          const donor = m.donor;
          const isSelected = activeDonor.id === donor.id;

          return (
            <div
              key={donor.id}
              onClick={() => onSelectDonor(donor)}
              className={cn(
                "rounded-3xl bg-card p-4 shadow-card border transition-all cursor-pointer",
                isSelected
                  ? "border-primary ring-2 ring-primary/20 shadow-glow bg-primary-soft/30"
                  : "border-border/60 hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar name={donor.name} size="md" />
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm truncate">{donor.name}</h4>
                      <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        {m.priority}% Match
                      </span>
                    </div>

                    <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground truncate">
                      <span>{donor.area}</span>
                      <span>·</span>
                      <span className="font-bold text-foreground">{km(donor.distanceKm)} away</span>
                      <span>·</span>
                      <span>{donor.lastActive}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={donor.availability} />
                  <Button
                    size="sm"
                    className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendRequest(donor);
                    }}
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
