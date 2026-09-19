import React from "react";
import { Bell, CheckCircle2, RotateCcw, Sparkles, Clock, ShieldCheck, ArrowRight, HeartPulse, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BloodGroup, Donor } from "@/types";
import { FLOW_STEPS } from "./WorkflowStepper";

interface Step9Props {
  donor: Donor;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  requestCode: string;
  onReset: () => void;
}

export function Step9Notification({
  donor,
  bloodGroup,
  units,
  hospital,
  requestCode,
  onReset,
}: Step9Props) {
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold">
              <Bell className="size-6 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Step 9 of 9</span>
              <h1 className="text-xl font-extrabold text-foreground">System Push Notification & Audit</h1>
              <p className="text-xs text-muted-foreground">Notification dispatched to Requester & Donor.</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-black shadow-sm">
            Push Alert Delivered
          </span>
        </div>
      </div>

      {/* FLOATING PUSH NOTIFICATION SIMULATED TOAST */}
      <div className="relative overflow-hidden rounded-3xl bg-card p-5 shadow-glow border-2 border-primary/50 space-y-3 animate-pop">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Droplet className="size-4 fill-current" />
            </span>
            <span className="text-xs font-bold text-foreground">Blood Connect Now System Alert</span>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground">{currentTime}</span>
        </div>

        <div className="rounded-2xl bg-primary-soft/60 p-4 border border-primary/30 space-y-1.5">
          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
            <Bell className="size-4 text-primary fill-primary/30" />
            EMERGENCY MATCH CONFIRMED!
          </h3>
          <p className="text-xs font-medium text-foreground leading-relaxed">
            Donor <strong>{donor.name} ({donor.bloodGroup})</strong> has accepted your request for {units} unit(s) of {bloodGroup} blood at {hospital}.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-primary">
            <span>Contact Unlocked: +91 98765 43210</span>
            <span>·</span>
            <span>Ref #{requestCode}</span>
          </div>
        </div>
      </div>

      {/* FULL 9-STEP AUDIT TIMELINE */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Completed 9-Step Lifecycle Trace
          </h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
            9 of 9 Complete
          </span>
        </div>

        <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-primary/20">
          {FLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex items-center gap-3 pl-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow">
                  <CheckCircle2 className="size-4" />
                </span>
                <div className="flex-1 min-w-0 bg-muted/40 p-2.5 rounded-2xl border border-border/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Step {step.id}: {step.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{step.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Button
          size="lg"
          onClick={onReset}
          className="h-14 rounded-2xl font-extrabold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
        >
          <RotateCcw className="size-5 mr-2" />
          REPLAY WORKFLOW SIMULATION
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onReset}
          className="h-14 rounded-2xl font-bold text-sm border-border text-foreground hover:bg-muted"
        >
          <HeartPulse className="size-4 mr-2 text-critical animate-pulse" />
          Create Another Blood Request
        </Button>
      </div>
    </div>
  );
}
