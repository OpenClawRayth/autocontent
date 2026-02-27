"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Wrong password.");
        setPassword("");
        inputRef.current?.focus();
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">AutoContent</span>
          </div>
          <p className="text-zinc-500 text-sm">Admin access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              autoComplete="current-password"
              aria-label="Admin password"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                bg-zinc-900 border text-white placeholder-zinc-600
                focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent
                transition-all
                ${error ? "border-red-500/60" : "border-zinc-800"}
              `}
            />
            {error && (
              <p className="mt-2 text-red-400 text-xs">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            aria-label="Sign in as admin"
            className="
              w-full py-3 rounded-xl text-sm font-medium
              bg-violet-600 hover:bg-violet-500 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
            "
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-700 text-xs">
          Not an admin?{" "}
          <a
            href="/sign-in"
            className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors"
          >
            Sign in with your account
          </a>
        </p>
      </div>
    </div>
  );
}
