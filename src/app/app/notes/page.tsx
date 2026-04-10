import { getSessionUser } from "@/lib/auth/session";
import { getNote } from "@/lib/db/notes";
import NotesPageClient from "./NotesPageClient";

export default async function NotesPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const note = await getNote(user.id);
  return <NotesPageClient initialContent={note?.content || ""} />;
}
