import { getSessionUser } from "@/lib/auth/session";
import { getFocusSessions } from "@/lib/db/focus";
import { getUserPrefs } from "@/lib/db/prefs";
import { todayISO } from "@/lib/utils";
import FocusPageClient from "./FocusPageClient";

export default async function FocusPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const [sessions, prefs] = await Promise.all([
    getFocusSessions(user.id, 30),
    getUserPrefs(user.id),
  ]);
  const today = todayISO();
  return (
    <FocusPageClient
      initialSessions={sessions}
      today={today}
      savedFocusDuration={prefs?.focusDurationMinutes || 25}
      savedBreakDuration={prefs?.breakDurationMinutes || 5}
    />
  );
}
