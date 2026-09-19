import { Building2, Droplet, Hospital, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapPoint } from "@/types";

export interface MapMarker {
  id: string;
  kind: "donor" | "request" | "bank" | "hospital" | "me";
  position: MapPoint;
  label?: string;
  highlight?: boolean;
  onClick?: () => void;
}

/**
 * Illustrative district map. No external map API is required — it renders a
 * stylised street grid with typed markers so donors, requests and blood banks
 * are still communicated visually.
 */
export function MapPlaceholder({
  markers,
  className,
  legend = true,
  radar = false,
}: {
  markers: MapMarker[];
  className?: string;
  legend?: boolean;
  radar?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-map-land shadow-card", className)}>
      <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <path d="M-10 60 C 80 40, 140 120, 230 90 S 380 30, 420 70 L 420 -10 L -10 -10 Z" className="fill-map-water" />
        <path d="M0 200 C 60 180, 90 240, 160 220 S 300 260, 400 235 L 400 260 L 0 260 Z" className="fill-map-water" opacity="0.7" />
        <ellipse cx="300" cy="170" rx="55" ry="35" className="fill-map-park" />
        <ellipse cx="80" cy="120" rx="38" ry="26" className="fill-map-park" />
        <g className="stroke-map-road" strokeWidth="7" fill="none" strokeLinecap="round">
          <path d="M-10 140 L 410 110" />
          <path d="M120 -10 L 150 270" />
          <path d="M260 -10 L 230 270" />
          <path d="M-10 210 Q 200 170 410 190" />
        </g>
        <g className="stroke-map-road" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M-10 80 L 410 60" />
          <path d="M40 -10 L 60 270" />
          <path d="M200 -10 L 190 270" />
          <path d="M330 -10 L 350 270" />
          <path d="M-10 175 L 410 160" />
          <path d="M-10 240 L 410 225" />
        </g>
        <g className="fill-border" opacity="0.7">
          {[30, 90, 170, 240, 300, 360].map((x, i) =>
            [20, 100, 150, 215].map((y, j) => (
              <rect key={`${i}-${j}`} x={x + (j % 2) * 8} y={y + (i % 3) * 5} width="14" height="10" rx="2" />
            )),
          )}
        </g>
      </svg>

      {radar && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full border border-primary/30" />
          <div className="absolute inset-[18%] rounded-full border border-primary/25" />
          <div className="absolute inset-[36%] rounded-full border border-primary/20" />
          <div
            className="absolute inset-0 animate-radar rounded-full"
            style={{ background: "conic-gradient(from 0deg, transparent 70%, oklch(0.585 0.245 15 / 0.35) 100%)" }}
          />
        </div>
      )}

      {markers.map((m) => (
        <Marker key={m.id} marker={m} />
      ))}

      {legend && (
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />Donor</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-critical" />Request</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-chart-4" />Bank</span>
        </div>
      )}
    </div>
  );
}

function Marker({ marker }: { marker: MapMarker }) {
  const { kind, position, highlight, label, onClick } = marker;
  const base = "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center";
  const style = { left: `${position.x}%`, top: `${position.y}%` };

  if (kind === "me") {
    return (
      <div className={base} style={style} aria-label="You">
        <span className="absolute size-5 animate-pulse-ring rounded-full bg-secondary/50" />
        <span className="relative flex size-5 items-center justify-center rounded-full bg-card shadow">
          <Navigation className="size-3 fill-secondary text-secondary" />
        </span>
      </div>
    );
  }

  const tone =
    kind === "donor"
      ? "bg-primary text-primary-foreground"
      : kind === "request"
        ? "bg-critical text-primary-foreground"
        : kind === "bank"
          ? "bg-chart-4 text-primary-foreground"
          : "bg-foreground text-primary-foreground";
  const Icon = kind === "donor" ? Droplet : kind === "request" ? Droplet : kind === "bank" ? Building2 : Hospital;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, onClick ? "cursor-pointer" : "cursor-default")}
      style={style}
      aria-label={label ?? kind}
    >
      {highlight && <span className="absolute size-7 animate-pulse-ring rounded-full bg-critical/50" />}
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full shadow-md ring-2 ring-card transition-transform",
          highlight ? "size-8" : "size-6",
          tone,
        )}
      >
        <Icon className={cn(highlight ? "size-4" : "size-3", kind !== "bank" && kind !== "hospital" && "fill-current")} />
      </span>
      {label && (
        <span className="mt-0.5 rounded-full bg-card/90 px-1.5 text-[9px] font-semibold shadow-sm">{label}</span>
      )}
    </button>
  );
}
