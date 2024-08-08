"use server"

import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import ConvMetaData from "@/types/ConvMetaData";
import { auth } from "@clerk/nextjs/server";

export default async function getConvMetaDataList(): Promise<ConvMetaData[]> {
  await connectToDatabase();

  const { userId } = auth();

  let user = await User.findOne({ clerkId: userId });
  if (!user) user = await User.create({ clerkId: userId });

  // Get the conversations from new to old
  const conversations = (await Conversation.find({ userId: user?.id })).sort(
    (conv1, conv2) => conv2.lastModified - conv1.lastModified,
  );

  return conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    lastModified: conv.lastModified
  }))
}