import { format } from "date-fns";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Divider } from "@mui/material";
import Chat from "@/types/Chat";
import ChatPreview from "@/components/chat-preview";

export default async function ChatHistory() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="size-full flex justify-center items-center">
        <span>Log in to view chat history</span>
      </div>
    );
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const groupedChats: Record<string, Chat[]> = {};
  chats.forEach((conv) => {
    const date = format(new Date(conv.updatedAt), "yyyy-MM-dd");
    if (!groupedChats[date]) groupedChats[date] = [];
    groupedChats[date].push({
      id: conv.id,
      title: conv.title,
      updatedAt: conv.updatedAt,
    });
  });

  return (
    <ul className="max-h-[700px] w-full flex flex-col overflow-y-auto">
      {groupedChats &&
        Object.keys(groupedChats).map((date) => (
          <div key={date}>
            <Divider
              variant="middle"
              sx={{
                width: "inherit",
                overflow: "hidden",
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              <p className="text-xs opacity-50">
                {format(new Date(date), "M/d/yyyy")}
              </p>
            </Divider>
            {groupedChats[date].map((conv) => (
              <ChatPreview key={conv.id} id={conv.id} title={conv.title} />
            ))}
          </div>
        ))}
    </ul>
  );
}
