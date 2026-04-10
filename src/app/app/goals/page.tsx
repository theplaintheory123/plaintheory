import { Suspense } from "react";
import { getSessionUser } from "@/lib/auth/session";
import { getGoals, getAllGoalLogs } from "@/lib/db/goals";
import { Skeleton } from "@/components/ui/skeleton";
import GoalsPageClient from "./GoalsPageClient";

export default async function GoalsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const [goals, logs] = await Promise.all([getGoals(user.id), getAllGoalLogs(user.id)]);

  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>}>
      <GoalsPageClient initialGoals={goals} initialLogs={logs} />
    </Suspense>
  );
}
