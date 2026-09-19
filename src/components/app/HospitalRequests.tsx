import React, { useState, useEffect } from "react";
import {
  FileText,
  Hospital,
  Building2,
  Users,
  CheckCircle2,
  Plus,
  Siren,
  Clock,
  PhoneCall,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BloodGroupBadge, UrgencyBadge } from "@/components/app/Badges";
import { BLOOD_GROUPS, DISTRICTS, type BloodGroup, type HospitalRequest, type Urgency } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { bloodBanks } from "@/data/facilities";
import { donors } from "@/data/donors";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HospitalRequests() {
  const {
    inventory,
    hospitalRequests,
    createHospitalRequest,
    acceptDonorRequestForHospital,
  } = useAppStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [patientId, setPatientId] = useState("PAT-8821");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+");
  const [unitsNeeded, setUnitsNeeded] = useState<number>(3);
  const [urgency, setUrgency] = useState<Urgency>("critical");
  const [location, setLocation] = useState("Pushpagiri Medical College, Thiruvalla");

  const [activeRequest, setActiveRequest] = useState<HospitalRequest | null>(
    hospitalRequests[0] || null
  );

  // Simulation state for 3-Stage Supply Match Hero Demo
  const [simulatingStage, setSimulatingStage] = useState<number>(3); // 1: Internal, 2: Bank, 3: Donor Complete

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = createHospitalRequest({
      patientId,
      bloodGroup,
      unitsNeeded,
      urgency,
      requiredBy: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      location,
    });
    setActiveRequest(req);
    setSimulatingStage(1);
    setDialogOpen(false);
    toast.success(`Created Request #${req.id} for ${unitsNeeded} units of ${bloodGroup}`);
  };

  const handleRunSimulation = () => {
    setSimulatingStage(1);
    toast.info("Step 1: Checking Hospital Internal Stock...");
    setTimeout(() => {
      setSimulatingStage(2);
      toast.info("Step 2: Searching Nearby Blood Banks...");
      setTimeout(() => {
        setSimulatingStage(3);
        if (activeRequest) {
          const targetDonor = donors.find((d) => d.bloodGroup === activeRequest.bloodGroup) || donors[0];
          acceptDonorRequestForHospital(activeRequest.id, targetDonor);
        }
        toast.success("Step 3: Compatible Donor Accepted! Request FULFILLED!");
      }, 2500);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 1. FIX REQUEST SCREEN HEADER */}
      <div className="rounded-3xl bg-card p-5 sm:p-6 shadow-card border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <FileText className="size-4" />
              Hospital Requests Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Hospital Requests</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track and manage blood supply requests across internal inventory, blood banks & donor network.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-2xl font-extrabold bg-primary hover:bg-primary-dark text-white shadow-md h-11 px-5 text-xs sm:text-sm shrink-0"
        >
          <Plus className="size-4 mr-1.5" />
          + New Request
        </Button>
      </div>

      {/* 2. ACTIVE REQUESTS LIST */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground px-1">
          Active Hospital Supply Requests ({hospitalRequests.length})
        </h2>

        <div className="space-y-3">
          {hospitalRequests.map((req) => {
            const isSelected = activeRequest?.id === req.id;
            const securedUnits = req.internalInventoryUsed + req.bloodBankUnitsReserved + req.confirmedDonors.length;
            const isFulfilled = securedUnits >= req.unitsNeeded;

            return (
              <div
                key={req.id}
                onClick={() => setActiveRequest(req)}
                className={cn(
                  "rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-card space-y-3",
                  isSelected
                    ? "bg-card border-primary ring-2 ring-primary/20 shadow-glow"
                    : "bg-card border-border/70 hover:border-primary/50"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-primary bg-primary-soft px-2.5 py-0.5 rounded-full border border-primary/30">
                      REQUEST #{req.id}
                    </span>
                    <UrgencyBadge urgency={req.urgency} />
                    <span className="text-xs font-bold text-muted-foreground">
                      Patient ID: <strong className="text-foreground">{req.patientId}</strong>
                    </span>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full w-fit",
                      isFulfilled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                    )}
                  >
                    {isFulfilled ? "✓ REQUEST FULFILLED" : `Status: ${req.status}`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BloodGroupBadge group={req.bloodGroup} size="sm" />
                      <h3 className="text-base font-black text-foreground">
                        {req.unitsNeeded} Units {req.bloodGroup} Required
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Hospital: <strong>{req.location}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                      {securedUnits} / {req.unitsNeeded} units secured
                    </span>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRequest(req);
                      }}
                      className="rounded-xl font-bold bg-primary hover:bg-primary-dark text-white h-9 px-3.5 text-xs shrink-0"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. HERO FEATURE: 3-STAGE SUPPLY MATCH ENGINE & TIMELINE */}
      {activeRequest && (
        <div className="rounded-3xl bg-card p-6 shadow-glow border-2 border-primary/40 space-y-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
                  REQUEST #{activeRequest.id}
                </span>
                <UrgencyBadge urgency={activeRequest.urgency} />
              </div>
              <h2 className="text-xl font-black text-foreground mt-1">
                {activeRequest.unitsNeeded} Units of {activeRequest.bloodGroup} Blood Needed
              </h2>
              <p className="text-xs text-muted-foreground">
                Patient ID: {activeRequest.patientId} · {activeRequest.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRunSimulation}
                className="rounded-xl font-extrabold bg-primary text-white hover:bg-primary-dark h-9 px-3 text-xs shadow-sm"
              >
                <Play className="size-3.5 mr-1" />
                Run Animated Demo Match
              </Button>
            </div>
          </div>

          {/* SUPPLY MATCH ENGINE HERO PANEL */}
          <div className="space-y-4 bg-muted/40 p-5 rounded-3xl border border-border/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles className="size-4 animate-pulse" />
                SUPPLY MATCH ENGINE
              </h3>
              <span className="text-xs font-bold text-foreground bg-card px-3 py-1 rounded-full border">
                {activeRequest.internalInventoryUsed + activeRequest.bloodBankUnitsReserved + activeRequest.confirmedDonors.length} / {activeRequest.unitsNeeded} UNITS SECURED
              </span>
            </div>

            {/* STAGE 1: HOSPITAL INVENTORY */}
            <div
              className={cn(
                "rounded-2xl p-4 border-2 transition-all space-y-1.5",
                simulatingStage >= 1
                  ? "bg-emerald-500/10 border-emerald-500/50"
                  : "bg-card border-border/60 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  ✓ STEP 1 — HOSPITAL INVENTORY
                </span>
                <span className="text-[11px] font-bold bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full">
                  1 / {activeRequest.unitsNeeded} units found
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Internal hospital stock scanned. <strong>1 unit reserved</strong> from Pushpagiri Medical Centre inventory.
              </p>
            </div>

            {/* STAGE 2: NEARBY BLOOD BANKS */}
            <div
              className={cn(
                "rounded-2xl p-4 border-2 transition-all space-y-1.5",
                simulatingStage >= 2
                  ? "bg-primary/10 border-primary/50"
                  : "bg-card border-border/60 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  {simulatingStage >= 2 ? "✓ STEP 2 — NEARBY BLOOD BANKS" : "○ STEP 2 — NEARBY BLOOD BANKS"}
                </span>
                <span className="text-[11px] font-bold bg-primary-soft text-primary px-2.5 py-0.5 rounded-full">
                  {simulatingStage >= 2 ? "1 unit found · 4.2 km away" : "Searching nearby blood banks..."}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                District Blood Centre located 4.2 km away. <strong>1 unit reserved</strong> inter-bank transfer.
              </p>
            </div>

            {/* STAGE 3: DONOR NETWORK */}
            <div
              className={cn(
                "rounded-2xl p-4 border-2 transition-all space-y-1.5",
                simulatingStage >= 3
                  ? "bg-emerald-500/10 border-emerald-500/50"
                  : "bg-card border-border/60 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-foreground flex items-center gap-2">
                  <Users className="size-4 text-emerald-600" />
                  {simulatingStage >= 3 ? "✓ STEP 3 — DONOR NETWORK" : "○ STEP 3 — DONOR NETWORK"}
                </span>
                <span className="text-[11px] font-bold bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full">
                  {simulatingStage >= 3 ? "1 donor accepted · 7.8 km away" : "Searching compatible donors..."}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Dispatched emergency alert to 5 nearby verified O+ donors. <strong>Donor D177 accepted</strong>.
              </p>
            </div>

            {/* FULFILLMENT BANNER */}
            {simulatingStage >= 3 && (
              <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white shadow-glow space-y-2 text-center animate-fade-up">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-6 text-white animate-pop" />
                  <h4 className="text-lg font-black tracking-tight">✓ BLOOD REQUEST FULFILLED</h4>
                </div>
                <p className="text-xs font-bold text-white/90">
                  3 / 3 Units Secured: 1 Hospital Inventory · 1 Blood Bank · 1 Donor Network
                </p>
              </div>
            )}
          </div>

          {/* VERTICAL REQUEST TIMELINE */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Request Status Vertical Timeline
            </h3>

            <div className="relative pl-6 space-y-4 border-l-2 border-primary/30 ml-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  ✓
                </span>
                <p className="font-extrabold text-foreground">Request Created</p>
                <p className="text-muted-foreground text-[11px]">Patient ID: {activeRequest.patientId} · Pushpagiri Medical College</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  ✓
                </span>
                <p className="font-extrabold text-foreground">Hospital Inventory Checked</p>
                <p className="text-muted-foreground text-[11px]">1 Unit O+ Stock Found in internal hospital reserve</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  ✓
                </span>
                <p className="font-extrabold text-foreground">1 Unit Reserved</p>
                <p className="text-muted-foreground text-[11px]">Internal reserve locked for Patient PAT-8821</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  ✓
                </span>
                <p className="font-extrabold text-foreground">Blood Bank Search Started</p>
                <p className="text-muted-foreground text-[11px]">District Blood Centre matched (1 unit available)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  ✓
                </span>
                <p className="font-extrabold text-foreground">Donors Notified</p>
                <p className="text-muted-foreground text-[11px]">5 nearby O+ registered donors dispatched emergency push alert</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-0 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  ●
                </span>
                <p className="font-extrabold text-emerald-600">Donor D177 Accepted Request</p>
                <p className="text-muted-foreground text-[11px]">Arun Kumar (7.8 km away) accepted and is en-route</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW HOSPITAL REQUEST MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <Hospital className="size-5 text-primary" />
              Create Hospital Blood Request
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Patient Record ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(parseInt(e.target.value) || 1)}
                  className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold"
              >
                <option value="critical">Critical (Immediate Transfusion)</option>
                <option value="urgent">Urgent (&lt; 3 Hours)</option>
                <option value="normal">Normal (Scheduled Operation)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Hospital Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl font-extrabold bg-primary text-white hover:bg-primary-dark mt-2"
            >
              RUN 3-STAGE SUPPLY MATCH ENGINE ⚡
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

