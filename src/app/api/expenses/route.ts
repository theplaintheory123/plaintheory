import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getExpenses, createExpense, deleteExpense } from "@/lib/db/expenses";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const expenses = await getExpenses(user.id);
  return NextResponse.json({ expenses });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const expense = await createExpense(user.id, {
    amount: Number(body.amount),
    category: body.category || "Other",
    description: body.description || "",
    date: body.date || new Date().toISOString().split("T")[0],
  });
  return NextResponse.json({ expense });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await deleteExpense(user.id, id);
  return NextResponse.json({ ok: true });
}
