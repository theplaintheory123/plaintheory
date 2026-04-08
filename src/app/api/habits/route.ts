import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getHabits, createHabit, archiveHabit, getTodayChecks, toggleHabitCheck } from "@/lib/db/habits";
import { todayISO } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [habits, checks] = await Promise.all([
    getHabits(user.id),
    getTodayChecks(user.id, todayISO()),
  ]);
  return NextResponse.json({ habits, checks });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, emoji } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const habit = await createHabit(user.id, name, emoji);
  return NextResponse.json({ habit }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, action, completed } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "archive") {
    await archiveHabit(user.id, id);
  } else if (action === "check") {
    await toggleHabitCheck(user.id, id, todayISO(), completed);
  }
  return NextResponse.json({ ok: true });
}
