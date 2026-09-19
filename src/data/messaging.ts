import type { AppNotification, Conversation, Message } from "@/types";

export const notifications: AppNotification[] = [
  { id: "n1", category: "emergency", title: "Emergency Blood Request", body: "O− blood is urgently needed 3.2 km from you.", time: "5 min ago", read: false, link: "/donor" },
  { id: "n2", category: "request", title: "Donation Accepted", body: "Your donor request for #1039 was accepted by Donor D177.", time: "1 hr ago", read: false, link: "/requests" },
  { id: "n3", category: "update", title: "Donation Reminder", body: "You may be eligible to donate again from 20 Sep.", time: "3 hr ago", read: false },
  { id: "n4", category: "request", title: "Request Sent", body: "Your request was sent to 3 compatible donors nearby.", time: "Yesterday", read: true, link: "/requests" },
  { id: "n5", category: "update", title: "District Blood Centre", body: "O− stock is low in Pathanamthitta. Donors welcome today.", time: "Yesterday", read: true, link: "/banks" },
  { id: "n6", category: "emergency", title: "Emergency Blood Request", body: "B− needed at Kottarakkara Taluk Hospital, 14.5 km away.", time: "2 days ago", read: true },
  { id: "n7", category: "update", title: "Profile Verified", body: "Your donor profile is now verified. Thank you for joining!", time: "5 days ago", read: true },
];

export const conversations: Conversation[] = [
  { id: "c1", name: "Donor D102", role: "Donor · O+", bloodGroup: "O+", lastMessage: "I can reach BCMCH in 20 minutes.", time: "2 min", unread: 2 },
  { id: "c2", name: "District Blood Centre", role: "Blood bank", lastMessage: "Please bring a valid ID for the donation.", time: "1 hr", unread: 0 },
  { id: "c3", name: "Requester #1041", role: "Requester", bloodGroup: "A+", lastMessage: "Thank you so much for responding 🙏", time: "3 hr", unread: 0 },
  { id: "c4", name: "Donor D011", role: "Donor · O−", bloodGroup: "O-", lastMessage: "Is the request still open?", time: "Yesterday", unread: 1 },
];

export const messages: Message[] = [
  { id: "m1", conversationId: "c1", from: "them", text: "Hi, I saw your O+ emergency request. I'm available now.", time: "9:31" },
  { id: "m2", conversationId: "c1", from: "me", text: "Thank you! The patient is at Believers Church Medical College, emergency wing.", time: "9:32" },
  { id: "m3", conversationId: "c1", from: "them", text: "Got it. Starting from Thiruvalla now.", time: "9:33" },
  { id: "m4", conversationId: "c1", from: "them", text: "I can reach BCMCH in 20 minutes.", time: "9:34" },
  { id: "m5", conversationId: "c2", from: "them", text: "Your donation slot is confirmed for 10:30 AM today.", time: "8:02" },
  { id: "m6", conversationId: "c2", from: "me", text: "Great, I'll be there.", time: "8:05" },
  { id: "m7", conversationId: "c2", from: "them", text: "Please bring a valid ID for the donation.", time: "8:06" },
  { id: "m8", conversationId: "c3", from: "me", text: "I've accepted your A+ request. On my way.", time: "Yesterday" },
  { id: "m9", conversationId: "c3", from: "them", text: "Thank you so much for responding 🙏", time: "Yesterday" },
  { id: "m10", conversationId: "c4", from: "them", text: "Is the request still open?", time: "Yesterday" },
];
