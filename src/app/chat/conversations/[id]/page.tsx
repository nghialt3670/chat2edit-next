import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { notFound } from "next/navigation";
import React from "react";
import MessageList from "@/components/MessageList";
import IMessage from "@/types/Message";
import TempConversation from "@/models/TempConversation";
import TempMessage from "@/models/TempMessage";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const conv = await Conversation.findById(id);
  let fetchedMessages;
  if (!conv) {
    const tempConv = await TempConversation.findById(id);
    if (!tempConv) notFound();
    fetchedMessages = await TempMessage.find({ conversationId: id });
  } else {
    fetchedMessages = await Message.find({ conversationId: id });
  }

  const messages: IMessage[] = fetchedMessages.map((message, idx) => ({
    id: message.id.toString(),
    type: idx % 2 === 0 ? "Request" : "Response",
    text: message.text,
    fileIds: message.fileIds.map((fileId) => String(fileId)),
  }));

  return <MessageList conversationId={id} messages={messages} />;
}
