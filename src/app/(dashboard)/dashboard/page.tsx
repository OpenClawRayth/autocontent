"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Home, Car, FileText, Zap, TrendingUp, Clock, Users, Shield } from "lucide-react";
import Link from "next/link";
import { useAdminUser } from "@/hooks/useAdminUser";

export default function DashboardPage() {
  const { user, userId, isAdmin } = useAdminUser();

  const userData = useQuery(api.users.getUser, { clerkId: userId });
  const propertiesAll = useQuery(api.properties.listAll, isAdmin ? {} : "skip");
  const propertiesByUser = useQuery(api.properties.list, !isAdmin ? { userId } : "skip");
  const properties = isAdmin ? propertiesAll : propertiesByUser;

  const vehiclesAll = useQuery(api.vehicles.listAll, isAdmin ? {} : "skip");
  const vehiclesByUser = useQuery(api.vehicles.list, !isAdmin ? { userId } : "skip");
  const vehicles = isAdmin ? vehiclesAll : vehiclesByUser;

  const contentAll = useQuery(api.content.listAll, isAdmin ? {} : "skip");
  const contentByUser = useQuery(api.content.listByUser, !isAdmin ? { userId } : "skip");
  const contentItems = isAdmin ? contentAll : contentByUser;

  const allUsers = useQuery(api.users.listAll, isAdmin ? {} : "skip");

  const generationsLeft = isAdmin
    ? 99999
    : (userData?.generationsLimit ?? 10) - (userData?.generationsUsed ?? 0);
  const usagePercent = userData
    ? Math.min(Math.round((userData.generationsUsed / userData.generationsLimit) * 100), 100)
    : 0;

  const totalGenerationsUsed = isAdmin
    ? (allUsers ?? []).reduce((sum, u) => sum + (u.generationsUsed ?? 0), 0)
    : 0;

  const stats = isAdmin
    ? [
        {
          label: "Total Users",
          value: allUsers?.length ?? 0,
          icon: Users,
          href: "/dashboard",
          color: "text-violet-400",
          bg: "bg-violet-500/10",
        },
        {
          label: "Properties",
          value: properties?.length ?? 0,
          icon: Home,
          href: "/properties",
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        },
        {
          label: "Vehicles",
          value: vehicles?.length ?? 0,
          icon: Car,
          href: "/vehicles",
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
        },
        {
          label: "Content Pieces",
          value: contentItems?.length ?? 0,
          icon: FileText,
          href: "/content",
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        },
      ]
    : [
        {
          label: "Properties",
          value: properties?.length ?? 0,
          icon: Home,
          href: "/properties",
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        },
        {
          label: "Vehicles",
          value: vehicles?.length ?? 0,
          icon: Car,
          href: "/vehicles",
          color: "text-indigo-400",
          bg: "bg-indigo-500/10",
        },
        {
          label: "Content Pieces",
          value: contentItems?.length ?? 0,
          icon: FileText,
          href: "/content",
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        },
        {
          label: "Generations Left",
          value: generationsLeft,
          icon: Zap,
          href: "/settings",
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
        },
      ];

  const recentContent = contentItems?.slice(0, 5) ?? [];

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            {isAdmin ? (
              <>
                <Shield className="w-6 h-6 text-violet-400" />
                Admin Dashboard
              </>
            ) : (
              <>Welcome back{user?.firstName ? `, ${user.firstName}` : ""} 👋</>
            )}
          </h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Platform-wide overview · admin session"
              : `${userData?.companyName ?? "Your workspace"} · ${userData?.plan ?? "free"} plan`}
          </p>
        </div>
        {isAdmin && (
          <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full border border-violet-500/30 font-semibold">
            Admin
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="glass-card p-5 cursor-pointer hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin: Platform Usage */}
      {isAdmin && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">Platform Usage</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[var(--text-muted)] mb-1">Total Generations Used</p>
              <p className="text-xl font-bold text-white">{totalGenerationsUsed.toLocaleString()}</p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[var(--text-muted)] mb-1">Free Plan Users</p>
              <p className="text-xl font-bold text-white">
                {(allUsers ?? []).filter((u) => u.plan === "free").length}
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[var(--text-muted)] mb-1">Paid Users</p>
              <p className="text-xl font-bold text-white">
                {(allUsers ?? []).filter((u) => u.plan !== "free" && u.clerkId !== "admin_bypass").length}
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
              <p className="text-xs text-[var(--text-muted)] mb-1">Real Estate Users</p>
              <p className="text-xl font-bold text-white">
                {(allUsers ?? []).filter((u) => u.industry === "real_estate").length}
              </p>
            </div>
          </div>

          {/* User breakdown table */}
          {(allUsers?.length ?? 0) > 1 && (
            <div className="mt-2">
              <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-widest">All Users</p>
              <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
                {(allUsers ?? [])
                  .filter((u) => u.clerkId !== "admin_bypass")
                  .map((u) => (
                    <div key={u._id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-white">{u.name || u.email}</p>
                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--text-secondary)]">
                          {u.generationsUsed ?? 0}/{u.generationsLimit ?? 10} gen
                        </span>
                        <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[var(--text-secondary)] capitalize">
                          {u.plan}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Regular user: Usage Bar */}
      {!isAdmin && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white">AI Generation Usage</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">
              {userData?.generationsUsed ?? 0} / {userData?.generationsLimit ?? 10} used
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {usagePercent >= 80 && (
            <p className="text-xs text-yellow-400 mt-2">
              You&apos;re running low on generations.{" "}
              <Link href="/settings" className="underline">Upgrade your plan</Link>.
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="section-title">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/properties">
            <div className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isAdmin ? "View All Properties" : "Add Property"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Real estate listings</p>
              </div>
            </div>
          </Link>
          <Link href="/vehicles">
            <div className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isAdmin ? "View All Vehicles" : "Add Vehicle"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Car dealership inventory</p>
              </div>
            </div>
          </Link>
          <Link href="/content">
            <div className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">View Content</p>
                <p className="text-xs text-[var(--text-muted)]">All generated pieces</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      {recentContent.length > 0 && (
        <div>
          <p className="section-title">{isAdmin ? "Recent Content (All Users)" : "Recent Content"}</p>
          <div className="glass-card divide-y divide-[var(--border)]">
            {recentContent.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white capitalize">
                    {item.contentType.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{item.body.slice(0, 80)}…</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(item._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
