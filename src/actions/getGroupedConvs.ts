"use server";

import { format } from "date-fns";

import User from "@/models/User";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";
import ConvMetaData from "@/types/ConvMetaData";

export async function getGroupedConvs(): Promise<
  Record<string, ConvMetaData[]>
> {
  await connectToDatabase();

  const { userId } = auth();
  const user = await User.findOne({ clerkId: userId });

  // Get the conversations from new to old
  const conversations = (await Conversation.find({ userId: user?.id })).sort(
    (conv1, conv2) => conv2.lastModified - conv1.lastModified,
  );

  // Group the conversations by date
  const grouped: Record<string, ConvMetaData[]> = {};
  conversations.forEach((conv) => {
    const date = format(new Date(conv.lastModified), "yyyy-MM-dd");
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push({
      id: conv.id,
      title: conv.title,
      lastModified: conv.lastModified,
    });
  });

  return grouped;
}
