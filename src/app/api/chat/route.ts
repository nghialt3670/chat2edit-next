import { CHAT_SERVICE_BASE_URL } from "@/config/endpoints";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

interface MessageResponse {
  text: string;
  file_ids: string[];
}

interface ChatResponse {
  status: "success" | "error";
  req_file_ids: string[];
  message?: MessageResponse;
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { userId } = auth();
  let user = await User.findOne({ clerkId: userId });
  if (!user) {
    user = await User.create({ clerkId: userId });
  }

  const conversation = await Conversation.create({ userId: user.id });
  const formData = await req.formData();
  const sendTime = Date.now();

  const endpoint = `${CHAT_SERVICE_BASE_URL}/api/v1/chat/${conversation.id}`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as ChatResponse;

  if (payload.status === "error") {
    return NextResponse.json({
      status: "error",
      redirectURL: `chat/conversations/${conversation.id}`,
    });
  }

  await Message.create({
    conversationId: conversation.id,
    text: formData.get("text"),
    fileIds: payload.req_file_ids,
    createdAt: sendTime,
  });

  const resMessage = payload.message!;

  await Message.create({
    conversationId: conversation.id,
    text: resMessage.text,
    fileIds: resMessage.file_ids,
  });

  await conversation.updateOne({ title: resMessage.text });

  return NextResponse.json({
    status: "success",
    redirectURL: `chat/conversations/${conversation.id}`,
  });
}
