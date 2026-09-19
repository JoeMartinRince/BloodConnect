import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bloodRequests as seedRequests } from "@/data/requests";
import { notifications as seedNotifications } from "@/data/messaging";
import { donors as seedDonors } from "@/data/donors";
import { bloodBanks as seedFacilities } from "@/data/facilities";
import { createBloodRequest as apiCreateRequest, sendDonorRequest as apiSendDonorRequest } from "@/services/api";
import type {
  AppNotification,
  Availability,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Donor,
  DonorRequestState,
  HospitalRequest,
  InventoryBatch,
  NewRequestInput,
  Urgency,
  UserProfile,
  UserRole,
} from "@/types";

// Initial blood inventory seed for District Blood Centre
const INITIAL_INVENTORY: Record<BloodGroup, BloodInventoryItem> = {
  "A+": {
    bloodGroup: "A+",
    availableUnits: 12,
    reservedUnits: 2,
    issuedTodayUnits: 4,
    expiringSoonUnits: 1,
    batches: [
      { id: "b-a1", bloodGroup: "A+", units: 10, collectionDate: "2026-09-01", expiryDate: "2026-10-15", status: "safe" },
      { id: "b-a2", bloodGroup: "A+", units: 2, collectionDate: "2026-08-15", expiryDate: "2026-09-23", status: "expiring_soon" },
    ],
  },
  "A-": {
    bloodGroup: "A-",
    availableUnits: 3,
    reservedUnits: 0,
    issuedTodayUnits: 1,
    expiringSoonUnits: 0,
    batches: [{ id: "b-a3", bloodGroup: "A-", units: 3, collectionDate: "2026-09-05", expiryDate: "2026-10-20", status: "safe" }],
  },
  "B+": {
    bloodGroup: "B+",
    availableUnits: 18,
    reservedUnits: 3,
    issuedTodayUnits: 6,
    expiringSoonUnits: 2,
    batches: [{ id: "b-b1", bloodGroup: "B+", units: 18, collectionDate: "2026-09-02", expiryDate: "2026-10-17", status: "safe" }],
  },
  "B-": {
    bloodGroup: "B-",
    availableUnits: 2,
    reservedUnits: 0,
    issuedTodayUnits: 0,
    expiringSoonUnits: 0,
    batches: [{ id: "b-b2", bloodGroup: "B-", units: 2, collectionDate: "2026-09-10", expiryDate: "2026-10-25", status: "safe" }],
  },
  "AB+": {
    bloodGroup: "AB+",
    availableUnits: 7,
    reservedUnits: 1,
    issuedTodayUnits: 2,
    expiringSoonUnits: 0,
    batches: [{ id: "b-ab1", bloodGroup: "AB+", units: 7, collectionDate: "2026-09-04", expiryDate: "2026-10-19", status: "safe" }],
  },
  "AB-": {
    bloodGroup: "AB-",
    availableUnits: 1,
    reservedUnits: 0,
    issuedTodayUnits: 0,
    expiringSoonUnits: 1,
    batches: [{ id: "b-ab2", bloodGroup: "AB-", units: 1, collectionDate: "2026-08-18", expiryDate: "2026-09-24", status: "expiring_soon" }],
  },
  "O+": {
    bloodGroup: "O+",
    availableUnits: 15,
    reservedUnits: 3,
    issuedTodayUnits: 8,
    expiringSoonUnits: 2,
    batches: [
      { id: "b-o1", bloodGroup: "O+", units: 13, collectionDate: "2026-09-08", expiryDate: "2026-10-23", status: "safe" },
      { id: "b-o2", bloodGroup: "O+", units: 2, collectionDate: "2026-08-16", expiryDate: "2026-09-22", status: "expiring_soon" },
    ],
  },
  "O-": {
    bloodGroup: "O-",
    availableUnits: 2,
    reservedUnits: 1,
    issuedTodayUnits: 2,
    expiringSoonUnits: 0,
    batches: [{ id: "b-o3", bloodGroup: "O-", units: 2, collectionDate: "2026-09-06", expiryDate: "2026-10-21", status: "safe" }],
  },
};

// Seed hospital requests for Pushpagiri Medical College Hospital
const INITIAL_HOSPITAL_REQUESTS: HospitalRequest[] = [
  {
    id: "HR-1042",
    patientId: "PAT-8821",
    bloodGroup: "O+",
    unitsNeeded: 3,
    internalInventoryUsed: 1,
    bloodBankUnitsReserved: 1,
    donorUnitsRequested: 1,
    urgency: "critical",
    requiredBy: "2026-09-19T23:00:00Z",
    location: "Pushpagiri Medical College, Thiruvalla",
    status: "DONORS_NOTIFIED",
    createdAt: new Date().toISOString(),
    notifiedDonorsCount: 5,
    confirmedDonors: [
      {
        donorId: "D177",
        donorName: "Arun Kumar",
        bloodGroup: "O+",
        distanceKm: 7.8,
        phone: "+91 98765 43210",
        status: "confirmed",
      },
    ],
  },
  {
    id: "HR-1043",
    patientId: "PAT-9412",
    bloodGroup: "A-",
    unitsNeeded: 2,
    internalInventoryUsed: 0,
    bloodBankUnitsReserved: 0,
    donorUnitsRequested: 2,
    urgency: "urgent",
    requiredBy: "2026-09-20T04:00:00Z",
    location: "Pushpagiri Medical College, Thiruvalla",
    status: "SEARCHING",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    notifiedDonorsCount: 3,
    confirmedDonors: [],
  },
];

interface PersistedState {
  user: UserProfile | null;
  onboarded: boolean;
  activeRole: UserRole;
  createdRequests: BloodRequest[];
  donorStates: Record<string, Record<string, DonorRequestState>>;
  donorAvailable: boolean;
  donorAvailabilityState: Availability;
  unavailableUntilDate?: string;
  readNotifications: string[];
  extraNotifications: AppNotification[];
  handledIncoming: Record<string, "accepted" | "declined">;
  inventory: Record<BloodGroup, BloodInventoryItem>;
  hospitalRequests: HospitalRequest[];
  demoMode: boolean;
}

const initial: PersistedState = {
  user: null,
  onboarded: false,
  activeRole: "seeker",
  createdRequests: [],
  donorStates: {},
  donorAvailable: true,
  donorAvailabilityState: "available",
  readNotifications: [],
  extraNotifications: [],
  handledIncoming: {},
  inventory: INITIAL_INVENTORY,
  hospitalRequests: INITIAL_HOSPITAL_REQUESTS,
  demoMode: true,
};

const STORAGE_KEY = "bloodconnect.state.v2";

interface Store extends PersistedState {
  hydrated: boolean;
  requests: BloodRequest[];
  notifications: AppNotification[];
  unreadCount: number;
  setUserRole: (role: UserRole) => void;
  signIn: (partial?: Partial<UserProfile>) => void;
  signOut: () => void;
  completeOnboarding: () => void;
  createRequest: (input: NewRequestInput) => Promise<BloodRequest>;
  getRequest: (id: string) => BloodRequest | undefined;
  getDonorState: (requestId: string, donorId: string) => DonorRequestState;
  sendDonorRequest: (requestId: string, donorId: string) => Promise<void>;
  setDonorState: (requestId: string, donorId: string, state: DonorRequestState) => void;
  setDonorAvailable: (v: boolean) => void;
  setDonorAvailabilityState: (status: Availability, untilDate?: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  handleIncoming: (requestId: string, decision: "accepted" | "declined") => void;
  updateInventory: (bloodGroup: BloodGroup, deltaAvailable: number, deltaReserved?: number) => void;
  addInventoryBatch: (bloodGroup: BloodGroup, units: number, collectionDate: string, expiryDate: string) => void;
  createHospitalRequest: (input: {
    patientId: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    urgency: Urgency;
    requiredBy: string;
    location: string;
  }) => HospitalRequest;
  reserveInternalStock: (requestId: string, units: number) => void;
  acceptDonorRequestForHospital: (requestId: string, donor: Donor) => void;
  setDemoMode: (active: boolean) => void;
}

const StoreContext = createContext<Store | null>(null);

export const DEFAULT_USER: UserProfile = {
  id: "u1",
  name: "Alex Mathew",
  email: "alex@example.com",
  bloodGroup: "O+",
  district: "Pathanamthitta",
  role: "seeker",
  donations: 5,
  requests: 3,
  monthsActive: 6,
  hospitalName: "Pushpagiri Medical College Hospital",
  facilityId: "HOSP-1024",
  donorAvailability: "available",
};

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as PersistedState) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);

    // Hydrate Supabase Session
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          import("@/services/supabaseService").then(({ fetchProfile }) => {
            fetchProfile(session.user.id).then((profile) => {
              if (profile) {
                setState((s) => ({
                  ...s,
                  user: profile,
                  activeRole: profile.role || s.activeRole,
                }));
              }
            });
          });
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          import("@/services/supabaseService").then(({ fetchProfile }) => {
            fetchProfile(session.user.id).then((profile) => {
              if (profile) {
                setState((s) => ({
                  ...s,
                  user: profile,
                  activeRole: profile.role || s.activeRole,
                }));
              }
            });
          });
        } else {
          setState((s) => ({ ...s, user: null }));
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const patch = useCallback(
    (p: Partial<PersistedState> | ((s: PersistedState) => Partial<PersistedState>)) => {
      setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }));
    },
    []
  );

  const requests = useMemo(
    () => [...state.createdRequests, ...seedRequests],
    [state.createdRequests]
  );

  const notifications = useMemo<AppNotification[]>(
    () =>
      [...state.extraNotifications, ...seedNotifications].map((n) => ({
        ...n,
        read: n.read || state.readNotifications.includes(n.id),
      })),
    [state.extraNotifications, state.readNotifications]
  );

  const setUserRole = useCallback(
    (role: UserRole) => {
      patch((s) => ({
        activeRole: role,
        user: s.user ? { ...s.user, role } : { ...DEFAULT_USER, role },
      }));
    },
    [patch]
  );

  const setDonorAvailabilityState = useCallback(
    (status: Availability, untilDate?: string) => {
      patch({
        donorAvailabilityState: status,
        donorAvailable: status === "available",
        unavailableUntilDate: untilDate,
      });
    },
    [patch]
  );

  const updateInventory = useCallback(
    (bloodGroup: BloodGroup, deltaAvailable: number, deltaReserved: number = 0) => {
      patch((s) => {
        const item = s.inventory[bloodGroup] || {
          bloodGroup,
          availableUnits: 0,
          reservedUnits: 0,
          issuedTodayUnits: 0,
          expiringSoonUnits: 0,
          batches: [],
        };
        const newAvailable = Math.max(0, item.availableUnits + deltaAvailable);
        const newReserved = Math.max(0, item.reservedUnits + deltaReserved);

        return {
          inventory: {
            ...s.inventory,
            [bloodGroup]: {
              ...item,
              availableUnits: newAvailable,
              reservedUnits: newReserved,
            },
          },
        };
      });
    },
    [patch]
  );

  const addInventoryBatch = useCallback(
    (bloodGroup: BloodGroup, units: number, collectionDate: string, expiryDate: string) => {
      patch((s) => {
        const item = s.inventory[bloodGroup];
        const newBatch: InventoryBatch = {
          id: `batch-${Date.now()}`,
          bloodGroup,
          units,
          collectionDate,
          expiryDate,
          status: "safe",
        };
        return {
          inventory: {
            ...s.inventory,
            [bloodGroup]: {
              ...item,
              availableUnits: item.availableUnits + units,
              batches: [newBatch, ...item.batches],
            },
          },
        };
      });
    },
    [patch]
  );

  const createHospitalRequest = useCallback(
    (input: {
      patientId: string;
      bloodGroup: BloodGroup;
      unitsNeeded: number;
      urgency: Urgency;
      requiredBy: string;
      location: string;
    }): HospitalRequest => {
      const internalAvailable = state.inventory[input.bloodGroup]?.availableUnits || 0;
      const internalUsed = Math.min(internalAvailable, input.unitsNeeded);
      const donorNeeded = Math.max(0, input.unitsNeeded - internalUsed);

      const newReq: HospitalRequest = {
        id: `hr-${Date.now().toString().slice(-4)}`,
        patientId: input.patientId,
        bloodGroup: input.bloodGroup,
        unitsNeeded: input.unitsNeeded,
        internalInventoryUsed: internalUsed,
        bloodBankUnitsReserved: 0,
        donorUnitsRequested: donorNeeded,
        urgency: input.urgency,
        requiredBy: input.requiredBy,
        location: input.location,
        status: donorNeeded === 0 ? "HOSPITAL_CONFIRMED" : "DONORS_NOTIFIED",
        createdAt: new Date().toISOString(),
        notifiedDonorsCount: donorNeeded > 0 ? 5 : 0,
        confirmedDonors: [],
      };

      patch((s) => ({
        hospitalRequests: [newReq, ...s.hospitalRequests],
      }));

      // Automatically reserve internal units if available
      if (internalUsed > 0) {
        updateInventory(input.bloodGroup, -internalUsed, internalUsed);
      }

      return newReq;
    },
    [state.inventory, patch, updateInventory]
  );

  const reserveInternalStock = useCallback(
    (requestId: string, units: number) => {
      patch((s) => {
        const req = s.hospitalRequests.find((r) => r.id === requestId);
        if (!req) return s;
        updateInventory(req.bloodGroup, -units, units);
        return {
          hospitalRequests: s.hospitalRequests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  internalInventoryUsed: r.internalInventoryUsed + units,
                  donorUnitsRequested: Math.max(0, r.donorUnitsRequested - units),
                }
              : r
          ),
        };
      });
    },
    [patch, updateInventory]
  );

  const acceptDonorRequestForHospital = useCallback(
    (requestId: string, donor: Donor) => {
      patch((s) => ({
        hospitalRequests: s.hospitalRequests.map((r) => {
          if (r.id !== requestId) return r;
          const exists = r.confirmedDonors.some((cd) => cd.donorId === donor.id);
          if (exists) return r;
          const newConfirmed = [
            ...r.confirmedDonors,
            {
              donorId: donor.id,
              donorName: donor.name,
              bloodGroup: donor.bloodGroup,
              distanceKm: donor.distanceKm,
              phone: "+91 98765 43210",
              status: "confirmed" as const,
            },
          ];
          const isFulfilled =
            r.internalInventoryUsed + newConfirmed.length >= r.unitsNeeded;
          return {
            ...r,
            confirmedDonors: newConfirmed,
            status: isFulfilled ? "COMPLETED" : "DONOR_ACCEPTED",
          };
        }),
      }));
    },
    [patch]
  );

  const value: Store = {
    ...state,
    hydrated,
    requests,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    setUserRole,
    signIn: (partial) =>
      patch((s) => ({
        user: { ...DEFAULT_USER, ...(s.user || {}), ...partial },
        activeRole: partial?.role || s.activeRole || "seeker",
        onboarded: true,
      })),
    signOut: () => patch({ user: null }),
    completeOnboarding: () => patch({ onboarded: true }),
    createRequest: async (input) => {
      const req = await apiCreateRequest(input);
      patch((s) => ({ createdRequests: [req, ...s.createdRequests] }));
      return req;
    },
    getRequest: (id) => requests.find((r) => r.id === id),
    getDonorState: (requestId, donorId) => state.donorStates[requestId]?.[donorId] ?? "none",
    setDonorState: (requestId, donorId, st) =>
      patch((s) => ({
        donorStates: {
          ...s.donorStates,
          [requestId]: { ...(s.donorStates[requestId] ?? {}), [donorId]: st },
        },
      })),
    sendDonorRequest: async (requestId, donorId) => {
      await apiSendDonorRequest(requestId, donorId);
      patch((s) => ({
        donorStates: {
          ...s.donorStates,
          [requestId]: { ...(s.donorStates[requestId] ?? {}), [donorId]: "sent" },
        },
      }));
    },
    setDonorAvailable: (v) =>
      patch({ donorAvailable: v, donorAvailabilityState: v ? "available" : "unavailable" }),
    setDonorAvailabilityState,
    markRead: (id) =>
      patch((s) => ({ readNotifications: [...new Set([...s.readNotifications, id])] })),
    markAllRead: () => patch({ readNotifications: notifications.map((n) => n.id) }),
    pushNotification: (n) =>
      patch((s) => ({
        extraNotifications: [
          { ...n, id: `n-${Date.now()}`, time: "Just now", read: false },
          ...s.extraNotifications,
        ],
      })),
    handleIncoming: (requestId, decision) =>
      patch((s) => ({ handledIncoming: { ...s.handledIncoming, [requestId]: decision } })),
    updateInventory,
    addInventoryBatch,
    createHospitalRequest,
    reserveInternalStock,
    acceptDonorRequestForHospital,
    setDemoMode: (active) => patch({ demoMode: active }),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
