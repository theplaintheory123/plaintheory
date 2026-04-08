import { getSessionUser } from "@/lib/auth/session";
import { getNote } from "@/lib/db/notes";
import NotesEditor from "./NotesEditor";

export default async function NotesWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const note = await getNote(user.id);
  return <NotesEditor initialContent={note?.content || ""} />;
}
