import { Bell, Heart, Siren, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types";

export function NotificationItem({ item, onClick }: { item: AppNotification; onClick?: () => void }) {
  const Icon = item.category === "emergency" ? Siren : item.category === "request" ? Heart : item.title.includes("Reminder") ? Droplet : Bell;
  const tone =
    item.category === "emergency"
      ? "bg-critical-soft text-critical"
      : item.category === "request"
        ? "bg-primary-soft text-primary"
        : "bg-muted text-muted-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-3xl bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]",
        !item.read && "ring-1 ring-primary/15",
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", tone)}>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate text-sm", item.read ? "font-semibold" : "font-bold")}>{item.title}</span>
          {!item.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.body}</span>
        <span className="mt-1 block text-[10px] text-muted-foreground">{item.time}</span>
      </span>
    </button>
  );
}
