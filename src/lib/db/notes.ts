import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE } from "./client";
import { pk, sk } from "./schema";
import { Note } from "@/types";

export async function getNote(userId: string): Promise<Note | null> {
  const res = await db.send(
    new GetCommand({ TableName: TABLE, Key: { PK: pk(userId), SK: sk.note() } })
  );
  if (!res.Item) return null;
  return { userId, content: res.Item.content, updatedAt: res.Item.updatedAt } as Note;
}

export async function upsertNote(userId: string, content: string): Promise<void> {
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: pk(userId),
        SK: sk.note(),
        type: "NOTE",
        userId,
        content,
        updatedAt: new Date().toISOString(),
      },
    })
  );
}
