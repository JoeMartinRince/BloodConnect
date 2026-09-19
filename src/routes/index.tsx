import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wordmark } from "@/components/app/Logo";
import { SideNavigation } from "@/components/app/SideNavigation";
import { BottomNavigation } from "@/components/app/BottomNavigation";
import { RoleSelectionModal } from "@/components/app/RoleSelectionModal";
import { DemoModeToolbar } from "@/components/app/DemoModeToolbar";
import { LocationSelector } from "@/components/app/LocationSelector";
import { BloodFlowController } from "@/components/app/flow/BloodFlowController";
import { SeekerHome } from "@/components/app/SeekerHome";
import { DonorHome } from "@/components/app/DonorHome";
import { DonorHistory } from "@/components/app/DonorHistory";
import { HospitalDashboard } from "@/components/app/HospitalDashboard";
import { HospitalInventory } from "@/components/app/HospitalInventory";
import { HospitalRequests } from "@/components/app/HospitalRequests";
import { BloodAvailabilityScreen } from "@/components/app/BloodAvailabilityScreen";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/hooks/useAppStore";
import { Heart, Activity, User, Bell, Sparkles } from "lucide-react";
import type { BloodGroup, UserRole } from "@/types";

import { AuthScreen } from "@/components/app/AuthScreen";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { activeRole, user, notifications, unreadCount, markAllRead, demoMode } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>("home");
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [flowActive, setFlowActive] = useState<boolean>(false);

  const handleStartCreateRequest = (prefillGroup?: BloodGroup) => {
    setFlowActive(true);
    setActiveTab("flow");
  };

  const handleRunScenario = (scenarioId: string) => {
    if (scenarioId === "patient_request") {
      setFlowActive(true);
      setActiveTab("flow");
    } else if (scenarioId === "hospital_shortage") {
      setFlowActive(false);
      setActiveTab("requests");
    } else if (scenarioId === "donor_accept") {
      setFlowActive(false);
      setActiveTab("requests");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Role Selection Modal */}
      <RoleSelectionModal open={roleModalOpen} onOpenChange={setRoleModalOpen} />

      {/* Real Supabase Auth Screen */}
      <AuthScreen open={authOpen} onOpenChange={setAuthOpen} />

      {/* Demo Mode Floating Toolbar (Only visible when demoMode is true) */}
      {demoMode && <DemoModeToolbar onRunScenario={handleRunScenario} />}

      <div className="flex flex-1">
        {/* Desktop Side Navigation */}
        <SideNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === "request") {
              handleStartCreateRequest();
            } else {
              setFlowActive(false);
              setActiveTab(tab);
            }
          }}
          onOpenRoleModal={() => setRoleModalOpen(true)}
        />

        {/* Main App Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Navigation */}
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md px-4 sm:px-8 py-3 shadow-sm">
            <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Wordmark />
                {/* Role Switcher Pill - Only visible in Demo Mode */}
                {demoMode && (
                  <button
                    type="button"
                    onClick={() => setRoleModalOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
                  >
                    <span
                      className={`size-2 rounded-full ${
                        activeRole === "hospital"
                          ? "bg-indigo-600"
                          : activeRole === "donor"
                          ? "bg-emerald-600"
                          : "bg-critical"
                      }`}
                    />
                    <span>
                      Role:{" "}
                      <strong className="capitalize">
                        {activeRole === "seeker"
                          ? "Blood Seeker"
                          : activeRole === "donor"
                          ? "Blood Donor"
                          : "Hospital"}
                      </strong>
                    </span>
                    <span className="text-[10px] text-primary font-bold ml-1">Switch</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <LocationSelector />

                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={() => setActiveTab("alerts")}
                  className="relative flex size-9 items-center justify-center rounded-2xl bg-card border text-muted-foreground hover:text-foreground shadow-sm shrink-0"
                >
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Supabase Account Button */}
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-1.5 rounded-2xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-primary/20 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <User className="size-3.5" />
                  <span className="truncate max-w-[80px]">
                    {user ? user.name.split(" ")[0] : "Sign In"}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Body Content */}
          <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 safe-bottom">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* If Flow Active or user navigated to flow */}
              {flowActive || activeTab === "flow" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFlowActive(false)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      ← Back to {activeRole.toUpperCase()} Dashboard
                    </button>
                    <span className="text-xs font-extrabold text-muted-foreground">
                      9-Step Dispatch Engine
                    </span>
                  </div>
                  <BloodFlowController />
                </div>
              ) : activeRole === "seeker" ? (
                /* SEEKER EXPERIENCE */
                <>
                  {(activeTab === "home" || activeTab === "request") && (
                    <SeekerHome
                      onStartCreateRequest={handleStartCreateRequest}
                      onSelectTab={(tab) => setActiveTab(tab)}
                    />
                  )}
                  {activeTab === "find" && <BloodAvailabilityScreen />}
                  {activeTab === "requests" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-black text-foreground">Your Blood Requests</h1>
                        <button
                          type="button"
                          onClick={() => handleStartCreateRequest()}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          + Create Request
                        </button>
                      </div>
                      <BloodFlowController />
                    </div>
                  )}
                  {activeTab === "alerts" && (
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} role="seeker" />
                  )}
                  {activeTab === "profile" && <ProfileTab role="seeker" />}
                </>
              ) : activeRole === "donor" ? (
                /* DONOR EXPERIENCE */
                <>
                  {activeTab === "home" && <DonorHome />}
                  {activeTab === "requests" && <DonorHome />}
                  {activeTab === "history" && <DonorHistory />}
                  {activeTab === "alerts" && (
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} role="donor" />
                  )}
                  {activeTab === "profile" && <ProfileTab role="donor" />}
                </>
              ) : (
                /* HOSPITAL EXPERIENCE */
                <>
                  {activeTab === "dashboard" || activeTab === "home" ? (
                    <HospitalDashboard
                      onSelectTab={(tab) => setActiveTab(tab)}
                      onStartSupplyRequest={() => setActiveTab("requests")}
                    />
                  ) : null}
                  {activeTab === "inventory" && <HospitalInventory />}
                  {activeTab === "requests" && <HospitalRequests />}
                  {activeTab === "alerts" && (
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} role="hospital" />
                  )}
                  {activeTab === "profile" && <ProfileTab role="hospital" />}
                </>
              )}
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === "request") {
                handleStartCreateRequest();
              } else {
                setFlowActive(false);
                setActiveTab(tab);
              }
            }}
          />

          {/* Footer */}
          <footer className="border-t border-border/60 bg-card py-6 px-4 text-center text-xs text-muted-foreground hidden lg:block">
            <div className="mx-auto max-w-4xl flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <Activity className="size-4 text-primary" />
                <span>BloodConnect Multi-Role District Blood Platform · Pathanamthitta Hub</span>
              </div>
              <p>© 2026 BloodConnect. Medical Disclaimer Appended.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for Alerts tab (Tailored for Hospital vs Donor)
function AlertsTab({
  notifications,
  onMarkRead,
  role,
}: {
  notifications: any[];
  onMarkRead: () => void;
  role: UserRole;
}) {
  const hospitalNotifications = [
    {
      id: "hn1",
      title: "🚨 Emergency Blood Request",
      body: "3 units O+ required for Patient PAT-8821 at Pushpagiri Medical Centre.",
      time: "10 min ago",
      icon: "critical",
    },
    {
      id: "hn2",
      title: "✓ Donor Accepted",
      body: "Donor D177 (Arun Kumar) accepted your O+ emergency request #HR-1042.",
      time: "25 min ago",
      icon: "success",
    },
    {
      id: "hn3",
      title: "⚠ Low Inventory Alert",
      body: "B− stock is below minimum threshold (2 units remaining).",
      time: "2 hrs ago",
      icon: "warning",
    },
    {
      id: "hn4",
      title: "⚠ Expiry Alert",
      body: "2 O+ units expire in 3 days (Batch #b-o2).",
      time: "5 hrs ago",
      icon: "warning",
    },
    {
      id: "hn5",
      title: "✓ Request Fulfilled",
      body: "Emergency Request #HR-1042 completed: 3/3 units secured.",
      time: "Yesterday",
      icon: "success",
    },
  ];

  const displayList = role === "hospital" ? hospitalNotifications : notifications.filter(n => !n.body.includes("eligible to donate"));

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div>
          <h1 className="text-xl font-black text-foreground">
            {role === "hospital" ? "Hospital Operational Alerts" : "Notifications & Alerts"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {role === "hospital"
              ? "Real-time supply chain alerts, donor acceptances & inventory expiry notifications."
              : "Real-time emergency updates & dispatch alerts."}
          </p>
        </div>
        <button
          type="button"
          onClick={onMarkRead}
          className="text-xs font-bold text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-2.5">
        {displayList.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl bg-card p-4 shadow-card border border-border/60 space-y-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                <Bell className="size-4 text-indigo-600" />
                {n.title}
              </h3>
              <span className="text-[11px] text-muted-foreground">{n.time}</span>
            </div>
            <p className="text-xs text-muted-foreground">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Subcomponent for Profile tab (Tailored for Hospital Administrator)
function ProfileTab({ role }: { role: UserRole }) {
  const { user, setUserRole, demoMode } = useAppStore();

  if (role === "hospital") {
    return (
      <div className="space-y-4 animate-fade-up">
        {/* Hospital Administrator Profile Card */}
        <div className="rounded-3xl bg-card p-6 shadow-card border border-border/60 text-center space-y-3">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 font-black text-2xl border-2 border-indigo-500/30">
            AM
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Alex Mathew</h1>
            <p className="text-xs font-extrabold text-indigo-600">Hospital Administrator</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pushpagiri Medical College Hospital</p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 font-bold text-indigo-700 border border-indigo-500/30">
              Hospital ID: HOSP-1024
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-700 border border-emerald-500/30">
              🟢 Demo Verified Hospital
            </span>
          </div>

          <p className="text-xs text-muted-foreground">Thiruvalla, Pathanamthitta · District Hub</p>

          {/* Role switching option only when DEMO MODE = ON */}
          {demoMode && (
            <div className="pt-4 max-w-sm mx-auto space-y-2 border-t border-border/60 mt-4">
              <p className="text-xs font-bold text-muted-foreground">Demo Mode Role Switcher:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUserRole("seeker")}
                  className={`p-2 rounded-xl font-bold border ${role === "seeker" ? "bg-critical text-white" : "bg-card"}`}
                >
                  Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("donor")}
                  className={`p-2 rounded-xl font-bold border ${role === "donor" ? "bg-emerald-600 text-white" : "bg-card"}`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("hospital")}
                  className={`p-2 rounded-xl font-bold border ${role === "hospital" ? "bg-indigo-600 text-white" : "bg-card"}`}
                >
                  Hospital
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hospital Administrator Settings & Governance List */}
        <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Hospital Operations & Governance Settings
          </h2>

          <div className="space-y-2 text-xs font-bold">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <span>Hospital Details</span>
              <span className="text-muted-foreground font-normal">Pushpagiri Medical College · License #KER-1094</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <span>Staff & Permissions</span>
              <span className="text-muted-foreground font-normal">2 Administrators · 5 Medical Officers</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <span>Emergency Dispatch Notifications</span>
              <span className="text-emerald-600">Active (SMS + Push)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <span>Hospital Operating Location</span>
              <span className="text-muted-foreground font-normal">Thiruvalla, Pathanamthitta</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between">
              <span>Privacy & Medical Compliance</span>
              <span className="text-emerald-600">HIPAA & NABH Standard Verified</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="rounded-3xl bg-card p-6 shadow-card border border-border/60 text-center space-y-3">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary font-black text-2xl">
          {user?.name?.slice(0, 2).toUpperCase() || "AL"}
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">{user?.name || "Alex Mathew"}</h1>
          <p className="text-xs text-muted-foreground">{user?.email || "alex@example.com"}</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary border border-primary/20 capitalize">
          Active Role: {role === "seeker" ? "Blood Seeker" : "Blood Donor"}
        </div>

        {demoMode && (
          <div className="pt-4 max-w-sm mx-auto space-y-2">
            <p className="text-xs font-bold text-muted-foreground">Demo Mode Role Switcher:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUserRole("seeker")}
                className={`p-2 rounded-xl font-bold border ${role === "seeker" ? "bg-critical text-white" : "bg-card"}`}
              >
                Seeker
              </button>
              <button
                type="button"
                onClick={() => setUserRole("donor")}
                className={`p-2 rounded-xl font-bold border ${role === "donor" ? "bg-emerald-600 text-white" : "bg-card"}`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => setUserRole("hospital")}
                className={`p-2 rounded-xl font-bold border ${role === "hospital" ? "bg-indigo-600 text-white" : "bg-card"}`}
              >
                Hospital
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
