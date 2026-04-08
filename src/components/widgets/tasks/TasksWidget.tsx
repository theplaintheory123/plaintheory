import { getSessionUser } from "@/lib/auth/session";
import { getTasks } from "@/lib/db/tasks";
import TaskList from "./TaskList";

export default async function TasksWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const tasks = await getTasks(user.id);
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return <TaskList initialTasks={sorted} />;
}
