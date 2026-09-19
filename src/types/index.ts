export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export type District =
  | "Pathanamthitta"
  | "Thiruvananthapuram"
  | "Kollam"
  | "Alappuzha"
  | "Kottayam"
  | "Ernakulam";

export const DISTRICTS: District[] = [
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Kollam",
  "Alappuzha",
  "Kottayam",
  "Ernakulam",
];

export type UserRole = "seeker" | "donor" | "hospital";

export type Availability = "available" | "unavailable" | "recently_donated";
export type Urgency = "normal" | "urgent" | "critical";

export type RequestStatus =
  | "active"
  | "matched"
  | "fulfilled"
  | "cancelled"
  | "CREATED"
  | "SEARCHING"
  | "DONORS_NOTIFIED"
  | "DONOR_ACCEPTED"
  | "HOSPITAL_CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type DonorRequestState = "none" | "sent" | "accepted" | "declined";

/** Position on the illustrative map, expressed in percent of the map area. */
export interface MapPoint {
  x: number;
  y: number;
}

export interface GeoLocationPoint {
  lat: number;
  lng: number;
  district?: District;
  area?: string;
  address?: string;
}

export interface Donor {
  id: string;
  /** Public donor code shown in matching (privacy-friendly). */
  code: string;
  name: string;
  bloodGroup: BloodGroup;
  district: District;
  area: string;
  distanceKm: number;
  availability: Availability;
  unavailableUntilDate?: string;
  lastActive: string;
  donations: number;
  lastDonation?: string;
  position: MapPoint;
  lat?: number;
  lng?: number;
}

export interface BloodRequest {
  id: string;
  code: string;
  bloodGroup: BloodGroup;
  units: number;
  district: District;
  location: string;
  hospital: string;
  urgency: Urgency;
  patientNote?: string;
  requesterName: string;
  createdAt: string;
  status: RequestStatus;
  distanceKm: number;
  position: MapPoint;
  lat?: number;
  lng?: number;
}

export interface BloodBank {
  id: string;
  name: string;
  district: District;
  address: string;
  phone: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  isOpen: boolean;
  hours: string;
  availableGroups: BloodGroup[];
  stockByGroup?: Record<BloodGroup, number>;
  position: MapPoint;
  lat?: number;
  lng?: number;
}

export interface Hospital {
  id: string;
  name: string;
  district: District;
  address: string;
  phone: string;
  distanceKm: number;
  emergency: boolean;
  position: MapPoint;
  lat?: number;
  lng?: number;
}

export interface MatchFactor {
  label: string;
  met: boolean;
}

export interface Match {
  donor: Donor;
  priority: number;
  tier: "high" | "good" | "possible";
  factors: MatchFactor[];
}

export type NotificationCategory = "emergency" | "request" | "update";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  bloodGroup?: BloodGroup;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bloodGroup: BloodGroup;
  district: District;
  role: UserRole;
  donations: number;
  requests: number;
  monthsActive: number;
  hospitalName?: string;
  facilityId?: string;
  donorAvailability?: Availability;
  unavailableUntilDate?: string;
}

export interface NewRequestInput {
  bloodGroup: BloodGroup;
  units: number;
  district: District;
  location: string;
  hospital: string;
  urgency: Urgency;
  patientNote?: string;
}

// HOSPITAL & INVENTORY EXTENDED TYPES

export interface InventoryBatch {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  collectionDate: string;
  expiryDate: string;
  status: "safe" | "expiring_soon" | "expired";
}

export interface BloodInventoryItem {
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  issuedTodayUnits: number;
  expiringSoonUnits: number;
  batches: InventoryBatch[];
}

export interface ConfirmedDonorDetail {
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  distanceKm: number;
  phone?: string;
  status: "confirmed" | "en_route" | "completed";
}

export interface HospitalRequest {
  id: string;
  patientId: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  internalInventoryUsed: number;
  bloodBankUnitsReserved: number;
  donorUnitsRequested: number;
  urgency: Urgency;
  requiredBy: string;
  location: string;
  status: RequestStatus;
  createdAt: string;
  notifiedDonorsCount: number;
  confirmedDonors: ConfirmedDonorDetail[];
}
