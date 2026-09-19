import type { Availability, Urgency } from "@/types";

export function km(d: number) {
  return `${d.toFixed(1)} km`;
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const availabilityLabel: Record<Availability, string> = {
  available: "Available",
  unavailable: "Unavailable",
  recently_donated: "Recently donated",
};

export const urgencyLabel: Record<Urgency, string> = {
  normal: "Normal",
  urgent: "Urgent",
  critical: "Critical",
};

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}
