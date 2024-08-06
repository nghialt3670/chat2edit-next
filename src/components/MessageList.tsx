"use client";

import { useEffect } from "react";

import Message from "@/types/Message";
import MessageNode from "@/components/Message";
import useConversationStore from "@/stores/ConversationStore";

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
  }, []);

  return (
    <div className="size-full flex flex-col items-center space-y-6 overflow-y-scroll">
      {convStore.messages.map((message) => (
        <MessageNode key={message.text} {...message} />
      ))}
      {convStore.status === "Requesting" && (
        <MessageNode type="Request" isResponding />
      )}
      {convStore.status === "Responding" && (
        <MessageNode type="Response" isResponding />
      )}
    </div>
  );
}
