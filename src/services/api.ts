/**
 * Mock service layer. Every function returns a Promise so the UI is already
 * written against an async contract; swap the bodies for Supabase queries
 * later without touching components.
 */
import { donors } from "@/data/donors";
import { bloodRequests } from "@/data/requests";
import { bloodBanks, hospitals } from "@/data/facilities";
import { conversations, messages, notifications } from "@/data/messaging";
import { rankDonors } from "@/utils/matching";
import type {
  AppNotification,
  BloodBank,
  BloodRequest,
  Conversation,
  Donor,
  Hospital,
  Match,
  Message,
  NewRequestInput,
} from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getDonors(): Promise<Donor[]> {
  await delay(500);
  return donors;
}

export async function getDonor(id: string): Promise<Donor | undefined> {
  await delay(200);
  return donors.find((d) => d.id === id);
}

export async function getBloodRequests(): Promise<BloodRequest[]> {
  await delay(400);
  return bloodRequests;
}

export async function getBloodBanks(): Promise<BloodBank[]> {
  await delay(450);
  return bloodBanks;
}

export async function getHospitals(): Promise<Hospital[]> {
  await delay(300);
  return hospitals;
}

export async function getNotifications(): Promise<AppNotification[]> {
  await delay(350);
  return notifications;
}

export async function getConversations(): Promise<Conversation[]> {
  await delay(300);
  return conversations;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay(250);
  return messages.filter((m) => m.conversationId === conversationId);
}

let counter = 1043;
export async function createBloodRequest(input: NewRequestInput): Promise<BloodRequest> {
  await delay(400);
  const code = String(counter++);
  return {
    id: `r${code}`,
    code,
    ...input,
    requesterName: "You",
    createdAt: new Date().toISOString(),
    status: "active",
    distanceKm: 0,
    position: { x: 50, y: 50 },
  };
}

export async function findCompatibleDonors(request: BloodRequest | NewRequestInput): Promise<Match[]> {
  await delay(600);
  return rankDonors(request, donors);
}

export async function sendDonorRequest(_requestId: string, _donorId: string): Promise<{ ok: true }> {
  await delay(700);
  return { ok: true };
}
