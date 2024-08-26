"use client";

import { useEffect } from "react";

import { format } from "date-fns";

import Chat from "@/types/Chat";
import ChatHistoryItem from "@/components/chat-history-item";
import useChatHistoryStore from "@/stores/chat-history-store";

export default function ChatHistory({ chats }: { chats: Chat[] }) {
  const chatHistoryStore = useChatHistoryStore();

  useEffect(() => {
    chatHistoryStore.setChats(chats);
  }, [chats]);

  const groupedChats: Record<string, Chat[]> = {};
  chatHistoryStore.chats.forEach((chat) => {
    const date = format(new Date(chat.updatedAt), "yyyy-MM-dd");
    if (!groupedChats[date]) groupedChats[date] = [];
    groupedChats[date].push({
      id: chat.id,
      title: chat.title,
      updatedAt: chat.updatedAt,
    });
  });

  return (
    <ul className="w-full flex flex-col">
      {chatHistoryStore.chats.map((chat) => (
        <ChatHistoryItem key={chat.id} chatId={chat.id} title={chat.title} />
      ))}
    </ul>
  );
}
