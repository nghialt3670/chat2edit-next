"use server";

import mongoose from "mongoose";
import { nanoid } from "nanoid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import connectToDatabase from "@/lib/mongo";
import ChatResponse from "@/types/ChatResponse";
import { uploadFilesToGridFS } from "@/lib/gridfs";
import SendMessageResponse from "@/types/SendMessageResponse";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";
import { revalidatePath } from "next/cache";

export default async function sendMessage(
  formData: FormData,
): Promise<SendMessageResponse> {
  const chatId = formData.get("chatId") as string | undefined;
  const text = formData.get("text") as string;
  const files = (formData.getAll("files") as File[]) || [];
  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;

  let response: SendMessageResponse = { savedRequestMessage: false };

  try {
    await connectToDatabase();

    if (!text) throw new Error("Message's text field is required");

    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    let chat;
    if (chatId) {
      chat = await prisma.chat.findFirstOrThrow({
        where: { id: chatId, userId: session.user.id },
      });
    } else {
      chat = await prisma.chat.create({
        data: { userId: session.user.id },
      });
      response.newChatId = chat.id;
    }

    if (chat.isError)
      throw new Error("Can not send new message before resolve current error");

    const connection = mongoose.connection;
    const fileObjIds = await uploadFilesToGridFS(files, connection, bucketName);
    const fileIds = fileObjIds.map((id) => id.toString());
    const reqMessage = await prisma.message.create({
      data: { chatId: chat.id, text, fileIds },
    });
    response.savedRequestMessage = true;

    const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
    const reqBody = JSON.stringify({
      conversation_id: chat.id,
      text,
      file_ids: fileIds,
      bucket_name: bucketName,
    });
    const chatResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    });

    if (!chatResponse.ok) throw new Error("Chat service error");

    const payload = (await chatResponse.json()) as ChatResponse;
    const resMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        text: payload.text,
        fileIds: payload.file_ids,
      },
    });
    response.responseMessage = resMessage;

    const title = resMessage ? resMessage.text : reqMessage.text;
    const lastMessageId = resMessage ? resMessage.id : reqMessage.id;

    await prisma.chat.update({
      where: { id: chat.id },
      data: { title, lastMessageId },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  } finally {
    revalidatePath("/chat");
    return response;
  }
}
