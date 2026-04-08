import { getSessionUser } from "@/lib/auth/session";
import { getFocusSessions } from "@/lib/db/focus";
import { getUserPrefs } from "@/lib/db/prefs";
import FocusTimer from "./FocusTimer";
import { todayISO } from "@/lib/utils";

export default async function FocusWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const [sessions, prefs] = await Promise.all([
    getFocusSessions(user.id, 1),
    getUserPrefs(user.id),
  ]);
  const today = todayISO();
  const todaySessions = sessions.filter((s) => s.completedAt.startsWith(today));

  return (
    <FocusTimer
      focusDuration={prefs?.focusDurationMinutes || 25}
      breakDuration={prefs?.breakDurationMinutes || 5}
      initialSessionsToday={todaySessions.length}
    />
  );
}
