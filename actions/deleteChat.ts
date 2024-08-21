"use server";

import mongoose from "mongoose";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import connectToDatabase from "@/lib/mongo";
import { revalidatePath } from "next/cache";
import { deleteFilesFromGridFS } from "@/lib/gridfs";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

export default async function deletechat(chatId: string) {
  try {
    await connectToDatabase();

    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const messages = await prisma.message.findMany({
      where: { chatId },
      select: { fileIds: true },
    });

    await prisma.chat.delete({
      where: { id: chatId, userId: session.user.id },
    });

    try {
      const fileIds = messages.flatMap((message) =>
        message.fileIds.map(
          (fileId) => new mongoose.Types.ObjectId(String(fileId)),
        ),
      );
      const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME;
      await deleteFilesFromGridFS(fileIds, mongoose.connection, bucketName);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }

    revalidatePath("/chat");
    return true;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return false;
  }
}
