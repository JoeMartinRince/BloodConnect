import React, { useState } from "react";
import { MapPin, Navigation, Compass, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DISTRICTS, type District } from "@/types";
import { useLocation } from "@/hooks/useLocation";
import { cn } from "@/lib/utils";

const COMMON_AREAS: Record<District, string[]> = {
  Pathanamthitta: ["Thiruvalla", "Adoor", "Kozhencherry", "Ranni", "Pandalam", "Kumbanad", "Mallappally", "Konni"],
  Kottayam: ["Changanassery", "Kottayam Town", "Pala", "Vaikom"],
  Alappuzha: ["Chengannur", "Mavelikkara", "Kayamkulam", "Alappuzha Town"],
  Kollam: ["Kottarakkara", "Kollam Town", "Karunagappally"],
  Ernakulam: ["Piravom", "Kochi", "Aluva"],
  Thiruvananthapuram: ["Attingal", "Trivandrum City"],
};

export function LocationSelector({ className }: { className?: string }) {
  const { location, loading, isManual, requestLocation, setManualLocation } = useLocation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District>(location.district || "Pathanamthitta");
  const [selectedArea, setSelectedArea] = useState<string>(location.area || "Thiruvalla");

  const handleManualSave = () => {
    setManualLocation(selectedDistrict, selectedArea);
    setDialogOpen(false);
  };

  return (
    <>
      <div className={cn("flex items-center gap-1.5 min-w-0 flex-1 max-w-full justify-center", className)}>
        {/* Location Status Pill - Compact, Truncating, Single-line */}
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className={cn(
            "inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-bold transition-all border cursor-pointer min-w-0 max-w-full shrink overflow-hidden",
            loading
              ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
              : isManual
              ? "bg-card text-foreground border-border hover:bg-muted shadow-sm"
              : "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm"
          )}
        >
          {loading ? (
            <>
              <RefreshCw className="size-3 shrink-0 animate-spin text-amber-600" />
              <span className="truncate text-[11px]">Detecting...</span>
            </>
          ) : (
            <>
              <MapPin className={cn("size-3 shrink-0", isManual ? "text-primary" : "text-emerald-600")} />
              
              {/* Responsive Location Text: Truncates gracefully without wrapping */}
              <span className="truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[200px] text-[11px] sm:text-xs whitespace-nowrap font-bold">
                <span className="hidden xs:inline">{location.area ? `${location.area}, ` : ""}</span>
                <span>{location.district || "Pathanamthitta"}</span>
              </span>

              <span className="text-[9px] uppercase font-extrabold px-1 py-0.2 rounded bg-muted/80 text-muted-foreground border shrink-0">
                {isManual ? "Manual" : "GPS"}
              </span>
              
              <ChevronDown className="size-3 shrink-0 text-muted-foreground ml-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Manual Location Selection Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-md rounded-3xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Select Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* GPS Detection CTA */}
            <div className="rounded-2xl bg-primary-soft/60 p-3.5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Navigation className="size-4 text-primary" />
                  Automatic GPS Detection
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Find nearby compatible blood donors, blood banks, and emergency hospitals based on your precise location.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  requestLocation();
                  setDialogOpen(false);
                }}
                className="w-full h-10 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              >
                <Compass className="size-4 mr-1.5" />
                Use Current GPS Location
              </Button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase">
                OR CHOOSE MANUALLY
              </span>
            </div>

            {/* Manual District & Area Selectors */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const d = e.target.value as District;
                    setSelectedDistrict(d);
                    setSelectedArea(COMMON_AREAS[d]?.[0] || "");
                  }}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-xs font-bold"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">City / Area</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(COMMON_AREAS[selectedDistrict] || []).map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setSelectedArea(area)}
                      className={cn(
                        "rounded-xl px-2 py-1 text-[11px] font-semibold border transition-all cursor-pointer",
                        selectedArea === area
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                      )}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  placeholder="Or enter custom town/area..."
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-xs font-medium"
                />
              </div>

              <Button
                type="button"
                onClick={handleManualSave}
                className="w-full h-11 rounded-2xl font-extrabold bg-foreground text-background hover:bg-foreground/90 mt-2 text-xs"
              >
                Save Manual Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
