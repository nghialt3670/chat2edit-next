import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { notFound } from "next/navigation";
import React from "react";
import MessageList from "@/components/MessageList";
import IMessage from "@/types/Message"

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const conversation = await Conversation.findById(id);

  if (!conversation) {
    notFound();
  }

  const messages = (await Message.find({ conversationId: id }));

  const imessages: IMessage[] = messages.map((message, idx) => ({
    id: message.id.toString(),
    type: idx % 2 === 0 ? "Request" : "Response",
    text: message.text,
    fileIds: message.fileIds
  }))

  return (
    <MessageList
      conversationId={id}
      messages={imessages}
    />
  );
}
