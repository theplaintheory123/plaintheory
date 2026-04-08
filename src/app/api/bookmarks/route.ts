import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getBookmarks, createBookmark, deleteBookmark } from "@/lib/db/bookmarks";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookmarks = await getBookmarks(user.id);
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, url } = await req.json();
  if (!title || !url) return NextResponse.json({ error: "title and url required" }, { status: 400 });
  const bookmark = await createBookmark(user.id, title, url);
  return NextResponse.json({ bookmark }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteBookmark(user.id, id);
  return NextResponse.json({ ok: true });
}
