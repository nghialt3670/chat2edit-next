"use server";

import { v4 } from "uuid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function createChatShareId(
  chatId: string,
): Promise<string | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const shareId = v4();
    await prisma.chat.update({
      where: { id: chatId, userId: session.user.id },
      data: {
        shareId,
      },
    });

    return shareId;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return null;
  }
}
