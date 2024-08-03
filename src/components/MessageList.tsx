"use client"

import useConversationStore from "@/stores/ConversationStore";
import MessageNode from "@/components/Message";
import { useEffect } from "react";
import Message from "@/types/Message";

export default function MessageList({
  conversationId,
  messages,
}: {
  conversationId?: string;
  messages?: Message[];
}) {
  const convStore = useConversationStore();

  useEffect(() => {
    if (conversationId) convStore.setId(conversationId);
    if (messages) convStore.setMessages(messages);
  }, [])

  return (
    <div className="size-full flex flex-col items-center space-y-6">
      {convStore.messages.map((message) => (
        <MessageNode key={message.text} {...message} />
      ))}
    </div>
  );
}
