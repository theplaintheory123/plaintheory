import { getSessionUser } from "@/lib/auth/session";
import { getGoals } from "@/lib/db/goals";
import GoalsList from "./GoalsList";

export default async function GoalsWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const goals = await getGoals(user.id);
  return <GoalsList initialGoals={goals} />;
}
