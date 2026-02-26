"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Home,
  Car,
  FileText,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Home },
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="glass hidden lg:flex lg:flex-col w-[220px] flex-shrink-0 rounded-2xl p-4 sticky top-5 h-[calc(100vh-2.5rem)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-base tracking-tight text-white">
          Auto<span className="text-indigo-400">Content</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        <p className="section-title px-2">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center gap-3 px-2">
        <UserButton afterSignOutUrl="/" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-white truncate">My Account</span>
          <span className="text-xs text-[var(--text-muted)] truncate">Manage profile</span>
        </div>
      </div>
    </aside>
  );
};
