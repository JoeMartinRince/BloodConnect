import React from "react";
import { History, Heart, CheckCircle2, Award, Calendar, Building2 } from "lucide-react";
import { BloodGroupBadge } from "@/components/app/Badges";
import { useAppStore } from "@/hooks/useAppStore";

const MOCK_DONATION_HISTORY = [
  {
    id: "don-1",
    date: "12 Sep 2026",
    hospital: "District Blood Centre",
    bloodGroup: "O+" as const,
    units: 1,
    status: "Completed",
    peopleHelped: 1,
  },
  {
    id: "don-2",
    date: "02 May 2026",
    hospital: "Pushpagiri Medical College",
    bloodGroup: "O+" as const,
    units: 1,
    status: "Completed",
    peopleHelped: 1,
  },
  {
    id: "don-3",
    date: "11 Jan 2026",
    hospital: "Believers Church Medical College",
    bloodGroup: "O+" as const,
    units: 1,
    status: "Completed",
    peopleHelped: 1,
  },
  {
    id: "don-4",
    date: "20 Sep 2025",
    hospital: "Muthoot Medical Centre",
    bloodGroup: "O+" as const,
    units: 1,
    status: "Completed",
    peopleHelped: 1,
  },
  {
    id: "don-5",
    date: "05 May 2025",
    hospital: "Government General Hospital",
    bloodGroup: "O+" as const,
    units: 1,
    status: "Completed",
    peopleHelped: 1,
  },
];

export function DonorHistory() {
  const { user } = useAppStore();
  const totalHelped = MOCK_DONATION_HISTORY.reduce((acc, curr) => acc + curr.peopleHelped, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
              <History className="size-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Donor Record</span>
              <h1 className="text-xl font-extrabold text-foreground">Donation History & Impact</h1>
              <p className="text-xs text-muted-foreground">Your lifesaving contributions in Pathanamthitta.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">People Helped</span>
            <span className="text-xl font-black text-emerald-600">{totalHelped}</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60 space-y-3">
        <h2 className="text-sm font-extrabold text-foreground mb-2 flex items-center gap-2">
          <Award className="size-4 text-emerald-600" />
          Completed Donation Log ({MOCK_DONATION_HISTORY.length})
        </h2>

        <div className="space-y-3">
          {MOCK_DONATION_HISTORY.map((don) => (
            <div
              key={don.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/50 text-xs hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <BloodGroupBadge group={don.bloodGroup} size="md" />
                <div>
                  <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" />
                    {don.hospital}
                  </h3>
                  <p className="mt-0.5 text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" /> {don.date}
                    </span>
                    <span>·</span>
                    <span className="font-bold text-foreground">{don.units} Unit</span>
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  <CheckCircle2 className="size-3" /> {don.status}
                </span>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                  <Heart className="size-3 fill-current" /> +{don.peopleHelped} Person Helped
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
