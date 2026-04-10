import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getGoals,
  createGoal,
  updateGoal,
  archiveGoal,
  logGoalProgress,
  getAllGoalLogs,
} from "@/lib/db/goals";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [goals, logs] = await Promise.all([getGoals(user.id), getAllGoalLogs(user.id)]);
  return NextResponse.json({ goals, logs });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const goal = await createGoal(user.id, {
    title: body.title,
    description: body.description || "",
    category: body.category || "personal",
    targetValue: Number(body.targetValue) || 100,
    unit: body.unit || "%",
    deadline: body.deadline || null,
    color: body.color || "#C2786B",
  });
  return NextResponse.json({ goal });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, ...rest } = body;

  if (action === "archive") {
    await archiveGoal(user.id, id);
    return NextResponse.json({ ok: true });
  }

  if (action === "log") {
    const log = await logGoalProgress(user.id, id, Number(rest.value), rest.note || "");
    return NextResponse.json({ log });
  }

  await updateGoal(user.id, id, rest);
  return NextResponse.json({ ok: true });
}
