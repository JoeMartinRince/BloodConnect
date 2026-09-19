import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";

export function BloodGroupPicker({
  value,
  onChange,
  size = "lg",
}: {
  value: BloodGroup | null;
  onChange: (g: BloodGroup) => void;
  size?: "md" | "lg";
}) {
  return (
    <div className="grid grid-cols-4 gap-3" role="radiogroup" aria-label="Blood group">
      {BLOOD_GROUPS.map((g) => {
        const active = value === g;
        return (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(g)}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-3xl font-bold transition-all active:scale-95",
              size === "lg" ? "aspect-square text-xl" : "h-14 text-base",
              active
                ? "gradient-brand text-primary-foreground shadow-glow"
                : "bg-card text-foreground shadow-card hover:bg-primary-soft hover:text-primary",
            )}
          >
            <Droplet className={cn("size-4", active ? "fill-primary-foreground" : "fill-primary-soft text-primary")} />
            {g}
          </button>
        );
      })}
    </div>
  );
}
