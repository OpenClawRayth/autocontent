"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAdminUser } from "@/hooks/useAdminUser";
import {
  User,
  Building2,
  Zap,
  Shield,
  ChevronRight,
  Check,
  LogOut,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    key: "free",
    label: "Free",
    price: "$0",
    limit: 10,
    color: "text-zinc-400",
    border: "border-zinc-700",
    badge: "bg-zinc-800 text-zinc-300",
  },
  {
    key: "starter",
    label: "Starter",
    price: "$29",
    limit: 100,
    color: "text-blue-400",
    border: "border-blue-500/40",
    badge: "bg-blue-500/20 text-blue-300",
  },
  {
    key: "pro",
    label: "Pro",
    price: "$79",
    limit: 500,
    color: "text-indigo-400",
    border: "border-indigo-500/40",
    badge: "bg-indigo-500/20 text-indigo-300",
    popular: true,
  },
  {
    key: "agency",
    label: "Agency",
    price: "$199",
    limit: 2000,
    color: "text-purple-400",
    border: "border-purple-500/40",
    badge: "bg-purple-500/20 text-purple-300",
  },
] as const;

export default function SettingsPage() {
  const { user, userId, isAdmin } = useAdminUser();
  const { signOut } = useClerk();
  const userData = useQuery(api.users.getUser, { clerkId: userId });
  const updateProfile = useMutation(api.users.updateProfile);

  const [editingWorkspace, setEditingWorkspace] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<"real_estate" | "auto" | "">("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleEditWorkspace = () => {
    setCompanyName(userData?.companyName ?? "");
    setIndustry((userData?.industry as "real_estate" | "auto") ?? "");
    setEditingWorkspace(true);
  };

  const handleSaveWorkspace = async () => {
    setSaving(true);
    await updateProfile({
      clerkId: userId,
      companyName: companyName || undefined,
      industry: industry || undefined,
    });
    setSaving(false);
    setSaved(true);
    setEditingWorkspace(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = () => signOut({ redirectUrl: "/" });

  const currentPlan = userData?.plan ?? (isAdmin ? "agency" : "free");
  const used = userData?.generationsUsed ?? 0;
  const limit = userData?.generationsLimit ?? (isAdmin ? 99999 : 10);
  const usagePercent = isAdmin ? 0 : Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="animate-fade-up space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and workspace</p>
      </div>

      {/* Account */}
      <section className="glass-card divide-y divide-[var(--border)]">
        <div className="flex items-center gap-3 px-5 py-4">
          <User className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Account</span>
        </div>

        {isAdmin ? (
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-[var(--text-muted)]">Bypass session active</p>
            </div>
            <span className="ml-auto text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
              Admin
            </span>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {user?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.imageUrl} alt="Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {user?.firstName?.[0] ?? "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {user?.fullName ?? "—"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {user?.primaryEmailAddress?.emailAddress ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Workspace */}
      <section className="glass-card divide-y divide-[var(--border)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Workspace</span>
          </div>
          {!editingWorkspace && (
            <button
              onClick={handleEditWorkspace}
              aria-label="Edit workspace"
              className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        {editingWorkspace ? (
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="label">Company / Brand Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Rayth Realty"
                className="input"
              />
            </div>
            <div>
              <label className="label">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as "real_estate" | "auto")}
                className="input"
              >
                <option value="">Select industry…</option>
                <option value="real_estate">Real Estate</option>
                <option value="auto">Auto / Dealership</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSaveWorkspace}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingWorkspace(false)}
                className="btn-ghost"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <SettingsRow label="Company" value={userData?.companyName ?? "Not set"} />
            <SettingsRow
              label="Industry"
              value={
                userData?.industry === "real_estate"
                  ? "Real Estate"
                  : userData?.industry === "auto"
                  ? "Auto / Dealership"
                  : "Not set"
              }
            />
          </>
        )}
      </section>

      {/* Plan & Usage */}
      <section className="glass-card divide-y divide-[var(--border)]">
        <div className="flex items-center gap-3 px-5 py-4">
          <Zap className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Plan & Usage</span>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Current plan</span>
            <span className={cn(
              "text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize",
              PLANS.find(p => p.key === currentPlan)?.badge ?? "bg-zinc-800 text-zinc-300",
              PLANS.find(p => p.key === currentPlan)?.border ?? "border-zinc-700"
            )}>
              {currentPlan}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-muted)]">AI Generations</span>
              <span className="text-xs text-[var(--text-secondary)]">{used} / {limit}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  usagePercent >= 90
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : usagePercent >= 70
                    ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent >= 80 && (
              <p className="text-xs text-yellow-400 mt-1.5">
                Running low — upgrade to get more generations.
              </p>
            )}
          </div>
        </div>

        {/* Plan cards */}
        <div className="px-5 py-4">
          <p className="text-xs text-[var(--text-muted)] mb-3">Upgrade your plan</p>
          <div className="grid grid-cols-2 gap-2.5">
            {PLANS.map((plan) => {
              const isCurrent = plan.key === currentPlan;
              return (
                <div
                  key={plan.key}
                  className={cn(
                    "relative rounded-xl border p-3.5 transition-all",
                    isCurrent
                      ? cn("border-2", plan.border, "bg-white/[0.03]")
                      : "border-[var(--border)] hover:border-white/20 cursor-pointer"
                  )}
                >
                  {"popular" in plan && plan.popular && !isCurrent && (
                    <span className="absolute -top-2 left-3 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className={cn("text-sm font-semibold", plan.color)}>{plan.label}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-base font-bold text-white">{plan.price}<span className="text-xs text-[var(--text-muted)] font-normal">/mo</span></p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{plan.limit.toLocaleString()} generations</p>
                  {!isCurrent && (
                    <button className={cn(
                      "mt-2.5 w-full text-xs font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1",
                      "bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white"
                    )}>
                      Upgrade <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sign Out */}
      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-sm px-4 py-2.5 rounded-xl">
          <Check className="w-4 h-4" />
          Saved
        </div>
      )}

      <section className="glass-card divide-y divide-[var(--border)]">
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Security</span>
        </div>
        {isAdmin ? (
          <div className="px-5 py-4">
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                window.location.href = "/admin-login";
              }}
              aria-label="Sign out of admin session"
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Exit admin session
            </button>
          </div>
        ) : (
          <div className="px-5 py-4">
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

const SettingsRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-5 py-3.5">
    <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    <span className="text-sm text-white">{value}</span>
  </div>
);
