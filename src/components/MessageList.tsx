"use client";

import { useEffect, useRef } from "react";

import Message from "@/types/Message";
import MessageNode from "@/components/Message";
import SendMessageRequest from "@/types/SendMessageRequest";
import { useUser } from "@clerk/nextjs";
import { sendMessage } from "@/actions/sendMessage";
import { sendTempMessage } from "@/actions/sendTempMessage";
import useConvStore from "@/stores/ConvStore";

export default function MessageList({
  conversationId,
  status,
  messages,
}: {
  conversationId: string;
  status: "Idle" | "Responding" | "Error"
  messages: Message[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const convStore = useConvStore();

  useEffect(() => {
    if (conversationId) convStore.setId(conversationId);
    if (status) convStore.setStatus(status)
    if (messages) convStore.setMessages(messages);
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div
      className="size-full flex flex-col items-center overflow-y-scroll"
      ref={ref}
    >
      {convStore.messages.map((message) => (
        <MessageNode key={message.id} {...message} />
      ))}
      {convStore.status === "Responding" && <MessageNode type="Response" isResponding />}
    </div>
  );
}
