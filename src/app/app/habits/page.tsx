import { getSessionUser } from "@/lib/auth/session";
import { getHabits, getTodayChecks } from "@/lib/db/habits";
import { todayISO } from "@/lib/utils";
import HabitsPageClient from "./HabitsPageClient";

export default async function HabitsPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const today = todayISO();
  const [habits, checks] = await Promise.all([
    getHabits(user.id),
    getTodayChecks(user.id, today),
  ]);
  return <HabitsPageClient initialHabits={habits} initialChecks={checks} today={today} />;
}
