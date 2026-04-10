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
        <div className="flex h-screen overflow-hidden bg-zinc-50">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-5xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DashboardShell>
    </AuthProvider>
  );
}
