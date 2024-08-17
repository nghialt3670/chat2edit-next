import User from "@/models/User";
import Message from "@/models/Message";
import IMessage from "@/types/Message";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import MessageList from "@/components/message-list";

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

  let status: "isError" | "isIdle" | "isResponding";
  if (conv.isError) status = "isError";
  else if (messages.length % 2 !== 0) status = "isResponding";
  else status = "isIdle";

  return (
    <MessageList conversationId={id} status={status} messages={messages} />
  );
}
