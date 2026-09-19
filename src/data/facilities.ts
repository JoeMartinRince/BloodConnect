import type { BloodBank, Hospital } from "@/types";

export const bloodBanks: BloodBank[] = [
  { id: "b1", name: "District Blood Centre", district: "Pathanamthitta", address: "General Hospital Rd, Pathanamthitta 689645", phone: "0468 222 1234", distanceKm: 2.8, rating: 4.6, reviews: 214, isOpen: true, hours: "Open 24 hours", availableGroups: ["A+", "B+", "O+", "O-"], position: { x: 50, y: 52 } },
  { id: "b2", name: "Pushpagiri Blood Bank", district: "Pathanamthitta", address: "Pushpagiri Medical College, Thiruvalla 689101", phone: "0469 270 0755", distanceKm: 3.5, rating: 4.8, reviews: 341, isOpen: true, hours: "Open 24 hours", availableGroups: ["A+", "A-", "B+", "AB+", "O+"], position: { x: 43, y: 33 } },
  { id: "b3", name: "IMA Voluntary Blood Bank", district: "Pathanamthitta", address: "IMA House, Kozhencherry 689641", phone: "0468 231 4455", distanceKm: 5.2, rating: 4.4, reviews: 128, isOpen: false, hours: "Opens 8:00 AM", availableGroups: ["B+", "O+"], position: { x: 60, y: 68 } },
  { id: "b4", name: "Believers Church Blood Bank", district: "Pathanamthitta", address: "BCMCH Campus, Kuttapuzha, Thiruvalla 689103", phone: "0469 274 2000", distanceKm: 4.1, rating: 4.7, reviews: 276, isOpen: true, hours: "Open 24 hours", availableGroups: ["A+", "B+", "B-", "AB+", "O+", "O-"], position: { x: 35, y: 44 } },
  { id: "b5", name: "Kottayam Medical College Blood Bank", district: "Kottayam", address: "Gandhinagar, Kottayam 686008", phone: "0481 259 7311", distanceKm: 12.6, rating: 4.5, reviews: 512, isOpen: true, hours: "Open 24 hours", availableGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], position: { x: 14, y: 16 } },
];

export const hospitals: Hospital[] = [
  { id: "h1", name: "Believers Church Medical College", district: "Pathanamthitta", address: "Kuttapuzha, Thiruvalla", phone: "0469 274 2000", distanceKm: 4.1, emergency: true, position: { x: 34, y: 46 } },
  { id: "h2", name: "St. Thomas Mission Hospital", district: "Pathanamthitta", address: "Kattoor, Kozhencherry", phone: "0468 221 4080", distanceKm: 4.9, emergency: true, position: { x: 58, y: 64 } },
  { id: "h3", name: "Pathanamthitta General Hospital", district: "Pathanamthitta", address: "General Hospital Rd, Pathanamthitta", phone: "0468 222 2364", distanceKm: 2.6, emergency: true, position: { x: 51, y: 54 } },
];
