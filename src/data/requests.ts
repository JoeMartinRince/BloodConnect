import type { BloodRequest } from "@/types";

const h = (hoursAgo: number) => new Date(Date.now() - hoursAgo * 3600_000).toISOString();

export const bloodRequests: BloodRequest[] = [
  { id: "r1042", code: "1042", bloodGroup: "O-", units: 2, district: "Pathanamthitta", location: "Thiruvalla", hospital: "Believers Church Medical College", urgency: "critical", patientNote: "Road accident, surgery in progress", requesterName: "Dr. Sunil (BCMCH)", createdAt: h(0.4), status: "active", distanceKm: 3.2, position: { x: 52, y: 44 } },
  { id: "r1041", code: "1041", bloodGroup: "A+", units: 1, district: "Pathanamthitta", location: "Kozhencherry", hospital: "St. Thomas Mission Hospital", urgency: "urgent", requesterName: "Reena Mathew", createdAt: h(2), status: "active", distanceKm: 4.9, position: { x: 57, y: 66 } },
  { id: "r1040", code: "1040", bloodGroup: "B+", units: 3, district: "Pathanamthitta", location: "Adoor", hospital: "Adoor Taluk Hospital", urgency: "normal", requesterName: "Suresh Babu", createdAt: h(5), status: "active", distanceKm: 6.1, position: { x: 70, y: 27 } },
  { id: "r1039", code: "1039", bloodGroup: "O+", units: 2, district: "Kottayam", location: "Changanassery", hospital: "Kottayam Medical College", urgency: "critical", requesterName: "Dr. Prakash", createdAt: h(7), status: "matched", distanceKm: 11.0, position: { x: 14, y: 18 } },
  { id: "r1038", code: "1038", bloodGroup: "AB+", units: 1, district: "Pathanamthitta", location: "Pandalam", hospital: "Pandalam Govt Hospital", urgency: "normal", requesterName: "Biju Varghese", createdAt: h(20), status: "active", distanceKm: 6.5, position: { x: 21, y: 74 } },
  { id: "r1037", code: "1037", bloodGroup: "O+", units: 4, district: "Alappuzha", location: "Chengannur", hospital: "Chengannur District Hospital", urgency: "urgent", requesterName: "Anitha K", createdAt: h(26), status: "fulfilled", distanceKm: 9.4, position: { x: 11, y: 48 } },
  { id: "r1036", code: "1036", bloodGroup: "A-", units: 1, district: "Pathanamthitta", location: "Ranni", hospital: "Ranni Taluk Hospital", urgency: "urgent", requesterName: "Joseph Thomas", createdAt: h(30), status: "fulfilled", distanceKm: 9.0, position: { x: 83, y: 68 } },
  { id: "r1035", code: "1035", bloodGroup: "B-", units: 2, district: "Kollam", location: "Kottarakkara", hospital: "Kottarakkara Taluk Hospital", urgency: "critical", requesterName: "Dr. Latha", createdAt: h(48), status: "fulfilled", distanceKm: 14.5, position: { x: 7, y: 90 } },
  { id: "r1034", code: "1034", bloodGroup: "O+", units: 1, district: "Pathanamthitta", location: "Thiruvalla", hospital: "Pushpagiri Medical College", urgency: "normal", requesterName: "Meenu Rajan", createdAt: h(72), status: "cancelled", distanceKm: 2.2, position: { x: 45, y: 36 } },
  { id: "r1033", code: "1033", bloodGroup: "AB-", units: 1, district: "Ernakulam", location: "Piravom", hospital: "Ernakulam General Hospital", urgency: "urgent", requesterName: "Dr. Alex", createdAt: h(96), status: "fulfilled", distanceKm: 18.9, position: { x: 89, y: 12 } },
];
