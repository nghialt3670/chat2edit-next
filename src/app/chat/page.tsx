"use client";

import Message from "@/components/Message";
import MessageList from "@/components/MessageList";
import useConversationStore from "@/stores/ConversationStore";
import React, { useEffect } from "react";

export default function ChatPage() {
  const convStore = useConversationStore();
  useEffect(() => {
    convStore.setId(null)
    convStore.setMessages([])
  }, [])
  return (
    <div>
      <MessageList />
    </div>
  );
}
