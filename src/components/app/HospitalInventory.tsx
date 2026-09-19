import React, { useState } from "react";
import { Boxes, Plus, Minus, AlertTriangle, Calendar, CheckCircle2, Clock, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BloodGroupBadge } from "@/components/app/Badges";
import { BLOOD_GROUPS, type BloodGroup, type InventoryBatch } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HospitalInventory() {
  const { inventory, updateInventory, addInventoryBatch } = useAppStore();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>("O+");
  const [addUnitsInput, setAddUnitsInput] = useState<number>(2);
  const [collectionDateInput, setCollectionDateInput] = useState<string>("2026-09-19");
  const [expiryDateInput, setExpiryDateInput] = useState<string>("2026-10-24");

  const activeItem = selectedGroup ? inventory[selectedGroup] : null;

  const handleAddUnits = () => {
    if (!selectedGroup) return;
    addInventoryBatch(selectedGroup, addUnitsInput, collectionDateInput, expiryDateInput);
    toast.success(`Added ${addUnitsInput} unit(s) of ${selectedGroup} blood to inventory!`);
  };

  const handleRemoveUnit = () => {
    if (!selectedGroup) return;
    updateInventory(selectedGroup, -1);
    toast.info(`Removed 1 unit of ${selectedGroup} from available stock.`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 sm:p-6 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
              <Boxes className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Hospital Inventory</span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">Blood Inventory & Expiry Management</h1>
              <p className="text-xs text-muted-foreground">Manage blood units, reserved stock, batch shelf-life & reservations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONABLE EXPIRY ALERT BANNER */}
      <div className="rounded-3xl bg-amber-500/10 p-5 border-2 border-amber-500/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold shadow-md">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
              ⚠️ EXPIRING SOON: 2 units of O+ expire in 3 days
            </h3>
            <p className="text-xs text-muted-foreground">
              Batch: <strong>#BB-02</strong> · Expiry: <strong>22 Sep 2026</strong>. Prioritize for immediate transfusion issue.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setSelectedGroup("O+");
            toast.info("Opened Batch #BB-02 details for O+ inventory.");
          }}
          className="rounded-xl font-extrabold bg-amber-600 hover:bg-amber-700 text-white h-9 px-4 shrink-0 text-xs shadow-sm"
        >
          View Batch
        </Button>
      </div>

      {/* BLOOD GROUP CARDS GRID WITH ENHANCED METRICS & VISUAL STATUS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BLOOD_GROUPS.map((bg) => {
          const item = inventory[bg] || {
            availableUnits: 0,
            reservedUnits: 0,
            issuedTodayUnits: 0,
            expiringSoonUnits: 0,
          };
          const totalUnits = item.availableUnits + item.reservedUnits;
          const isSelected = selectedGroup === bg;

          // Visual status indicator logic
          let statusBadge = { label: "HEALTHY", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" };
          if (item.availableUnits === 0) {
            statusBadge = { label: "CRITICAL", color: "bg-critical-soft text-critical border border-critical/30" };
          } else if (item.availableUnits <= 2) {
            statusBadge = { label: "LOW", color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" };
          } else if (item.expiringSoonUnits > 0) {
            statusBadge = { label: "EXPIRING SOON", color: "bg-amber-500 text-white" };
          }

          return (
            <div
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={cn(
                "rounded-3xl p-4 border-2 transition-all cursor-pointer shadow-card space-y-2.5 text-center relative overflow-hidden",
                isSelected
                  ? "bg-indigo-500/10 border-indigo-600 ring-2 ring-indigo-600/20 shadow-glow"
                  : "bg-card border-border/70 hover:border-indigo-500/40"
              )}
            >
              <div className="flex items-center justify-between">
                <BloodGroupBadge group={bg} size="sm" />
                <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", statusBadge.color)}>
                  {statusBadge.label}
                </span>
              </div>

              <div className="py-1 space-y-1">
                <span className="text-2xl font-black text-foreground block tabular-nums">
                  {totalUnits} <span className="text-xs font-bold text-muted-foreground uppercase">Units</span>
                </span>

                <div className="text-[11px] font-semibold text-muted-foreground space-y-0.5 border-t border-border/40 pt-1.5 text-left">
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <strong className="text-emerald-600">{item.availableUnits}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reserved:</span>
                    <strong className="text-indigo-600">{item.reservedUnits}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Issued:</span>
                    <strong className="text-foreground">{item.issuedTodayUnits || 3}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                    <span>Next expiry:</span>
                    <span className="font-bold text-amber-700">22 Sep</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className={cn(
                  "w-full h-8 rounded-xl font-bold text-xs mt-1",
                  isSelected ? "bg-indigo-600 text-white" : "bg-muted text-foreground hover:bg-indigo-500/10"
                )}
              >
                Manage Stock
              </Button>
            </div>
          );
        })}
      </div>

      {/* DETAILED INVENTORY MANAGEMENT PANEL FOR SELECTED GROUP */}
      {selectedGroup && activeItem && (
        <div className="rounded-3xl bg-card p-6 shadow-glow border-2 border-indigo-500/40 space-y-5 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={selectedGroup} size="lg" />
              <div>
                <h2 className="text-xl font-black text-foreground">{selectedGroup} INVENTORY BREAKDOWN</h2>
                <p className="text-xs text-muted-foreground">Pushpagiri Medical College Hospital Stock Console</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRemoveUnit}
                variant="outline"
                className="rounded-xl border-border text-foreground font-bold h-9"
              >
                <Minus className="size-4 mr-1" />
                Issue 1 Unit
              </Button>
              <Button
                size="sm"
                onClick={handleAddUnits}
                className="rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 h-9"
              >
                <Plus className="size-4 mr-1" />
                Add Batch
              </Button>
            </div>
          </div>

          {/* Breakdown Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/30 text-center">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700">Available</span>
              <span className="text-2xl font-black text-emerald-600 block mt-0.5">{activeItem.availableUnits}</span>
            </div>

            <div className="rounded-2xl bg-indigo-500/10 p-3.5 border border-indigo-500/30 text-center">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Reserved</span>
              <span className="text-2xl font-black text-indigo-600 block mt-0.5">{activeItem.reservedUnits}</span>
            </div>

            <div className="rounded-2xl bg-muted/60 p-3.5 border border-border/60 text-center">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Issued Today</span>
              <span className="text-2xl font-black text-foreground block mt-0.5">{activeItem.issuedTodayUnits || 3}</span>
            </div>

            <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/30 text-center">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Expiring Soon</span>
              <span className="text-2xl font-black text-amber-600 block mt-0.5">{activeItem.expiringSoonUnits || 2}</span>
            </div>
          </div>

          {/* Add New Batch Form */}
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Add New Blood Units Batch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Units Count</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={addUnitsInput}
                  onChange={(e) => setAddUnitsInput(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Collection Date</label>
                <input
                  type="date"
                  value={collectionDateInput}
                  onChange={(e) => setCollectionDateInput(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDateInput}
                  onChange={(e) => setExpiryDateInput(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <Button
              onClick={handleAddUnits}
              className="w-full h-10 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              + Confirm Add {addUnitsInput} Unit(s) Batch to {selectedGroup} Inventory
            </Button>
          </div>

          {/* Batches Log Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Inventory Batches Log
            </h3>

            {activeItem.batches.length > 0 ? (
              <div className="space-y-2">
                {activeItem.batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-card border border-border/60 text-xs font-medium gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">#{batch.id}</span>
                      <span>·</span>
                      <span className="font-bold text-foreground">{batch.units} Units</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">Expires: {batch.expiryDate}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                          batch.status === "expiring_soon"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        {batch.status === "expiring_soon" ? "🟡 Expiring Soon" : "🟢 Safe"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">No batches logged.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
