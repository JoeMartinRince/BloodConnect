import React from "react";
import {
  Droplet,
  FilePlus,
  Radar,
  Users,
  Send,
  LayoutDashboard,
  CheckCircle2,
  CheckCheck,
  Bell,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface StepInfo {
  id: FlowStepId;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

export const FLOW_STEPS: StepInfo[] = [
  { id: 1, title: "Need Blood", shortTitle: "Need Blood", icon: Droplet, description: "Emergency trigger & initial search" },
  { id: 2, title: "Create Request", shortTitle: "Create Req", icon: FilePlus, description: "Blood group, hospital & urgency form" },
  { id: 3, title: "Matching Animation", shortTitle: "Matching", icon: Radar, description: "AI radar scanning & compatibility engine" },
  { id: 4, title: "Ranked Donors", shortTitle: "Ranked Donors", icon: Users, description: "Prioritised donor list & map matching" },
  { id: 5, title: "Send Request", shortTitle: "Send Req", icon: Send, description: "Alert transmission to target donor" },
  { id: 6, title: "Donor Dashboard", shortTitle: "Donor View", icon: LayoutDashboard, description: "Incoming emergency alert card view" },
  { id: 7, title: "Accept", shortTitle: "Accept", icon: CheckCircle2, description: "Donor accepts emergency dispatch" },
  { id: 8, title: "DONOR CONFIRMED", shortTitle: "CONFIRMED", icon: CheckCheck, description: "Contact & route unlocked", badge: "Goal" },
  { id: 9, title: "Notification", shortTitle: "Notification", icon: Bell, description: "System push alert & timeline audit" },
];

interface WorkflowStepperProps {
  currentStep: FlowStepId;
  onSelectStep: (step: FlowStepId) => void;
  isAutoSimulating: boolean;
  onToggleAutoSimulate: () => void;
  onReset: () => void;
  className?: string;
}

export function WorkflowStepper({
  currentStep,
  onSelectStep,
  isAutoSimulating,
  onToggleAutoSimulate,
  onReset,
  className,
}: WorkflowStepperProps) {
  return (
    <div className={cn("rounded-3xl bg-card p-4 shadow-card border border-border/60", className)}>
      {/* Header bar with controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4 animate-pulse" />
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Interactive 9-Step Blood Dispatch Flow</h2>
            <p className="text-[11px] text-muted-foreground">
              Step {currentStep} of 9: <span className="font-semibold text-foreground">{FLOW_STEPS[currentStep - 1].title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAutoSimulate}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm",
              isAutoSimulating
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Play className={cn("size-3.5", isAutoSimulating && "animate-spin")} />
            {isAutoSimulating ? "Pause Simulation" : "Auto-Run Full Flow"}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Stepper horizontal scroll list */}
      <div className="mt-3.5 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center min-w-max gap-1.5 px-1">
          {FLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isConfirmedStep = step.id === 8;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div
                    className={cn(
                      "h-0.5 w-4 sm:w-6 transition-colors rounded-full shrink-0",
                      isCompleted ? "bg-primary" : "bg-border/80"
                    )}
                  />
                )}

                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer",
                    isActive
                      ? isConfirmedStep
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-500/30 shadow-glow"
                        : "bg-primary text-primary-foreground ring-4 ring-primary/25 shadow-glow"
                      : isCompleted
                      ? "bg-primary-soft text-primary hover:bg-primary/20"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                      isActive
                        ? "bg-white/20 text-current"
                        : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="size-3.5" /> : step.id}
                  </span>

                  <div className="flex flex-col items-start text-left">
                    <span className="truncate max-w-[100px] leading-tight font-bold">
                      {step.shortTitle}
                    </span>
                    {isActive && (
                      <span className="text-[9px] opacity-90 truncate max-w-[90px]">
                        Active Node
                      </span>
                    )}
                  </div>

                  {step.badge && !isActive && (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">
                      {step.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
