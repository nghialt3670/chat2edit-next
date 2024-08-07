"use server";

import mongoose from "mongoose";

import User from "@/models/User";
import Message from "@/models/Message";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";
import { revalidatePath } from "next/cache";
import PostMessageResponse from "@/types/PostMessageResponse";

export async function postMessage(
  formData: FormData,
): Promise<PostMessageResponse> {
  await connectToDatabase();

  const { userId } = auth();

  const convId = formData.get("conversationId") as string;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];

  let user = await User.findOne({ clerkId: userId });
  if (!user) user = await User.create({ clerkId: userId });

  const conv = convId
    ? await Conversation.findOne({ _id: convId, userId: user.id })
    : await Conversation.create({ userId: user.id });

  if (!conv) throw new Error("Conversation not found");

  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  const fileIds = await uploadFilesToGridFS(
    files,
    mongoose.connection,
    bucketName,
  );

  await Message.create({ conversationId: conv!.id, text, fileIds });

  if (convId) revalidatePath(`/chat/conversations/${convId}`);

  return {
    conversationId: conv.id,
    fileIds: fileIds.map((fileId) => fileId.toString()),
  };
}
