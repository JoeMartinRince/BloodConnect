import { cn } from "@/lib/utils";

/** Blood drop + heart mark for BloodConnect. */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-12", className)} aria-hidden>
      <path
        d="M32 4C32 4 12 26 12 40a20 20 0 0 0 40 0C52 26 32 4 32 4Z"
        className={inverted ? "fill-primary-foreground" : "fill-primary"}
      />
      <path
        d="M32 50s-11-6.6-11-14a5.6 5.6 0 0 1 11-1.6A5.6 5.6 0 0 1 43 36c0 7.4-11 14-11 14Z"
        className={inverted ? "fill-primary" : "fill-primary-foreground"}
      />
    </svg>
  );
}

export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className="size-8" inverted={inverted} />
      <span className={cn("text-lg font-bold tracking-tight", inverted ? "text-primary-foreground" : "text-foreground")}>
        Blood<span className={inverted ? "" : "text-primary"}>Connect</span>
      </span>
    </div>
  );
}
