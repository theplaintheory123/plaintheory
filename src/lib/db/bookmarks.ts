import { PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Bookmark } from "@/types";
import { generateId } from "@/lib/utils";

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk(userId), ":prefix": "BOOKMARK#" },
    })
  );
  return (res.Items || []) as Bookmark[];
}

export async function createBookmark(userId: string, title: string, url: string): Promise<Bookmark> {
  const id = generateId();
  const now = new Date().toISOString();
  const item: Bookmark = { id, userId, title, url, createdAt: now };
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: { PK: pk(userId), SK: sk.bookmark(id), type: "BOOKMARK", ...item },
    })
  );
  return item;
}

export async function deleteBookmark(userId: string, bookmarkId: string): Promise<void> {
  await db.send(
    new DeleteCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.bookmark(bookmarkId) } })
  );
}
