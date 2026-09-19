import { cn } from "@/lib/utils";
import type { Availability, BloodGroup, RequestStatus, Urgency } from "@/types";
import { availabilityLabel, urgencyLabel } from "@/utils/format";

export function BloodGroupBadge({
  group,
  size = "md",
  className,
}: {
  group: BloodGroup;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold tabular-nums text-primary",
        size === "sm" && "h-6 min-w-6 px-1.5 text-[11px]",
        size === "md" && "h-8 min-w-8 px-2 text-xs",
        size === "lg" && "h-12 min-w-12 px-3 text-base",
        className,
      )}
    >
      {group}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: Availability; className?: string }) {
  const tone =
    status === "available"
      ? "bg-success-soft text-success"
      : status === "recently_donated"
        ? "bg-warning-soft text-warning-foreground"
        : "bg-muted text-muted-foreground";
  const dot =
    status === "available" ? "bg-success" : status === "recently_donated" ? "bg-warning" : "bg-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", tone, className)}>
      <span className={cn("size-1.5 rounded-full", dot, status === "available" && "animate-pulse")} />
      {availabilityLabel[status]}
    </span>
  );
}

export function UrgencyBadge({ urgency, className }: { urgency: Urgency; className?: string }) {
  const tone =
    urgency === "critical"
      ? "bg-critical text-primary-foreground"
      : urgency === "urgent"
        ? "bg-warning-soft text-warning-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", tone, className)}>
      {urgencyLabel[urgency]}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, string> = {
    active: "bg-primary-soft text-primary",
    matched: "bg-warning-soft text-warning-foreground",
    fulfilled: "bg-success-soft text-success",
    cancelled: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", map[status])}>
      {status}
    </span>
  );
}
