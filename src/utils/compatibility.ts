import type { BloodGroup } from "@/types";

/**
 * Prototype compatibility table: recipient blood group -> donor groups that
 * are treated as compatible for whole-blood matching.
 *
 * This table is deliberately kept as plain, editable configuration so it can
 * be replaced or validated against authoritative medical guidance before any
 * real-world use. BloodConnect never makes transfusion decisions.
 */
export const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

export function isCompatible(recipient: BloodGroup, donor: BloodGroup): boolean {
  return COMPATIBLE_DONORS[recipient].includes(donor);
}

export const MEDICAL_DISCLAIMER =
  "BloodConnect helps connect donors and requests. Blood eligibility, compatibility, screening and transfusion decisions must be confirmed by qualified medical professionals.";
