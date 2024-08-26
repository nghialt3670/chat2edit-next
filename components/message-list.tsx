"use client";

import { useEffect, useRef } from "react";

import { nanoid } from "nanoid";

import Message from "@/types/Message";
import useChatStore from "@/stores/chat-store";
import BotMessage from "@/components/bot-message";
import UserMessage from "@/components/user-message";

export default function MessageList({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const chatStore = useChatStore();

  
  useEffect(() => {
    chatStore.setMessages(messages);
    if (messages.length % 2 !== 0) chatStore.setStatus("response_error");
    else chatStore.setStatus("idle");
  }, [messages]);

  if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;

  return (
    <ul
      className="size-full flex flex-col items-center overflow-y-scroll scroll-smooth"
      ref={ref}
    >
      {chatStore.messages.map((msg, idx) =>
        idx % 2 === 0 ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <BotMessage key={msg.id} message={msg} />
        ),
      )}
      {chatStore.status === "responding" && (
        <BotMessage key={nanoid()} message={undefined} />
      )}
      {chatStore.status === "response_error" && (
        <BotMessage key={nanoid()} message={null} />
      )}
    </ul>
  );
}
