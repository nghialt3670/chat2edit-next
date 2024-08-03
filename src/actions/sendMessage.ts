"use server"

import { CHAT_SERVICE_BASE_URL } from "@/config/endpoints";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import IMessage from "@/types/Message"

interface MessageResponse {
  text: string;
  file_ids: string[];
}

interface ChatResponse {
  status: "success" | "error";
  req_file_ids: string[];
  message?: MessageResponse;
}



export async function sendMessage(formData: FormData): Promise<IMessage | null> {
  await connectToDatabase();
  const { userId } = auth();

  const convId = formData.get("conversationId")

  if (userId) {
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({ clerkId: userId });
    }

    let conv;

    if (!convId) {
      conv = await Conversation.create({userId: user.id})
    } else {
      conv = await Conversation.findById(convId);
      if (!conv || conv.userId.toString() !== user.id) {
        return null
      }
    }

    const sendTime = Date.now();
  
    const endpoint = `${CHAT_SERVICE_BASE_URL}/api/v1/chat/${conv.id}`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  
    const payload = (await response.json()) as ChatResponse;
  
    if (payload.status === "error") {
      console.log("hii")
      return null
    }
  
    await Message.create({
      conversationId: conv.id,
      text: formData.get("text"),
      fileIds: payload.req_file_ids,
      createdAt: sendTime,
    });
    
    const resMessage = await Message.create({
      conversationId: conv.id,
      text: payload.message!.text,
      fileIds: payload.message!.file_ids,
    });

    await conv.updateOne({ title: resMessage.text });

    return {
      type: "Response",
      id: resMessage.id,
      text: resMessage.text,
      fileIds: resMessage.fileIds
    }
  } 

  const endpoint = `${CHAT_SERVICE_BASE_URL}/api/v1/chat/${new mongoose.Types.ObjectId()}`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as ChatResponse;

  if (payload.status === "error") {
    return null
  }

  return {
    type: "Response",
    id: new mongoose.Types.ObjectId().toString(),
    text: payload.message!.text,
    fileIds: payload.message!.file_ids
  }
}