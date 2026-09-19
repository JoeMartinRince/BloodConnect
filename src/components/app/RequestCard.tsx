import { Link } from "@tanstack/react-router";
import { MapPin, Siren, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BloodRequest } from "@/types";
import { km, timeAgo } from "@/utils/format";
import { BloodGroupBadge, RequestStatusBadge, UrgencyBadge } from "./Badges";

export function RequestCard({ request, className }: { request: BloodRequest; className?: string }) {
  const critical = request.urgency === "critical";
  return (
    <Link
      to="/matching/$requestId"
      params={{ requestId: request.id }}
      className={cn(
        "flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card transition-transform active:scale-[0.99]",
        critical && request.status === "active" && "ring-1 ring-critical/30",
        className,
      )}
    >
      <BloodGroupBadge group={request.bloodGroup} size="lg" className={cn(critical && "bg-critical-soft text-critical")} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold">#{request.code} · {request.units} unit{request.units > 1 ? "s" : ""}</p>
          {critical && request.status === "active" && <Siren className="size-3.5 text-critical" />}
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          {request.hospital} · {km(request.distanceKm)}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <UrgencyBadge urgency={request.urgency} />
          <RequestStatusBadge status={request.status} />
          <span className="ml-auto text-[10px] text-muted-foreground">{timeAgo(request.createdAt)}</span>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
