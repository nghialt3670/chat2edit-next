import User from "@/models/User";
import Message from "@/models/Message";
import IMessage from "@/types/Message";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import MessageList from "@/components/message-list";

export default async function SharedConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { userId } = auth();

  if (!userId) notFound();

  await connectToDatabase();

  const user = await User.findOne({ clerkId: userId });
  if (!user) notFound();

  const conv = await Conversation.findOne({ shareId: id });
  if (!conv) notFound();

  const messages: IMessage[] = (
    await Message.find({ conversationId: conv.id })
  ).map((msg, idx) => ({
    id: msg.id,
    type: idx % 2 == 0 ? "Request" : "Response",
    text: msg.text,
    fileIds: msg.fileIds.map((id) => String(id)),
  }));

  return <MessageList status="Idle" messages={messages} />;
}
