import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <AuthProvider>
      <DashboardShell>
        <div className="flex min-h-screen bg-stone-50">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </DashboardShell>
    </AuthProvider>
  );
}
