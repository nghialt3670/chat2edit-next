import mongoose from "mongoose";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import connectToDatabase from "@/lib/mongo";
import { deleteFilesFromGridFS } from "@/lib/gridfs";
import { NextRequest, NextResponse } from "next/server";
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from "@/config/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    await connectToDatabase();

    const { chatId } = params;

    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ status: 401 });

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

    return NextResponse.json({});
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
