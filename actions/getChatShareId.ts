"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function getChatShareId(
  chatId: string,
): Promise<string | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    const chat = await prisma.chat.findFirstOrThrow({
      where: { id: chatId, userId: session.user.id },
    });

    return chat.shareId;
  } catch (error) {
    return null;
  }
}
