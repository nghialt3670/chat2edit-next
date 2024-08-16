"use client";

import { useEffect, useRef } from "react";

import Message from "@/types/Message";
import MessageNode from "@/components/message";
import useMessageListStore from "@/stores/message-list-store";
import ScrollToBottomButton from "./scroll-to-bottom-button";

export default function MessageList({
  status,
  messages,
}: {
  status: "Idle" | "Responding" | "Error";
  messages: Message[];
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { setRef } = useMessageListStore();

  useEffect(() => {
    setRef(ref);
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;

  const showScrollButton =
    ref.current &&
    Math.abs(
      ref.current.scrollHeight -
        ref.current.scrollTop -
        ref.current.clientHeight,
    ) < 10;
  return (
    <ul
      className="size-full flex flex-col items-center overflow-y-scroll scroll-smooth"
      ref={ref}
    >
      {messages.map((msg) => (
        <MessageNode key={msg.id} type={msg.type} message={msg} />
      ))}
      {status === "Responding" && (
        <MessageNode type="Response" message={undefined} />
      )}
      {status === "Error" && <MessageNode type="Response" message={null} />}
      {/* {showScrollButton && <ScrollToBottomButton className="absolute bottom-24 z-30" />} */}
    </ul>
  );
}
