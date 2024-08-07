"use client";

import { useEffect, useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const convStore = useConversationStore();

  useEffect(() => {
    if (conversationId) convStore.setId(conversationId);
    if (messages) convStore.setMessages(messages);
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;

  return (
    <div
      className="size-full flex flex-col items-center overflow-y-scroll flex-1"
      ref={ref}
    >
      {convStore.messages.map((message) => (
        <MessageNode key={message.id} {...message} />
      ))}
      {convStore.status === "Responding" && (
        <MessageNode type="Response" isResponding />
      )}
    </div>
  );
}
