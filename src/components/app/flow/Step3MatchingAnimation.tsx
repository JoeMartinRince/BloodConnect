import React, { useEffect, useState } from "react";
import { Radar, CheckCircle2, Sparkles, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPlaceholder, type MapMarker } from "@/components/app/MapPlaceholder";
import type { BloodGroup, District, Donor } from "@/types";
import { cn } from "@/lib/utils";

interface Step3Props {
  bloodGroup: BloodGroup;
  district: District;
  hospital: string;
  donors: Donor[];
  onCompleteMatching: () => void;
}

const MATCH_STAGES = [
  "Initializing AI Donor Match Engine...",
  "Scanning 15 km geographic radius in Pathanamthitta...",
  "Applying blood type compatibility matrix...",
  "Calculating real-time response velocity & distance...",
  "Ranking active verified donors by priority score...",
  "Matching Complete! 6 Top Donors Identified.",
];

export function Step3MatchingAnimation({
  bloodGroup,
  district,
  hospital,
  donors,
  onCompleteMatching,
}: Step3Props) {
  const [progress, setProgress] = useState(15);
  const [stageIndex, setStageIndex] = useState(0);
  const [revealedMarkers, setRevealedMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    // Initial requester position marker at center hospital
    const hospitalMarker: MapMarker = {
      id: "hospital-center",
      kind: "request",
      position: { x: 50, y: 50 },
      label: hospital.split(",")[0],
      highlight: true,
    };
    setRevealedMarkers([hospitalMarker]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 17;
        const nextStage = Math.min(
          MATCH_STAGES.length - 1,
          Math.floor((next / 100) * MATCH_STAGES.length)
        );
        setStageIndex(nextStage);
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [hospital]);

  // Reveal donor markers as progress advances
  useEffect(() => {
    if (progress > 30) {
      const topDonors = donors.slice(0, 5);
      const donorMarkers: MapMarker[] = topDonors.map((d, i) => ({
        id: d.id,
        kind: "donor",
        position: d.position,
        label: `${d.name.split(" ")[0]} (${d.bloodGroup})`,
        highlight: i === 0,
      }));

      const hospitalMarker: MapMarker = {
        id: "hospital-center",
        kind: "request",
        position: { x: 50, y: 50 },
        label: hospital.split(",")[0],
        highlight: true,
      };

      setRevealedMarkers([hospitalMarker, ...donorMarkers]);
    }

    if (progress >= 100) {
      const timer = setTimeout(() => {
        onCompleteMatching();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress, donors, hospital, onCompleteMatching]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Radar className="size-6 animate-spin text-primary" style={{ animationDuration: "3s" }} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 3 of 9</span>
              <h1 className="text-xl font-extrabold text-foreground">AI Donor Radar Matching</h1>
              <p className="text-xs text-muted-foreground">Searching active {bloodGroup} donors near {district}...</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary tabular-nums">
            {progress}%
          </span>
        </div>
      </div>

      {/* Interactive Map with Scanning Radar */}
      <div className="relative overflow-hidden rounded-3xl shadow-glow border border-primary/20 bg-card p-2">
        <div className="h-[280px] sm:h-[340px] w-full rounded-2xl overflow-hidden relative">
          <MapPlaceholder markers={revealedMarkers} radar={true} className="size-full" />

          {/* Live Scanning Status Overlay */}
          <div className="absolute top-4 left-4 right-4 bg-card/90 backdrop-blur-md rounded-2xl p-3 border border-border/60 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-3 bg-primary" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[260px] sm:max-w-md">
                {MATCH_STAGES[stageIndex]}
              </span>
            </div>

            <span className="text-[11px] font-extrabold text-primary bg-primary-soft px-2.5 py-1 rounded-full shrink-0">
              {revealedMarkers.length - 1} Donors Found
            </span>
          </div>

          {/* Progress Bar overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md rounded-2xl p-3 border border-border/60 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>Matching Progress</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Checkpoints */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Matching Pipeline Execution
        </h3>
        {MATCH_STAGES.slice(0, 5).map((stage, idx) => {
          const isDone = stageIndex > idx;
          const isCurrent = stageIndex === idx;
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium transition-all",
                isDone
                  ? "bg-emerald-500/10 text-emerald-700 font-semibold"
                  : isCurrent
                  ? "bg-primary-soft text-primary font-bold animate-pulse"
                  : "bg-muted/40 text-muted-foreground opacity-60"
              )}
            >
              <CheckCircle2
                className={cn(
                  "size-4 shrink-0",
                  isDone ? "text-emerald-600 fill-emerald-100" : isCurrent ? "text-primary" : "text-muted-foreground/40"
                )}
              />
              <span>{stage}</span>
            </div>
          );
        })}
      </div>

      {/* Manual Continue Button */}
      <Button
        onClick={onCompleteMatching}
        size="lg"
        className="w-full h-12 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
      >
        VIEW RANKED DONORS NOW
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  );
}
