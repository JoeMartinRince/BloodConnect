import React from "react";
import { FilePlus, Droplet, Hospital, MapPin, AlertTriangle, ArrowRight, Minus, Plus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOOD_GROUPS, DISTRICTS, type BloodGroup, type District, type Urgency } from "@/types";
import { cn } from "@/lib/utils";

const POPULAR_HOSPITALS = [
  "Pushpagiri Medical College, Thiruvalla",
  "Believers Church Medical College, Thiruvalla",
  "Government General Hospital, Pathanamthitta",
  "Muthoot Medical Centre, Kozhencherry",
  "St. Thomas Hospital, Chethipuzha",
];

interface Step2Props {
  bloodGroup: BloodGroup;
  setBloodGroup: (bg: BloodGroup) => void;
  units: number;
  setUnits: (u: number) => void;
  hospital: string;
  setHospital: (h: string) => void;
  district: District;
  setDistrict: (d: District) => void;
  urgency: Urgency;
  setUrgency: (u: Urgency) => void;
  patientNote: string;
  setPatientNote: (n: string) => void;
  onSubmit: () => void;
}

export function Step2CreateRequest({
  bloodGroup,
  setBloodGroup,
  units,
  setUnits,
  hospital,
  setHospital,
  district,
  setDistrict,
  urgency,
  setUrgency,
  patientNote,
  setPatientNote,
  onSubmit,
}: Step2Props) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Step Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary font-bold">
            <FilePlus className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 2 of 9</span>
            <h1 className="text-xl font-extrabold text-foreground">Create Emergency Blood Request</h1>
            <p className="text-xs text-muted-foreground">Provide hospital location and urgency details for donor matching.</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        {/* Blood Group Picker */}
        <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
          <label className="text-sm font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Droplet className="size-4 text-primary fill-primary/30" />
              1. Blood Group Needed
            </span>
            <span className="text-xs font-semibold text-primary">{bloodGroup} Selected</span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setBloodGroup(bg)}
                className={cn(
                  "py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer border text-center",
                  bloodGroup === bg
                    ? "bg-primary text-primary-foreground border-primary shadow-glow ring-2 ring-primary/20 scale-[1.03]"
                    : "bg-background text-foreground border-border hover:bg-muted"
                )}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Units required & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Units counter */}
          <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
            <label className="text-sm font-bold flex items-center justify-between">
              <span>2. Units Required</span>
              <span className="text-xs font-semibold text-muted-foreground">{units} Unit{units > 1 ? "s" : ""}</span>
            </label>
            <div className="flex items-center justify-between bg-muted/60 p-2 rounded-2xl border border-border/50">
              <button
                type="button"
                onClick={() => setUnits(Math.max(1, units - 1))}
                className="flex size-10 items-center justify-center rounded-xl bg-background text-foreground font-bold shadow-sm hover:bg-accent transition-colors"
                disabled={units <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="text-2xl font-black text-foreground tabular-nums px-4">
                {units} <span className="text-xs font-bold text-muted-foreground">bag{units > 1 ? "s" : ""}</span>
              </span>
              <button
                type="button"
                onClick={() => setUnits(Math.min(6, units + 1))}
                className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Urgency selection */}
          <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
            <label className="text-sm font-bold flex items-center justify-between">
              <span>3. Urgency Level</span>
              <span className="text-xs font-semibold capitalize text-critical">{urgency}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "urgent", "critical"] as Urgency[]).map((u) => {
                const isSelected = urgency === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={cn(
                      "py-3 px-2 rounded-2xl font-bold text-xs capitalize transition-all border text-center cursor-pointer",
                      isSelected
                        ? u === "critical"
                          ? "bg-critical text-white border-critical shadow-glow ring-2 ring-critical/30 animate-pulse"
                          : u === "urgent"
                          ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {u === "critical" ? "🚨 Critical" : u === "urgent" ? "⚡ Urgent" : "Normal"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hospital Location & District */}
        <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
          <label className="text-sm font-bold flex items-center gap-1.5">
            <Hospital className="size-4 text-primary" />
            4. Hospital & District Location
          </label>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-muted-foreground mb-1 block">Hospital Name</span>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Enter hospital name or landmark..."
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Quick hospital chips */}
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Quick Select Hospital:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_HOSPITALS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHospital(h)}
                    className={cn(
                      "rounded-xl px-2.5 py-1 text-[11px] font-medium transition-colors border",
                      hospital === h
                        ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                    )}
                  >
                    {h.split(",")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-muted-foreground mb-1 block">District</span>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value as District)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Patient Note */}
        <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-2">
          <label className="text-sm font-bold flex items-center gap-1.5">
            <Stethoscope className="size-4 text-primary" />
            5. Patient Clinical Note (Optional)
          </label>
          <textarea
            value={patientNote}
            onChange={(e) => setPatientNote(e.target.value)}
            rows={2}
            placeholder="e.g. ICU patient admitted for emergency surgery, immediate transfusion required..."
            className="w-full rounded-2xl border border-input bg-background p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 rounded-2xl text-base font-extrabold shadow-glow gradient-brand text-white hover:opacity-95"
        >
          FIND COMPATIBLE DONORS (START AI MATCHING ⚡)
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </form>
    </div>
  );
}
