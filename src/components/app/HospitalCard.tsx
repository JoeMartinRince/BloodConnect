import { Link } from "@tanstack/react-router";
import { Building2, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BloodBank } from "@/types";
import { km } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { BloodGroupBadge } from "./Badges";

export function HospitalCard({ bank, compact = false }: { bank: BloodBank; compact?: boolean }) {
  const open = (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold", bank.isOpen ? "text-success" : "text-muted-foreground")}>
      <span className={cn("size-1.5 rounded-full", bank.isOpen ? "bg-success" : "bg-muted-foreground")} />
      {bank.isOpen ? "Open" : "Closed"}
    </span>
  );

  if (compact) {
    return (
      <Link
        to="/banks/$bankId"
        params={{ bankId: bank.id }}
        className="w-44 shrink-0 rounded-3xl bg-card p-4 shadow-card transition-transform active:scale-[0.98]"
      >
        <div className="flex size-10 items-center justify-center rounded-2xl bg-success-soft text-success">
          <Building2 className="size-5" />
        </div>
        <p className="mt-3 line-clamp-2 text-sm font-bold leading-tight">{bank.name}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="size-3" />{km(bank.distanceKm)}</span>
          <span className="flex items-center gap-1"><Star className="size-3 fill-warning text-warning" />{bank.rating}</span>
        </div>
        <div className="mt-1.5">{open}</div>
      </Link>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success">
          <Building2 className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">{bank.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{km(bank.distanceKm)}</span>
            <span className="flex items-center gap-1"><Star className="size-3 fill-warning text-warning" />{bank.rating} ({bank.reviews})</span>
            {open}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Available blood groups</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {bank.availableGroups.map((g) => (
          <BloodGroupBadge key={g} group={g} size="sm" />
        ))}
      </div>
      <Button asChild variant="soft" size="sm" className="mt-3 w-full">
        <Link to="/banks/$bankId" params={{ bankId: bank.id }}>
          View Details
        </Link>
      </Button>
    </div>
  );
}
