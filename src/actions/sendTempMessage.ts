"use server";

import mongoose from "mongoose";

import Message from "@/types/Message";
import connectToDatabase from "@/lib/mongo";
import TempMessage from "@/models/TempMessage";
import TempConversation from "@/models/TempConversation";
import SendMessageRequest from "@/types/SendMessageRequest";
import { GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

interface ChatResponse {
  text: string;
  file_ids: string[];
}

export async function sendTempMessage(request: SendMessageRequest): Promise<Message> {
  await connectToDatabase();

  const { conversationId, text, fileIds } = request;

  const conv = await TempConversation.findOne({ _id: conversationId });
  if (!conv) throw new Error("TempConversation not created");

  const bucketName = GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME;
  const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
  const reqBody = JSON.stringify({
    conversation_id: conversationId,
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

  return {
    type: "Response",
    id: new mongoose.Types.ObjectId().toString(),
    text: payload.text,
    fileIds: payload.file_ids,
  };
}
