"use server";

import mongoose from "mongoose";

import User from "@/models/User";
import Message from "@/models/Message";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Conversation from "@/models/Conversation";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";
import PostMessageResponse from "@/types/PostMessageResponse";

export async function postMessage(
  formData: FormData,
): Promise<PostMessageResponse> {
  await connectToDatabase();

  const { userId } = auth();

  const convId = formData.get("conversationId") as string;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];

  if (!text) throw new Error("Text is required");
  if (text === "hheheh")
    await new Promise((resolve) => setTimeout(resolve, 3000));

  let user = await User.findOne({ clerkId: userId });
  if (!user) throw new Error("User not created");

  const conv = convId
    ? await Conversation.findOne({ _id: convId, userId: user.id })
    : await Conversation.create({ userId: user.id });

  if (!conv) throw new Error("Conversation not found");
  const conversationId = conv.id;

  const connection = mongoose.connection;
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  const fileIds = (
    await uploadFilesToGridFS(files, connection, bucketName)
  ).map((id) => id.toString());

  await Message.create({ conversationId, text, fileIds });

  revalidatePath(`/chat/${conversationId}`);

  return { conversationId, fileIds };
}
