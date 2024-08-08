import User from "@/models/User";
import Message from "@/models/Message";
import IMessage from "@/types/Message";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import TempMessage from "@/models/TempMessage";
import Conversation from "@/models/Conversation";
import MessageList from "@/components/MessageList";
import TempConversation from "@/models/TempConversation";
import { sendMessage } from "@/actions/sendMessage";
import SendMessageRequest from "@/types/SendMessageRequest";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { userId } = auth();

  let status: "Idle" | "Responding" | "Error" = "Idle";
  let messages: IMessage[];

  if (userId) {
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const conv = await Conversation.findById(id);
    if (!conv) notFound();
    if (String(conv.userId) !== user.id)
      throw new Error(
        "User does not have permission to access this conversation",
      );

    messages = (await Message.find({ conversationId: id })).map((msg, idx) => ({
      id: msg.id,
      type: idx % 2 == 0 ? "Request" : "Response",
      text: msg.text,
      fileIds: msg.fileIds.map((id) => String(id)),
    }));

    if (conv.isError) status = "Error";
  } else {
    const conv = await TempConversation.findById(id);
    if (!conv) notFound();

    messages = (await TempMessage.find({ conversationId: id })).map(
      (msg, idx) => ({
        id: msg.id,
        type: idx % 2 == 0 ? "Request" : "Response",
        text: msg.text,
        fileIds: msg.fileIds.map((id) => String(id)),
      }),
    );

    if (conv.isError) status = "Error";
  }

  if (status !== "Error" && messages.length % 2 !== 0) {
    status = "Responding";
  }

  return (
    <MessageList conversationId={id} status={status} messages={messages} />
  );
}
