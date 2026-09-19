import React from "react";
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
  Building2,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { Wordmark } from "./Logo";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface SideNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenRoleModal: () => void;
}

export function SideNavigation({ activeTab, onTabChange, onOpenRoleModal }: SideNavProps) {
  const { activeRole, unreadCount } = useAppStore();

  const seekerItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "find", label: "Find Donors & Banks", icon: Search },
    { id: "requests", label: "Blood Requests", icon: FileText },
    { id: "alerts", label: "Notifications", icon: Bell },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const donorItems = [
    { id: "home", label: "Donor Home", icon: Home },
    { id: "requests", label: "Emergency Alerts", icon: HeartHandshake },
    { id: "history", label: "Donation History", icon: History },
    { id: "alerts", label: "Notifications", icon: Bell },
    { id: "profile", label: "My Profile", icon: User },
  ];

  const hospitalItems = [
    { id: "dashboard", label: "Hospital Dashboard", icon: LayoutDashboard },
    { id: "requests", label: "Supply Chain Requests", icon: FileText },
    { id: "inventory", label: "Blood Inventory", icon: Boxes },
    { id: "alerts", label: "Emergency Alerts", icon: Bell },
    { id: "profile", label: "Hospital Profile", icon: User },
  ];

  const items =
    activeRole === "hospital"
      ? hospitalItems
      : activeRole === "donor"
      ? donorItems
      : seekerItems;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/60 px-4 py-6 lg:flex backdrop-blur-md">
      <Wordmark className="px-2" />

      {/* Role Badge & Switcher CTA */}
      <div className="mt-4 rounded-2xl bg-muted/70 p-3 border border-border/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Role</span>
          <span className="text-xs font-black text-foreground capitalize flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {activeRole === "seeker"
              ? "Blood Seeker"
              : activeRole === "donor"
              ? "Blood Donor"
              : "Hospital Staff"}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenRoleModal}
          className="rounded-xl bg-card px-2.5 py-1 text-[11px] font-bold text-primary border shadow-sm hover:bg-muted"
        >
          Switch
        </button>
      </div>

      <Button
        onClick={() => onTabChange("request")}
        className="mt-4 font-extrabold h-11 rounded-2xl shadow-glow text-white bg-primary hover:bg-secondary"
      >
        <Plus className="size-4 mr-1.5" />
        {activeRole === "hospital"
          ? "Create Supply Request"
          : activeRole === "donor"
          ? "View Emergency Requests"
          : "Create Blood Request"}
      </Button>

      <nav className="mt-6 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all text-left cursor-pointer",
                isActive
                  ? "bg-primary-soft text-primary font-bold shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === "alerts" && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2 space-y-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          BloodConnect Multi-Role District Platform · Medical Disclaimer Appended.
        </p>
      </div>
    </aside>
  );
}
