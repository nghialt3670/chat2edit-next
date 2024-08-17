"use server"

import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import IMessage from "@/types/Message";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ChatResponse } from "./sendMessage";

export default async function resendMessage(conversationId: string): Promise<IMessage | null> {
  try {
    await connectToDatabase();

    const { userId } = auth();
    let user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not created");

    const conv = await Conversation.findOne({_id: conversationId, userId: user.id}) 
    if (!conv) throw new Error("Conversation not found");
    if (!conv.isError) throw new Error("Can only resend message in error conversation");

    const reqMessage = await Message.findOne({conversationId});
    if (!reqMessage) throw new Error("Request message not found");

    const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
    const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
    const reqBody = JSON.stringify({
      conversation_id: conversationId,
      text: reqMessage.text,
      file_ids: reqMessage.fileIds,
      bucket_name: bucketName,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ChatResponse;

    const resMessage = await Message.create({
      conversationId: conv.id,
      text: payload.text,
      fileIds: payload.file_ids,
    });

    await conv.updateOne({
      isError: false,
      title: resMessage.text,
      lastModified: Date.now(),
    });

    revalidatePath(`/chat/${conversationId}`);

    return {
      id: resMessage.id,
      type: "Response",
      text: resMessage.text,
      fileIds: resMessage.fileIds.map((id) => String(id)),
    };
  } catch (error) {
    return null;
  }
}