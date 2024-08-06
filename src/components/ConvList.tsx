import { format } from "date-fns";

import User from "@/models/User";
import { Divider } from "@mui/material";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";

import ConvItem from "./ConvItem";

async function getGroupedConversations() {
  await connectToDatabase();

  const { userId } = auth();
  const user = await User.findOne({ clerkId: userId });

  // Get the conversations from new to old
  const conversations = (await Conversation.find({ userId: user?.id })).sort(
    (conv1, conv2) => conv2.lastModified - conv1.lastModified,
  );

  // Group conversations by date
  const grouped: { [key: string]: typeof conversations } = {};
  conversations.forEach((conv) => {
    const date = format(new Date(conv.lastModified), "yyyy-MM-dd");
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(conv);
  });

  return grouped;
}

export default async function ConvList() {
  const groupedConversations = await getGroupedConversations();

  return (
    <div className="flex flex-col w-inherit overflow-x-hidden overflow-y-scrol h-full">
      {Object.keys(groupedConversations).map((date) => (
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
          {groupedConversations[date].map((conv) => (
            <ConvItem key={conv.id} convId={conv.id} title={conv.title} />
          ))}
        </div>
      ))}
    </div>
  );
}
