import { getSessionUser } from "@/lib/auth/session";
import { getTasks } from "@/lib/db/tasks";
import { getHabits, getTodayChecks, getAllHabitChecks } from "@/lib/db/habits";
import { getFocusSessions } from "@/lib/db/focus";
import { getGoals } from "@/lib/db/goals";
import { getExpenses } from "@/lib/db/expenses";
import { todayISO } from "@/lib/utils";
import DashboardOverview from "./DashboardOverview";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const today = todayISO();

  const [tasks, habits, todayChecks, allChecks, sessions, goals, expenses] = await Promise.all([
    getTasks(user.id),
    getHabits(user.id),
    getTodayChecks(user.id, today),
    getAllHabitChecks(user.id),
    getFocusSessions(user.id, 365),
    getGoals(user.id),
    getExpenses(user.id),
  ]);

  return (
    <DashboardOverview
      userName={user.email}
      today={today}
      tasks={tasks}
      habits={habits}
      todayChecks={todayChecks}
      allChecks={allChecks}
      focusSessions={sessions}
      goals={goals.filter((g) => !g.archived)}
      expenses={expenses}
    />
  );
}
