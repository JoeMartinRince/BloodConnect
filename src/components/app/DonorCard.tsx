import { MapPin, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Donor, DonorRequestState } from "@/types";
import { km } from "@/utils/format";
import { Avatar } from "./Primitives";
import { BloodGroupBadge, StatusBadge } from "./Badges";

export function DonorCard({
  donor,
  state = "none",
  onRequest,
  compact = false,
  className,
}: {
  donor: Donor;
  state?: DonorRequestState;
  onRequest?: () => void;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <div className={cn("w-40 shrink-0 rounded-3xl bg-card p-4 shadow-card", className)}>
        <div className="flex items-start justify-between">
          <Avatar name={donor.name} size="md" />
          <BloodGroupBadge group={donor.bloodGroup} size="sm" />
        </div>
        <p className="mt-3 truncate text-sm font-bold">{donor.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {km(donor.distanceKm)} away
        </p>
        <div className="mt-2">
          <StatusBadge status={donor.availability} />
        </div>
        <RequestButton state={state} onRequest={onRequest} className="mt-3 w-full" size="sm" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-3xl bg-card p-4 shadow-card", className)}>
      <div className="flex items-center gap-3">
        <Avatar name={donor.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-bold">{donor.name}</p>
            <BloodGroupBadge group={donor.bloodGroup} size="sm" />
          </div>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{km(donor.distanceKm)}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />{donor.lastActive}</span>
          </p>
          <div className="mt-1.5">
            <StatusBadge status={donor.availability} />
          </div>
        </div>
        <RequestButton state={state} onRequest={onRequest} size="sm" disabled={donor.availability === "unavailable"} />
      </div>
    </div>
  );
}

export function RequestButton({
  state,
  onRequest,
  className,
  size = "default",
  disabled,
  label = "Request",
}: {
  state: DonorRequestState;
  onRequest?: () => void;
  className?: string;
  size?: "sm" | "default";
  disabled?: boolean;
  label?: string;
}) {
  if (state === "accepted")
    return (
      <Button size={size} variant="success" className={className} disabled>
        <Check /> Accepted
      </Button>
    );
  if (state === "sent")
    return (
      <Button size={size} variant="soft" className={className} disabled>
        <Clock /> Request Sent
      </Button>
    );
  if (state === "declined")
    return (
      <Button size={size} variant="muted" className={className} disabled>
        Declined
      </Button>
    );
  return (
    <Button size={size} className={className} onClick={onRequest} disabled={disabled}>
      {label}
    </Button>
  );
}
