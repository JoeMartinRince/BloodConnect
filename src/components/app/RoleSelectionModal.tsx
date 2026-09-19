import React from "react";
import { Droplet, Heart, Hospital, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

interface RoleSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleSelected?: (role: UserRole) => void;
}

export function RoleSelectionModal({ open, onOpenChange, onRoleSelected }: RoleSelectionModalProps) {
  const { activeRole, setUserRole } = useAppStore();

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (onRoleSelected) onRoleSelected(role);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-6 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">
            How will you use BloodConnect?
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Choose your role to customize your dashboard, alerts, and navigation.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3.5 pt-4">
          {/* 1. BLOOD SEEKER CARD */}
          <div
            onClick={() => handleSelectRole("seeker")}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-card hover:shadow-glow",
              activeRole === "seeker"
                ? "bg-gradient-to-r from-critical-soft via-card to-critical-soft/30 border-critical ring-2 ring-critical/20"
                : "bg-card border-border/80 hover:border-critical/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-critical text-white shadow-md group-hover:scale-105 transition-transform">
                <Droplet className="size-7 fill-current" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">🩸 I Need Blood</h3>
                  {activeRole === "seeker" && (
                    <span className="rounded-full bg-critical text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
                  &quot;Find compatible blood donors quickly.&quot;
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-critical">
                  <span>Search Donors & Blood Banks</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. BLOOD DONOR CARD */}
          <div
            onClick={() => handleSelectRole("donor")}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-card hover:shadow-glow",
              activeRole === "donor"
                ? "bg-gradient-to-r from-emerald-500/10 via-card to-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/20"
                : "bg-card border-border/80 hover:border-emerald-500/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Heart className="size-7 fill-current" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">❤️ I Want to Donate</h3>
                  {activeRole === "donor" && (
                    <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
                  &quot;Help people in your district by donating blood.&quot;
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span>Toggle Availability & View Emergency Requests</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. HOSPITAL / BLOOD BANK CARD */}
          <div
            onClick={() => handleSelectRole("hospital")}
            className={cn(
              "group relative overflow-hidden rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-card hover:shadow-glow",
              activeRole === "hospital"
                ? "bg-gradient-to-r from-indigo-500/10 via-card to-indigo-500/20 border-indigo-600 ring-2 ring-indigo-600/20"
                : "bg-card border-border/80 hover:border-indigo-500/50"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Hospital className="size-7" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">🏥 Hospital / Blood Bank</h3>
                  {activeRole === "hospital" && (
                    <span className="rounded-full bg-indigo-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
                  &quot;Manage blood inventory and coordinate emergency requests.&quot;
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <span>3-Stage Supply Matching & Analytics Dashboard</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
