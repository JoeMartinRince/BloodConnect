import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, ChevronLeft, Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { initials } from "@/utils/format";
import { MEDICAL_DISCLAIMER } from "@/utils/compatibility";

export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn("rounded-3xl bg-card p-4 shadow-card", onClick && "cursor-pointer transition-transform active:scale-[0.99]", className)}
    >
      {children}
    </div>
  );
}

export function Header({
  title,
  back,
  right,
  subtitle,
}: {
  title: string;
  back?: boolean | string;
  right?: ReactNode;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 bg-background/85 px-4 pt-4 pb-3 backdrop-blur-md lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-0">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        {back ? (
          typeof back === "string" ? (
            <Button asChild variant="secondary" size="icon-sm" aria-label="Back">
              <Link to={back}>
                <ChevronLeft />
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" size="icon-sm" aria-label="Back" onClick={() => router.history.back()}>
              <ChevronLeft />
            </Button>
          )
        ) : (
          <span />
        )}
        <div className="min-w-0 text-center">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex min-w-9 justify-end">{right}</div>
      </div>
    </header>
  );
}

export function SectionTitle({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold">{title}</h2>
      {action && to && (
        <Link to={to} className="text-xs font-semibold text-primary">
          {action}
        </Link>
      )}
    </div>
  );
}

export function Avatar({ name, className, size = "md" }: { name: string; className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const hue = (name.charCodeAt(0) * 37 + name.length * 11) % 360;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-primary-foreground",
        size === "sm" && "size-9 text-xs",
        size === "md" && "size-12 text-sm",
        size === "lg" && "size-16 text-lg",
        size === "xl" && "size-24 text-2xl",
        className,
      )}
      style={{ background: `linear-gradient(135deg, oklch(0.6 0.16 ${hue}), oklch(0.72 0.14 ${hue + 40}))` }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-card px-6 py-12 text-center shadow-card">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-6" />
      </div>
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-critical-soft px-6 py-10 text-center">
      <AlertCircle className="mb-3 size-8 text-critical" />
      <p className="font-semibold">Couldn't load this</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button className="mt-4" size="sm" variant="critical" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}

export function CardSkeletonList({ count = 3, height = "h-24" }: { count?: number; height?: string }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full rounded-3xl", height)} />
      ))}
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("rounded-2xl bg-muted px-4 py-3 text-center text-[11px] leading-relaxed text-muted-foreground", className)}>
      {MEDICAL_DISCLAIMER}
    </p>
  );
}

export function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-colors",
        active ? "bg-primary text-primary-foreground shadow-glow" : "bg-card text-foreground shadow-card hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
