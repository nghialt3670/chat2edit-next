"use server";

import mongoose from "mongoose";

import IMessage from "@/types/Message";
import connectToDatabase from "@/lib/mongo";
import { revalidatePath } from "next/cache";
import TempMessage from "@/models/TempMessage";
import TempConversation from "@/models/TempConversation";
import { GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

interface ChatResponse {
  text: string;
  file_ids: string[];
}

export async function sendTempMessage(formData: FormData): Promise<IMessage> {
  await connectToDatabase();

  const convId = formData.get("conversationId")! as string;
  const text = formData.get("text") as string;
  const fileIds = formData.getAll("fileIds") as string[];

  const conv = await TempConversation.findOne({ _id: convId });
  if (!conv) throw new Error("TempConversation not created");

  const bucketName = GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME;
  const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
  const reqBody = JSON.stringify({
    conversation_id: convId,
    text,
    file_ids: fileIds,
    bucket_name: bucketName,
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: reqBody,
  });

  if (!response.ok) throw new Error("Chat service error");
  const payload = (await response.json()) as ChatResponse;

  await TempMessage.create({
    conversationId: conv.id,
    text: payload.text,
    fileIds: payload.file_ids,
  });

  await conv.updateOne({
    title: payload.text,
    lastModified: Date.now(),
  });

  revalidatePath(`/chat/conversations/${convId}`);

  return {
    type: "Response",
    id: new mongoose.Types.ObjectId().toString(),
    text: payload.text,
    fileIds: payload.file_ids,
  };
}
