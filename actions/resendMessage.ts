"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import ChatResponse from "@/types/ChatResponse";
import ResponseMessage from "@/types/ResponseMessage";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

export default async function resendMessage(
  chatId: string,
): Promise<ResponseMessage | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const chat = await prisma.chat.findFirstOrThrow({
      where: { id: chatId, userId: session.user.id },
    });

    if (!chat.isError) throw new Error("Can only resend message in error chat");
    if (!chat.lastMessageId) throw new Error("Request message not found");

    const reqMessage = await prisma.message.findFirstOrThrow({
      where: { id: chat.lastMessageId },
    });
    const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
    const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`;
    const reqBody = JSON.stringify({
      conversation_id: chatId,
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

    if (!response.ok) throw new Error("Chat service error");

    const payload = (await response.json()) as ChatResponse;

    const resMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        text: payload.text,
        fileIds: payload.file_ids,
      },
    });

    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        title: resMessage.text,
        lastMessageId: resMessage.id,
      },
    });

    return {
      text: payload.text,
      fileIds: payload.file_ids,
    };
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return null;
  } finally {
    revalidatePath("/chat");
  }
}
