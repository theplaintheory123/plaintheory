import { getSessionUser } from "@/lib/auth/session";
import { getBookmarks } from "@/lib/db/bookmarks";
import BookmarkList from "./BookmarkList";

export default async function BookmarksWidget() {
  const user = await getSessionUser();
  if (!user) return null;
  const bookmarks = await getBookmarks(user.id);
  return <BookmarkList initialBookmarks={bookmarks} />;
}
