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

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { activeRole, user, notifications, unreadCount, markAllRead } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>("home");
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
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

      {/* Demo Mode Floating Toolbar */}
      <DemoModeToolbar onRunScenario={handleRunScenario} />

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
                {/* Role Switcher Pill */}
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
                        : "Hospital / Blood Bank"}
                    </strong>
                  </span>
                  <span className="text-[10px] text-primary font-bold ml-1">Switch</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <LocationSelector />

                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={() => setActiveTab("alerts")}
                  className="relative flex size-9 items-center justify-center rounded-2xl bg-card border text-muted-foreground hover:text-foreground shadow-sm"
                >
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
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
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} />
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
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} />
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
                    <AlertsTab notifications={notifications} onMarkRead={markAllRead} />
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

// Subcomponent for Alerts tab
function AlertsTab({
  notifications,
  onMarkRead,
}: {
  notifications: any[];
  onMarkRead: () => void;
}) {
  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div>
          <h1 className="text-xl font-black text-foreground">Notifications & Alerts</h1>
          <p className="text-xs text-muted-foreground">Real-time emergency updates & dispatch alerts.</p>
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
        {notifications.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl bg-card p-4 shadow-card border border-border/60 space-y-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                <Bell className="size-4 text-primary" />
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

// Subcomponent for Profile tab
function ProfileTab({ role }: { role: UserRole }) {
  const { user, setUserRole } = useAppStore();
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
          Active Role: {role === "seeker" ? "Blood Seeker" : role === "donor" ? "Blood Donor" : "Hospital / Blood Bank"}
        </div>

        <div className="pt-4 max-w-sm mx-auto space-y-2">
          <p className="text-xs font-bold text-muted-foreground">Switch Account Experience:</p>
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
      </div>
    </div>
  );
}
