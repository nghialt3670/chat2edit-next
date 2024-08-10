"use client";

import Message from "@/types/Message";
import { useEffect, useOptimistic, useState } from "react";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import useFileStore from "@/stores/FileStore";
import { postMessage } from "@/actions/postMessage";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/actions/sendMessage";

export default function ChatBox({
  conversationId,
  messages,
}: {
  conversationId: string;
  status: "Idle" | "Responding" | "Error";
  messages: Message[];
}) {
  const [opMessages, setOpMessages] = useState<Message[]>([]);
  const [replyFileIds, setReplyFileIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"Idle" | "Responding" | "Error">("Idle");
  const fileStore = useFileStore();
  const router = useRouter();

  useEffect(() => {
    if (messages.length > opMessages.length) setOpMessages(messages);
  }, [messages]);

  const handleFormSubmit = async (message: Message) => {
    setReplyFileIds([]);
    setOpMessages((prev) => [...prev, message]);
    setTimeout(() => setStatus("Responding"), 500);
    const { text, fileIds } = message;
    const files = fileStore.getFiles(fileIds);
    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("text", text);
    files.forEach((file) => formData.set("files", file!));
    const postMessageResponse = await postMessage(formData);
    fileStore.updateIds(fileIds, postMessageResponse.fileIds);
    if (!conversationId)
      router.push(`/chat/conversations/${postMessageResponse.conversationId}`);
    const resMessage = await sendMessage({
      conversationId: postMessageResponse.conversationId,
      text,
      fileIds: postMessageResponse.fileIds,
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
