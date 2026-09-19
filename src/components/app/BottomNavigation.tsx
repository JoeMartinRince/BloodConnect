import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Search,
  Plus,
  Bell,
  User,
  HeartHandshake,
  History,
  LayoutDashboard,
  Boxes,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  primary?: boolean;
}

const SEEKER_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "find", label: "Find", icon: Search },
  { id: "request", label: "Request", icon: Plus, primary: true },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

const DONOR_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "requests", label: "Requests", icon: HeartHandshake, primary: true },
  { id: "history", label: "History", icon: History },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

const HOSPITAL_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Requests", icon: FileText, primary: true },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

interface RoleNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: RoleNavigationProps) {
  const { activeRole, unreadCount } = useAppStore();

  const items =
    activeRole === "hospital"
      ? HOSPITAL_ITEMS
      : activeRole === "donor"
      ? DONOR_ITEMS
      : SEEKER_ITEMS;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 lg:hidden" aria-label="Primary">
      <div className="mx-auto max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="grid grid-cols-5 items-end rounded-[28px] bg-card px-2 py-2 shadow-soft ring-1 ring-border/80 backdrop-blur-md">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id || (item.id === "dashboard" && activeTab === "home");

            if (item.primary) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className="flex flex-col items-center cursor-pointer"
                  aria-label={item.label}
                >
                  <span
                    className={cn(
                      "-mt-7 flex size-14 items-center justify-center rounded-full font-extrabold text-white shadow-glow ring-4 ring-background transition-transform active:scale-95 bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="size-6" strokeWidth={2.5} />
                  </span>
                  <span className="mt-1 text-[10px] font-bold text-primary">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "text-primary bg-primary-soft/60 font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-5 transition-transform group-active:scale-90" />
                <span className="text-[10px] font-bold">{item.label}</span>
                {item.id === "alerts" && unreadCount > 0 && (
                  <span className="absolute right-1 top-0.5 rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
