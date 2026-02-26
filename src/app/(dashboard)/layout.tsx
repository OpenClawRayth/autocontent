export const dynamic = "force-dynamic";
import { Sidebar } from "@/components/shared/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex gap-5 p-5">
      <Sidebar />
      <main className="flex-1 min-w-0 space-y-6 pb-10">{children}</main>
    </div>
  );
}
