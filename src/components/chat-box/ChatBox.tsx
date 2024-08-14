"use client";

import { useEffect, useOptimistic, useState } from "react";

import Message from "@/types/Message";
import useFileStore from "@/stores/FileStore";
import { postMessage } from "@/actions/postMessage";
import { sendMessage } from "@/actions/sendMessage";
import { usePathname, useRouter } from "next/navigation";

import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

export default function ChatBox({ messages }: { messages: Message[] }) {
  const [opMessages, setOpMessages] = useState<Message[]>([]);
  const [replyFileIds, setReplyFileIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"Idle" | "Responding" | "Error">("Idle");
  const pathname = usePathname();
  const fileStore = useFileStore();
  const router = useRouter();

  useEffect(() => {
    if (messages.length > opMessages.length) setOpMessages(messages);
  }, [messages]);

  const handleFormSubmit = async (message: Message) => {
    setReplyFileIds([]);
    setOpMessages((prev) => [...prev, message]);
    setTimeout(() => setStatus("Responding"), 500);

    const formData = new FormData();
    if (pathname.startsWith("/chat/conversations/"))
      formData.set("conversationId", pathname.split("/").pop()!);
    formData.set("text", message.text);
    const files = fileStore.getFiles(message.fileIds);
    files.forEach((file) => formData.set("files", file!));

    const { conversationId, fileIds } = await postMessage(formData);

    fileStore.updateIds(message.fileIds, fileIds);
    window.history.replaceState({}, '', `/chat/conversations/${conversationId}`)

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
    <>
      <MessageList
        status={status}
        messages={opMessages}
        onFileReply={(fileId) => setReplyFileIds((prev) => [...prev, fileId])}
      />
      <div className="flex justify-center items-center h-20 mt-auto">
        <MessageForm replyFileIds={replyFileIds} onSubmit={handleFormSubmit} />
      </div>
    </>
  );
}
