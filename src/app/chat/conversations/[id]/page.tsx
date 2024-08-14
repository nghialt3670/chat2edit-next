import User from "@/models/User";
import Message from "@/models/Message";
import IMessage from "@/types/Message";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import ChatBox from "@/components/chat-box/ChatBox";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { userId } = auth();

  if (!userId) notFound();

  await connectToDatabase();

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new Error("User not found");

  const conv = await Conversation.findById(id);
  if (!conv || String(conv.userId) !== user.id) notFound();

  const messages: IMessage[] = (await Message.find({ conversationId: id })).map(
    (msg, idx) => ({
      id: msg.id,
      type: idx % 2 == 0 ? "Request" : "Response",
      text: msg.text,
      fileIds: msg.fileIds.map((id) => String(id)),
    }),
  );

  return <ChatBox messages={messages} />;
}
