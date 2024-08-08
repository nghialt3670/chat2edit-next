"use server";

import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";
import TempConversation from "@/models/TempConversation";

export default async function createConversation(): Promise<string> {
  await connectToDatabase();

  const { userId } = auth();

  return userId
    ? (await Conversation.create({ userId: userId })).id
    : (await TempConversation.create({})).id;
}
