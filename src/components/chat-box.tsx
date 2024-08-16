"use client";

import { useEffect, useOptimistic, useState } from "react";

import Message from "@/types/Message";
import useFileStore from "@/stores/file-store";
import { postMessage } from "@/actions/postMessage";
import { sendMessage } from "@/actions/sendMessage";
import { usePathname, useRouter } from "next/navigation";

import MessageList from "./message-list";
import MessageForm from "./message-form";

export default function ChatBox({ messages }: { messages: Message[] }) {
  const [opMessages, setOpMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"Idle" | "Responding" | "Error">("Idle");
  const pathname = usePathname();
  const fileStore = useFileStore();

  useEffect(() => {
    if (messages.length > opMessages.length) setOpMessages(messages);
  }, [messages]);

  const handleFormSubmit = async (message: Message) => {
    setOpMessages((prev) => [...prev, message]);
    setTimeout(() => setStatus("Responding"), 500);

    const formData = new FormData();
    if (pathname.startsWith("/chat/"))
      formData.set("conversationId", pathname.split("/").pop()!);
    formData.set("text", message.text);
    const files = fileStore.getFiles(message.fileIds);
    files.forEach((file) => formData.set("files", file!));

    const { conversationId, fileIds } = await postMessage(formData);

    fileStore.updateIds(message.fileIds, fileIds);
    window.history.replaceState({}, "", `/chat/${conversationId}`);

    const resMessage = await sendMessage({
      conversationId,
      text: message.text,
      fileIds,
    });

    if (resMessage) {
      setStatus("Idle");
      setOpMessages((prev) => [...prev, resMessage]);
    } else {
      setStatus("Error");
    }
  };

  return (
    <div className="absolute flex flex-col w-full h-[calc(100vh-3.5rem)]">
      <MessageList status={status} messages={opMessages} />
      <div className="flex justify-center items-center h-28 mt-auto">
        <MessageForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
