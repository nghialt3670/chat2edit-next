"use server";

import mongoose from "mongoose";

import User from "@/models/User";
import Message from "@/models/Message";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Conversation from "@/models/Conversation";
import { deleteFilesFromGridFS } from "@/lib/gridfs";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

export async function deleteConversation(conversationId: string) {
  await connectToDatabase();

  const { userId } = auth();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new Error("User not found");

  const conv = await Conversation.findOne({
    _id: conversationId,
    userId: user.id,
  });
  if (!conv) throw new Error("Conversation not found");

  await conv.deleteOne();

  const messages = await Message.find({ conversationId });
  await Promise.all(messages.map(async (message) => await message.deleteOne()));

  const fileIds = messages.flatMap((message) =>
    message.fileIds.map(
      (fileId) => new mongoose.Types.ObjectId(String(fileId)),
    ),
  );
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  await deleteFilesFromGridFS(fileIds, mongoose.connection, bucketName);

  revalidatePath("/chat");
}
