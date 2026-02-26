export const dynamic = "force-dynamic";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
          <Zap className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="text-[var(--text-secondary)]">This page doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary mx-auto inline-flex">Back to Home</Link>
      </div>
    </div>
  );
}
