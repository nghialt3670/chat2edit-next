import { format } from "date-fns";

import User from "@/models/User";
import { Divider } from "@mui/material";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";
import IConversation from "@/types/Conversation";

import ConvPreview from "./conv-preview";
import connectToDatabase from "@/lib/mongo";

export default async function ChatHistory() {
  const { userId } = auth();

  if (!userId) {
    return (
      <p className="size-full flex justify-center items-center w-inherit overflow-hidden text-nowrap opacity-60">
        Log in to view chat history
      </p>
    );
  }

  await connectToDatabase();

  let user = await User.findOne({ clerkId: userId });
  if (!user) user = await User.create({ clerkId: userId });

  const conversations = (
    await Conversation.find({ userId: user.id })
  ).reverse();

  const groupedConvs: Record<string, IConversation[]> = {};
  conversations.forEach((conv) => {
    const date = format(new Date(conv.lastModified), "yyyy-MM-dd");
    if (!groupedConvs[date]) groupedConvs[date] = [];
    groupedConvs[date].push({
      id: conv.id,
      title: conv.title,
      lastModified: conv.lastModified,
    });
  });

  return (
    <ul
      className={`h-full flex flex-col w-inherit overflow-x-hidden overflow-y-scroll`}
    >
      {groupedConvs &&
        Object.keys(groupedConvs).map((date) => (
          <div key={date}>
            <Divider
              variant="middle"
              sx={{
                width: "inherit",
                overflow: "hidden",
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              <p className="text-xs opacity-50">
                {format(new Date(date), "M/d/yyyy")}
              </p>
            </Divider>
            {groupedConvs[date].map((conv) => (
              <ConvPreview key={conv.id} id={conv.id} title={conv.title} />
            ))}
          </div>
        ))}
    </ul>
  );
}
