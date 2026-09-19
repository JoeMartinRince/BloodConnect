import React, { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Donor } from "@/types";

interface Step7Props {
  donor: Donor;
  onProceedToConfirmed: () => void;
}

export function Step7Accept({ donor, onProceedToConfirmed }: Step7Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 25;
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onProceedToConfirmed();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [progress, onProceedToConfirmed]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="rounded-3xl bg-card p-5 shadow-card border border-border/60">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 7 of 9</span>
            <h1 className="text-xl font-extrabold text-foreground">Donor Accept Decision</h1>
            <p className="text-xs text-muted-foreground">{donor.name} has accepted the emergency blood request!</p>
          </div>
        </div>
      </div>

      {/* Acceptance Processing Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/20 p-8 shadow-glow border-2 border-emerald-500/40 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-glow animate-pop">
          <HeartHandshake className="size-10 animate-bounce" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-extrabold text-emerald-700 uppercase tracking-wide">
          <Sparkles className="size-3.5" />
          DECISION REGISTERED: REQUEST ACCEPTED
        </span>

        <h2 className="mt-3 text-2xl font-black text-foreground">
          Thank you, {donor.name}!
        </h2>

        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
          Unlocking direct communication channels and emergency hospital navigation...
        </p>

        {/* Progress indicator */}
        <div className="mt-6 max-w-xs mx-auto">
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-700">
            {progress < 100 ? "Confirming Donor Dispatch..." : "DONOR CONFIRMED!"}
          </p>
        </div>
      </div>

      {/* Manual Continue Button */}
      <Button
        onClick={onProceedToConfirmed}
        size="lg"
        className="w-full h-14 rounded-2xl font-extrabold text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow"
      >
        PROCEED TO DONOR CONFIRMED SCREEN
        <ArrowRight className="size-5 ml-2" />
      </Button>
    </div>
  );
}
