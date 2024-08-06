"use server";

import mongoose from "mongoose";

import connectToDatabase from "@/lib/mongo";
import { revalidatePath } from "next/cache";
import TempMessage from "@/models/TempMessage";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import TempConversation from "@/models/TempConversation";
import PostMessageResponse from "@/types/PostMessageResponse";
import { GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

export async function postTempMessage(
  formData: FormData,
): Promise<PostMessageResponse> {
  await connectToDatabase();

  const convId = formData.get("conversationId") as string;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];

  const conv = convId
    ? await TempConversation.findOne({ _id: convId })
    : await TempConversation.create({});

  if (!conv) throw new Error("Conversation not found");

  const bucketName = GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME;
  const fileIds = await uploadFilesToGridFS(
    files,
    mongoose.connection,
    bucketName,
  );

  await TempMessage.create({ conversationId: conv.id, text, fileIds });

  if (convId) revalidatePath(`/chat/conversations/${convId}`);

  return {
    conversationId: conv.id,
    fileIds: fileIds.map((fileId) => fileId.toString()),
  };
}
