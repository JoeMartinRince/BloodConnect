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
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold">
              <Boxes className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Inventory Console</span>
              <h1 className="text-xl font-extrabold text-foreground">Blood Inventory & Expiry Management</h1>
              <p className="text-xs text-muted-foreground">Manage blood units, batch shelf-life & reservations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* EXPIRY ALERT BANNER */}
      <div className="rounded-3xl bg-amber-500/10 p-5 border-2 border-amber-500/40 shadow-sm flex items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold">
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
            🟡 Batch Expiry Alert: 2 Units Expiring Soon
          </h3>
          <p className="text-xs text-muted-foreground">
            O+ Batch #b-o2 (2 units) expires in 3 days (2026-09-22). Prioritize for immediate issue.
          </p>
        </div>
      </div>

      {/* BLOOD GROUP CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BLOOD_GROUPS.map((bg) => {
          const item = inventory[bg] || { availableUnits: 0, reservedUnits: 0, issuedTodayUnits: 0, expiringSoonUnits: 0 };
          const isSelected = selectedGroup === bg;
          const isLow = item.availableUnits <= 2;

          return (
            <div
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={cn(
                "rounded-3xl p-4 border-2 transition-all cursor-pointer shadow-card space-y-2 text-center",
                isSelected
                  ? "bg-indigo-500/10 border-indigo-600 ring-2 ring-indigo-600/20 shadow-glow"
                  : isLow
                  ? "bg-amber-500/5 border-amber-500/40 hover:border-amber-500"
                  : "bg-card border-border/70 hover:border-indigo-500/40"
              )}
            >
              <div className="flex items-center justify-between">
                <BloodGroupBadge group={bg} size="sm" />
                {item.expiringSoonUnits > 0 && (
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" title="Expiring soon" />
                )}
              </div>

              <div className="py-1">
                <span className="text-2xl font-black text-foreground block tabular-nums">
                  {item.availableUnits} <span className="text-xs font-bold text-muted-foreground">units</span>
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  {item.reservedUnits} Reserved · {item.issuedTodayUnits} Issued
                </span>
              </div>

              <Button
                size="sm"
                className={cn(
                  "w-full h-8 rounded-xl font-bold text-xs",
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
                <p className="text-xs text-muted-foreground">District Blood Centre Stock Console</p>
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
              <span className="text-2xl font-black text-foreground block mt-0.5">{activeItem.issuedTodayUnits}</span>
            </div>

            <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/30 text-center">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Expiring Soon</span>
              <span className="text-2xl font-black text-amber-600 block mt-0.5">{activeItem.expiringSoonUnits}</span>
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

          {/* Batches Shelf-life Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Inventory Batches Log
            </h3>

            {activeItem.batches.length > 0 ? (
              <div className="space-y-2">
                {activeItem.batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 text-xs font-medium"
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
