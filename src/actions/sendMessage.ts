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
import IMessage from "@/types/Message";

interface SendMessageResponse {
  conversationId?: string;
  fileIds?: string[];
  message?: IMessage;
}

export interface ChatResponse {
  text: string;
  file_ids: string[];
}

export default async function sendMessage(
  formData: FormData,
): Promise<SendMessageResponse> {
  let finalResponse: SendMessageResponse = {};
  let conv;

  const convId = formData.get("conversationId") as string;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
  
  try {
    await connectToDatabase();
    
    if (!text) throw new Error("Text is required");

    const { userId } = auth();
    let user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not created");

    conv = convId
      ? await Conversation.findOne({ _id: convId, userId: user.id })
      : await Conversation.create({ userId: user.id });
    if (!conv) throw new Error("Conversation not found");

    const conversationId = conv.id;

    const connection = mongoose.connection;
    const fileIds = (
      await uploadFilesToGridFS(files, connection, bucketName)
    ).map((id) => id.toString());

    await Message.create({ conversationId, text, fileIds });
    await conv.updateOne({ title: text, lastModified: Date.now() });

    finalResponse.conversationId = conversationId;
    finalResponse.fileIds = fileIds;
  } catch (error) {
    return finalResponse;
  }

  try {
    const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
    const reqBody = JSON.stringify({
      conversation_id: finalResponse.conversationId,
      text,
      file_ids: finalResponse.fileIds,
      bucket_name: bucketName,
    });

    console.log("start")
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    });
    console.log("end")

    if (!response.ok) {
      await conv.updateOne({ isError: true });
      revalidatePath(`/chat/${finalResponse.conversationId}`);
      return finalResponse;
    }

    const payload = (await response.json()) as ChatResponse;

    const resMessage = await Message.create({
      conversationId: conv.id,
      text: payload.text,
      fileIds: payload.file_ids,
    });

    await conv.updateOne({
      title: resMessage.text,
      lastModified: Date.now(),
    });

    revalidatePath(`/chat/${finalResponse.conversationId}`);

    finalResponse.message = {
      id: resMessage.id,
      type: "Response",
      text: resMessage.text,
      fileIds: resMessage.fileIds.map((id) => String(id)),
    };
  } catch (error) {
    return finalResponse;
  }

  return finalResponse;
}
