import { nanoid } from "nanoid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import IMessage from "@/types/Message";
import { notFound } from "next/navigation";
import MessageList from "@/components/message-list";

export default async function SharedChatPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const chat = await prisma.chat.findFirst({
    where: {
      shareId: params.id,
    },
    include: {
      messages: true,
    },
  });

  if (!chat) notFound();

  const messages: IMessage[] = chat.messages.map((msg) => ({
    id: nanoid(),
    text: msg.text,
    fileIds: msg.fileIds,
  }));

  return <MessageList messages={messages} />;
}
