"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function delelteChatShareId(
  chatId: string,
): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthenticated");

    await prisma.chat.update({
      where: { id: chatId, userId: session.user.id },
      data: {
        shareId: null,
      },
    });

    return true;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return false;
  }
}
