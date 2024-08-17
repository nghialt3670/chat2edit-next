"use client";

import { useEffect, useRef } from "react";

import Message from "@/types/Message";
import MessageNode from "@/components/message";
import useMessageListStore from "@/stores/message-list-store";
import useConvStore from "@/stores/conv-store";
import useFileStore from "@/stores/file-store";
import resendMessage from "@/actions/resendMessage";
import { useRouter } from "next/navigation";

export default function MessageList({
  conversationId,
  status,
  messages,
}: {
  conversationId: string | null;
  status?: "isIdle" | "isResponding" | "isError";
  messages?: Message[];
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { setRef } = useMessageListStore();
  const router = useRouter();
  const convStore = useConvStore();
  const fileStore = useFileStore();

  useEffect(() => {
    if (conversationId === null) router.refresh();
  }, [conversationId]);

  useEffect(() => {
    if (conversationId != convStore.id) {
      if (conversationId === null) convStore.setMessages([]);
      else convStore.setMessages(messages!);
      convStore.setId(conversationId)
    }
  }, [messages, conversationId]);

  useEffect(() => {
    if (status) convStore.setStatus(status);
  }, [status]);

  useEffect(() => {
    setRef(ref);
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  const handleRetry = async () => {
    convStore.setStatus("isResponding");

    const conversationId = convStore.id;
    if (!conversationId) return;
    const resMessage = await resendMessage(conversationId);

    if (resMessage) {
      convStore.addMessage(resMessage);
      convStore.setStatus("isIdle");
    } else convStore.setStatus("isError");
  };

  if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;

  return (
    <ul
      className="size-full flex flex-col items-center overflow-y-scroll scroll-smooth"
      ref={ref}
    >
      {convStore.messages.map((msg) => (
        <MessageNode key={msg.id} message={msg} />
      ))}
      {convStore.status === "isResponding" && (
        <MessageNode key={crypto.randomUUID()} message={undefined} />
      )}
      {convStore.status === "isError" && (
        <MessageNode
          key={crypto.randomUUID()}
          message={null}
          onRetry={handleRetry}
        />
      )}
    </ul>
  );
}
