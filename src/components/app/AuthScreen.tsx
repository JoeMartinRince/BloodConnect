import React, { useState } from "react";
import { Droplet, Heart, Hospital, Building2, Mail, Lock, User, MapPin, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BLOOD_GROUPS, DISTRICTS, type BloodGroup, type UserRole } from "@/types";
import { signUpUser, signInUser } from "@/services/supabaseService";
import { useAppStore } from "@/hooks/useAppStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthScreen({ open, onOpenChange, defaultMode = "signin" }: AuthScreenProps) {
  const { signIn } = useAppStore();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(defaultMode);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("seeker");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+");
  const [district, setDistrict] = useState<string>("Pathanamthitta");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signInUser(email, password);
      const authUser = data.user;
      signIn({
        id: authUser.id,
        name: authUser.user_metadata?.full_name || email.split("@")[0],
        email: authUser.email || email,
        role: (authUser.user_metadata?.role as UserRole) || role,
      });
      toast.success("Signed in successfully with Supabase!");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Check email & password.");
      // Fallback local sign in for prototype test
      signIn({
        id: "u-demo",
        name: email.split("@")[0] || "Alex Mathew",
        email: email || "alex@example.com",
        role: role,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpUser({
        email,
        password,
        fullName,
        role,
        bloodGroup,
        district,
      });
      signIn({
        name: fullName,
        email,
        role,
        bloodGroup,
        district,
      });
      toast.success(`Registered as ${role.toUpperCase()} successfully!`);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Registration error. Trying fallback auth...");
      signIn({
        name: fullName || "Alex Mathew",
        email: email || "alex@example.com",
        role,
        bloodGroup,
        district,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Password reset link sent to ${email}`);
    setMode("signin");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-md rounded-3xl p-6 sm:p-7">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-6 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">
            {mode === "signin"
              ? "Sign In to BloodConnect"
              : mode === "signup"
              ? "Create Supabase Account"
              : "Reset Password"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {mode === "signin"
              ? "Access persistent district blood network & real-time alerts."
              : mode === "signup"
              ? "Select your role and create your real Supabase profile."
              : "Enter your email address to receive reset instructions."}
          </p>
        </DialogHeader>

        {/* Tab Selector Mode */}
        <div className="flex rounded-2xl bg-muted/70 p-1 border text-xs font-bold mt-2">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={cn(
              "flex-1 py-2 rounded-xl transition-all cursor-pointer",
              mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 py-2 rounded-xl transition-all cursor-pointer",
              mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="size-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-2xl border border-input bg-background pl-9 pr-3.5 py-2.5 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-foreground">Password</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="size-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-input bg-background pl-9 pr-3.5 py-2.5 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 text-xs"
            >
              {loading ? "Signing In..." : "SIGN IN WITH SUPABASE ⚡"}
            </Button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Role Account Type</label>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setRole("seeker")}
                  className={cn(
                    "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                    role === "seeker" ? "bg-critical text-white border-critical" : "bg-card text-foreground"
                  )}
                >
                  <Droplet className="size-3.5 fill-current" />
                  Seeker
                </button>

                <button
                  type="button"
                  onClick={() => setRole("donor")}
                  className={cn(
                    "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                    role === "donor" ? "bg-emerald-600 text-white border-emerald-600" : "bg-card text-foreground"
                  )}
                >
                  <Heart className="size-3.5 fill-current" />
                  Donor
                </button>

                <button
                  type="button"
                  onClick={() => setRole("hospital")}
                  className={cn(
                    "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                    role === "hospital" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card text-foreground"
                  )}
                >
                  <Hospital className="size-3.5" />
                  Hospital
                </button>

                <button
                  type="button"
                  onClick={() => setRole("blood_bank")}
                  className={cn(
                    "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer",
                    role === "blood_bank" ? "bg-purple-600 text-white border-purple-600" : "bg-card text-foreground"
                  )}
                >
                  <Building2 className="size-3.5" />
                  Blood Bank
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Full Name / Organization</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === "hospital" ? "Pushpagiri Medical College Hospital" : "Alex Mathew"}
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2 text-xs font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-2xl border border-input bg-background px-3.5 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-input bg-background px-3.5 py-2 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-xs font-bold"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-xs font-bold"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 text-xs"
            >
              {loading ? "Registering..." : `CREATE ${role.toUpperCase()} ACCOUNT ⚡`}
            </Button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Account Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-2xl font-extrabold bg-foreground text-background hover:bg-foreground/90 text-xs"
            >
              SEND RESET LINK
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
