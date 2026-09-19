/**
 * Geographic location and Haversine distance utilities for BloodConnect.
 */
import type { District, MapPoint } from "@/types";

export interface GeoPoint {
  lat: number;
  lng: number;
  district?: District;
  area?: string;
  address?: string;
}

// Known coordinates for Kerala districts
export const DISTRICT_COORDINATES: Record<District, { lat: number; lng: number }> = {
  Pathanamthitta: { lat: 9.2648, lng: 76.787 },
  Kottayam: { lat: 9.5916, lng: 76.5222 },
  Alappuzha: { lat: 9.4981, lng: 76.3388 },
  Kollam: { lat: 8.8932, lng: 76.6141 },
  Ernakulam: { lat: 9.9816, lng: 76.2999 },
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
};

/** Default fallback location (Pathanamthitta Town) */
export const DEFAULT_LOCATION: GeoPoint = {
  lat: 9.2648,
  lng: 76.787,
  district: "Pathanamthitta",
  area: "Thiruvalla",
  address: "Central Hospital Road, Pathanamthitta, Kerala",
};

/**
 * Calculates geographic distance in kilometers using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0.2;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place (e.g. 2.4 km)
}

/**
 * Converts lat/lng coordinates within Pathanamthitta district to a 0-100 x/y MapPoint percentage for the illustrative SVG map.
 */
export function geoToMapPoint(lat: number, lng: number): MapPoint {
  // Map bounds surrounding Pathanamthitta region
  const minLat = 9.15;
  const maxLat = 9.65;
  const minLng = 76.3;
  const maxLng = 77.0;

  const x = Math.min(95, Math.max(5, ((lng - minLng) / (maxLng - minLng)) * 100));
  const y = Math.min(95, Math.max(5, (1 - (lat - minLat) / (maxLat - minLat)) * 100));

  return { x: Math.round(x), y: Math.round(y) };
}
