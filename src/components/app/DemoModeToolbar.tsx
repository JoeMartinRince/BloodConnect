import React, { useState } from "react";
import { Sparkles, Droplet, Heart, Hospital, Play, ChevronDown, X } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DemoModeToolbarProps {
  onRunScenario?: (scenarioId: string) => void;
  className?: string;
}

export function DemoModeToolbar({ onRunScenario, className }: DemoModeToolbarProps) {
  const { activeRole, setUserRole } = useAppStore();
  const [collapsed, setCollapsed] = useState(true);

  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    toast.success(`Switched role to ${role.toUpperCase()}`);
  };

  const handleScenario = (scenarioId: string, label: string) => {
    if (onRunScenario) onRunScenario(scenarioId);
    toast.info(`Running Demo Scenario: ${label}`);
  };

  return (
    <div
      className={cn(
        "fixed z-40 transition-all",
        // Positioned safely above mobile bottom nav: ~76px + safe-area-inset-bottom
        "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3 lg:bottom-6 lg:right-6",
        className
      )}
    >
      {collapsed ? (
        /* Collapsed compact pill trigger: 🎯 Demo */
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 rounded-full bg-card/95 border-2 border-primary/50 px-3 py-1.5 text-xs font-black text-primary shadow-glow backdrop-blur-md cursor-pointer hover:bg-primary-soft transition-transform active:scale-95"
        >
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Switch Role</span>
          <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-extrabold uppercase">
            {activeRole}
          </span>
        </button>
      ) : (
        /* Expanded full controls modal/card */
        <div className="w-[calc(100vw-24px)] max-w-xs sm:max-w-sm rounded-3xl bg-card/95 border-2 border-primary/50 p-3.5 shadow-glow backdrop-blur-md space-y-2.5 animate-fade-up">
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm">
                <Sparkles className="size-3.5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-primary block leading-none">
                  Role Control Console
                </span>
                <span className="text-xs font-bold text-foreground capitalize">
                  Active: <strong className="text-primary">{activeRole}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex size-6 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              title="Close Controls"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Role Switcher Pills */}
          <div className="grid grid-cols-3 gap-1 bg-muted/60 p-1 rounded-2xl border text-xs">
            <button
              type="button"
              onClick={() => handleSwitchRole("seeker")}
              className={cn(
                "py-1 px-1.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]",
                activeRole === "seeker"
                  ? "bg-critical text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Droplet className="size-3 fill-current" />
              Seeker
            </button>

            <button
              type="button"
              onClick={() => handleSwitchRole("donor")}
              className={cn(
                "py-1 px-1.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]",
                activeRole === "donor"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className="size-3 fill-current" />
              Donor
            </button>

            <button
              type="button"
              onClick={() => handleSwitchRole("hospital")}
              className={cn(
                "py-1 px-1.5 rounded-xl font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px]",
                activeRole === "hospital"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Hospital className="size-3" />
              Hospital
            </button>
          </div>

          {/* Quick Scenarios */}
          <div className="space-y-1 pt-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Quick Test Scenarios:
            </p>

            <button
              type="button"
              onClick={() => {
                handleSwitchRole("seeker");
                handleScenario("patient_request", "Scenario 1: Patient Needs O+ Blood");
              }}
              className="w-full text-left p-1.5 rounded-xl bg-card hover:bg-muted border text-[11px] font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>1. Patient Needs O+ (2-Way Choice)</span>
              <Play className="size-3 text-primary" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleSwitchRole("hospital");
                handleScenario("hospital_shortage", "Scenario 2: Hospital Supply Chain Request");
              }}
              className="w-full text-left p-1.5 rounded-xl bg-card hover:bg-muted border text-[11px] font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>2. Hospital Shortage (3-Stage Supply)</span>
              <Play className="size-3 text-indigo-600" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleSwitchRole("donor");
                handleScenario("donor_accept", "Scenario 4: Donor Accepts Emergency Alert");
              }}
              className="w-full text-left p-1.5 rounded-xl bg-card hover:bg-muted border text-[11px] font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>3. Donor Emergency Acceptance</span>
              <Play className="size-3 text-emerald-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
