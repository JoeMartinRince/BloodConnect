import type { BloodRequest, Donor, Match, MatchFactor, NewRequestInput } from "@/types";
import { isCompatible } from "./compatibility";

type RequestLike = Pick<BloodRequest | NewRequestInput, "bloodGroup" | "urgency">;

/** Tunable weights for the prototype prioritisation score (not a medical score). */
export const MATCH_WEIGHTS = {
  compatibility: 40,
  distanceMax: 35,
  distanceFalloffKm: 12,
  available: 20,
  recentlyDonated: 4,
  criticalNearbyBonus: 5,
  criticalNearbyKm: 5,
};

/**
 * Returns a 0–100 prioritisation score describing how quickly a donor could
 * plausibly help with a request, plus human-readable factors. Non-compatible
 * donors return null.
 */
export function calculateMatchPriority(request: RequestLike, donor: Donor): Match | null {
  if (!isCompatible(request.bloodGroup, donor.bloodGroup)) return null;

  const w = MATCH_WEIGHTS;
  let score = w.compatibility;

  const distanceScore = Math.max(0, w.distanceMax * (1 - donor.distanceKm / w.distanceFalloffKm));
  score += distanceScore;

  if (donor.availability === "available") score += w.available;
  else if (donor.availability === "recently_donated") score += w.recentlyDonated;

  if (
    request.urgency === "critical" &&
    donor.availability === "available" &&
    donor.distanceKm <= w.criticalNearbyKm
  ) {
    score += w.criticalNearbyBonus;
  }

  const priority = Math.min(100, Math.round(score));

  const factors: MatchFactor[] = [
    {
      label:
        donor.bloodGroup === request.bloodGroup
          ? "Same blood group"
          : `Compatible (${donor.bloodGroup} → ${request.bloodGroup})`,
      met: true,
    },
    { label: `${donor.distanceKm.toFixed(1)} km away`, met: donor.distanceKm <= 6 },
    {
      label:
        donor.availability === "available"
          ? "Available now"
          : donor.availability === "recently_donated"
            ? "Recently donated"
            : "Currently unavailable",
      met: donor.availability === "available",
    },
  ];

  const tier: Match["tier"] = priority >= 85 ? "high" : priority >= 65 ? "good" : "possible";
  return { donor, priority, tier, factors };
}

export type MatchSort = "priority" | "closest" | "available";

export function sortMatches(matches: Match[], sort: MatchSort): Match[] {
  const copy = [...matches];
  switch (sort) {
    case "closest":
      return copy.sort((a, b) => a.donor.distanceKm - b.donor.distanceKm);
    case "available":
      return copy.sort((a, b) => {
        const av = (m: Match) => (m.donor.availability === "available" ? 0 : 1);
        return av(a) - av(b) || b.priority - a.priority;
      });
    default:
      return copy.sort((a, b) => b.priority - a.priority);
  }
}

export function rankDonors(request: RequestLike, donors: Donor[]): Match[] {
  return sortMatches(
    donors.map((d) => calculateMatchPriority(request, d)).filter((m): m is Match => m !== null),
    "priority",
  );
}
