import { getSessionUser } from "@/lib/auth/session";
import { getBookmarks } from "@/lib/db/bookmarks";
import BookmarksPageClient from "./BookmarksPageClient";

export default async function BookmarksPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const bookmarks = await getBookmarks(user.id);
  return <BookmarksPageClient initialBookmarks={bookmarks} />;
}
