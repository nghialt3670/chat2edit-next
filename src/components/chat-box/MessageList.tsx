"use client";

import { useRef } from "react";

import Message from "@/types/Message";
import MessageNode from "@/components/chat-box/Message";

export default function MessageList({
  status,
  messages,
  onFileReply,
}: {
  status: "Idle" | "Responding" | "Error";
  messages: Message[];
  onFileReply?: (fileId: string) => void;
}) {
  const ref = useRef<HTMLUListElement>(null);
  if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;

  return (
    <ul
      className="size-full flex flex-col items-center overflow-y-scroll scroll-smooth"
      ref={ref}
    >
      {messages.map((msg) => (
        <MessageNode key={msg.id} {...msg} onFileReply={onFileReply} />
      ))}
      {status === "Responding" && (
        <MessageNode type="Response" isResponding onFileReply={onFileReply} />
      )}
    </ul>
  );
}
