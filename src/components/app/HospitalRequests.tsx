import React, { useState } from "react";
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
    reserveInternalStock,
    acceptDonorRequestForHospital,
  } = useAppStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [patientId, setPatientId] = useState("PAT-1094");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+");
  const [unitsNeeded, setUnitsNeeded] = useState<number>(3);
  const [urgency, setUrgency] = useState<Urgency>("critical");
  const [location, setLocation] = useState("Pushpagiri Medical College, Thiruvalla");

  const [activeRequest, setActiveRequest] = useState<HospitalRequest | null>(
    hospitalRequests[0] || null
  );

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
    setDialogOpen(false);
    toast.success(`Created Hospital Emergency Request #${req.id} for ${unitsNeeded} units of ${bloodGroup}`);
  };

  const handleSimulateDonorAccept = (reqId: string) => {
    const targetDonor = donors.find((d) => d.bloodGroup === (activeRequest?.bloodGroup || "O+")) || donors[0];
    acceptDonorRequestForHospital(reqId, targetDonor);
    toast.success(`Simulated Acceptance: Donor ${targetDonor.name} accepted request #${reqId}!`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
              <FileText className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Hospital Supply Chain
              </span>
              <h1 className="text-xl font-extrabold text-foreground">3-Step Blood Supply Requests</h1>
              <p className="text-xs text-muted-foreground">
                Matches internal stock ➔ nearby blood banks ➔ donor emergency network.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md h-10 px-4"
          >
            <Plus className="size-4 mr-1" />
            New Hospital Request
          </Button>
        </div>
      </div>

      {/* THREE-STAGE RESULT DISPLAY FOR ACTIVE REQUEST */}
      {activeRequest && (
        <div className="rounded-3xl bg-card p-6 shadow-glow border-2 border-indigo-500/40 space-y-5 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
                  REQUEST #{activeRequest.id}
                </span>
                <UrgencyBadge urgency={activeRequest.urgency} />
              </div>
              <h2 className="text-xl font-black text-foreground mt-1">
                {activeRequest.unitsNeeded} Units of {activeRequest.bloodGroup} Blood Needed
              </h2>
              <p className="text-xs text-muted-foreground">Patient ID: {activeRequest.patientId} · {activeRequest.location}</p>
            </div>

            <BloodGroupBadge group={activeRequest.bloodGroup} size="lg" />
          </div>

          {/* 3-STEP MATCHING WORKFLOW RESULTS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              3-Stage Multi-Source Supply Match Engine
            </h3>

            {/* STEP 1: INTERNAL INVENTORY */}
            <div className="rounded-2xl bg-indigo-500/10 p-4 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Hospital className="size-4" />
                  STEP 1: 🏥 Internal Hospital Inventory
                </span>
                <span className="text-[10px] font-bold bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full">
                  {inventory[activeRequest.bloodGroup]?.availableUnits || 0} Units Available
                </span>
              </div>
              <p className="text-xs text-foreground font-medium">
                {activeRequest.internalInventoryUsed > 0
                  ? `✓ Reserved ${activeRequest.internalInventoryUsed} unit(s) from internal hospital stock.`
                  : "Checking internal hospital stock..."}
              </p>
            </div>

            {/* STEP 2: NEARBY BLOOD BANKS */}
            <div className="rounded-2xl bg-primary-soft p-4 border border-primary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                  <Building2 className="size-4" />
                  STEP 2: 🏥 Nearby Blood Banks
                </span>
                <span className="text-[10px] font-bold bg-card text-foreground px-2 py-0.5 rounded-full border">
                  3 Blood Banks Located
                </span>
              </div>
              <p className="text-xs text-foreground font-medium">
                District Blood Centre & Pushpagiri Blood Bank have {activeRequest.bloodGroup} stock available.
              </p>
            </div>

            {/* STEP 3: DONOR NETWORK */}
            <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Users className="size-4" />
                  STEP 3: ❤️ Donor Emergency Network
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                  5 Donors Notified
                </span>
              </div>

              {activeRequest.confirmedDonors.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-emerald-600 block">
                    ❤️ DONOR CONFIRMED ({activeRequest.confirmedDonors.length})
                  </span>
                  {activeRequest.confirmedDonors.map((cd) => (
                    <div key={cd.donorId} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 text-xs">
                      <div>
                        <p className="font-bold text-foreground">{cd.donorName} (Donor #{cd.donorId})</p>
                        <p className="text-muted-foreground">{cd.distanceKm} km away · Status: {cd.status}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="tel:+919876543210"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1"
                        >
                          <PhoneCall className="size-3" /> Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Awaiting donor responses. Dispatched emergency alert to top 5 nearby O+ donors.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleSimulateDonorAccept(activeRequest.id)}
                    className="h-8 text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    + Simulate Donor Acceptance
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW HOSPITAL REQUEST MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black flex items-center gap-2">
              <Hospital className="size-5 text-indigo-600" />
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
              className="w-full h-12 rounded-2xl font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 mt-2"
            >
              RUN 3-STAGE SUPPLY MATCH ENGINE ⚡
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
