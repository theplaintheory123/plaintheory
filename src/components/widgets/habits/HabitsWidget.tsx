import { getSessionUser } from "@/lib/auth/session";
import { getHabits, getTodayChecks } from "@/lib/db/habits";
import { todayISO } from "@/lib/utils";
import HabitList from "./HabitList";

export default async function HabitsWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const today = todayISO();
  const [habits, checks] = await Promise.all([
    getHabits(user.id),
    getTodayChecks(user.id, today),
  ]);
  return <HabitList initialHabits={habits} initialChecks={checks} today={today} />;
}
