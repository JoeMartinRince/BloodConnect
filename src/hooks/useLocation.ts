import { useState, useEffect, useCallback } from "react";
import { DEFAULT_LOCATION, DISTRICT_COORDINATES, type GeoPoint } from "@/utils/geo";
import type { District } from "@/types";

export type LocationPermissionState = "prompt" | "granted" | "denied" | "unsupported";

const LOCATION_STORAGE_KEY = "bloodconnect.location.v1";

export function useLocation() {
  const [location, setLocation] = useState<GeoPoint>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<LocationPermissionState>("prompt");
  const [isManual, setIsManual] = useState<boolean>(false);

  // Restore saved manual/detected location from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.isManual !== undefined) setIsManual(parsed.isManual);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Check browser geolocation permission
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setPermissionState("unsupported");
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setPermissionState(result.state as LocationPermissionState);
          result.onchange = () => {
            setPermissionState(result.state as LocationPermissionState);
          };
        })
        .catch(() => {
          /* ignore permission API query error */
        });
    }
  }, []);

  // Request high-accuracy current location via browser native API
  const requestLocation = useCallback(async (): Promise<GeoPoint | null> => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setPermissionState("unsupported");
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc: GeoPoint = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            district: "Pathanamthitta", // Default district context
            area: "Thiruvalla",
            address: `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`,
          };

          setLocation(newLoc);
          setIsManual(false);
          setLoading(false);
          setPermissionState("granted");

          try {
            localStorage.setItem(
              LOCATION_STORAGE_KEY,
              JSON.stringify({ location: newLoc, isManual: false })
            );
          } catch {
            /* ignore */
          }

          resolve(newLoc);
        },
        (err) => {
          setLoading(false);
          setPermissionState("denied");
          const errMsg =
            err.code === err.PERMISSION_DENIED
              ? "Location permission denied."
              : "Could not retrieve exact location.";
          setError(errMsg);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }, []);

  // Fallback manual location setter
  const setManualLocation = useCallback((district: District, area: string, address?: string) => {
    const coords = DISTRICT_COORDINATES[district] || DEFAULT_LOCATION;
    const manualLoc: GeoPoint = {
      lat: coords.lat,
      lng: coords.lng,
      district,
      area,
      address: address || `${area}, ${district}, Kerala`,
    };

    setLocation(manualLoc);
    setIsManual(true);
    setError(null);

    try {
      localStorage.setItem(
        LOCATION_STORAGE_KEY,
        JSON.stringify({ location: manualLoc, isManual: true })
      );
    } catch {
      /* ignore */
    }
  }, []);

  return {
    location,
    loading,
    error,
    permissionState,
    isManual,
    requestLocation,
    setManualLocation,
  };
}
