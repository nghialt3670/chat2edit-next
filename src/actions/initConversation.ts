"use server";

import User from "@/models/User";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";
import TempConversation from "@/models/TempConversation";

export async function initConversation(): Promise<string> {
  await connectToDatabase();
  const { userId } = auth();
  if (!userId) {
    const tempConv = await TempConversation.create({});
    return tempConv.id.toString();
  }
  let user = await User.findOne({ clerkId: userId });
  if (!user) user = await User.create({ clerkId: userId });
  const conv = await Conversation.create({ userId: user.id });
  return conv.id.toString();
}
