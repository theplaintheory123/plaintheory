import { getSessionUser } from "@/lib/auth/session";
import { getExpenses } from "@/lib/db/expenses";
import ExpensesPageClient from "./ExpensesPageClient";

export default async function ExpensesPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const expenses = await getExpenses(user.id);
  return <ExpensesPageClient initialExpenses={expenses} />;
}
