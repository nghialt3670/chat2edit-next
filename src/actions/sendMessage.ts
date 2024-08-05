"use server";

import mongoose from "mongoose";

import User from "@/models/User";
import Message from "@/models/Message";
import IMessage from "@/types/Message";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import TempMessage from "@/models/TempMessage";
import Conversation from "@/models/Conversation";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import TempConversation from "@/models/TempConversation";
import {
  GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME,
  GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME,
} from "@/config/db";

interface ChatResponse {
  text: string
  file_ids: string[]
}

export async function sendMessage(formData: FormData): Promise<IMessage> {
  await connectToDatabase();
  const { userId } = auth();

  let conversationId = formData.get("conversationId")!;
  let conv, tempConv;
  let isTemp = false;

  // Get the conversation
  if (userId) {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    conv = await Conversation.findOne({ _id: conversationId, userId: user?.id });
  } else {
    tempConv = await TempConversation.findById(conversationId);
    if (!tempConv) throw new Error("Conversation not found");
    isTemp = true;
  }

  // Upload files to GridFS and create request message
  const conn = mongoose.connection;
  const bucketName = isTemp
    ? GRIDFS_FOR_TEMP_MESSAGE_FILES_BUCKET_NAME
    : GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: bucketName,
  });
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];
  const fileIds = await uploadFilesToGridFS(files, bucket);
  if (isTemp) await TempMessage.create({ conversationId, text, fileIds });
  else await Message.create({ conversationId, text, fileIds });

  // Send message to chat service
  const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
  const reqBody = JSON.stringify({
    conversation_id: conversationId,
    text,
    file_ids: fileIds,
    bucket_name: bucketName
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: reqBody,
  });
  

  if (!response.ok) throw new Error("Chat service error");
  const payload = (await response.json()) as ChatResponse;

  if (isTemp) {
    await TempMessage.create({
      conversationId: tempConv!.id,
      text: payload.text,
      fileIds: payload.file_ids,
    });

    await tempConv!.updateOne({
      lastModified: Date.now(),
    });
  } else {
    await Message.create({
      conversationId: conv!.id,
      text: payload.text,
      fileIds: payload.file_ids,
    });

    await conv!.updateOne({
      title: payload.text,
      lastModified: Date.now(),
    });
  }

  return {
    type: "Response",
    id: new mongoose.Types.ObjectId().toString(),
    text: payload.text,
    fileIds: payload.file_ids,
  };
}
