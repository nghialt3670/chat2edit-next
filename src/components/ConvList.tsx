import { format } from "date-fns";

import Link from "next/link";
import User from "@/models/User";
import { Divider } from "@mui/material";
import connectToDatabase from "@/lib/mongo";
import { auth } from "@clerk/nextjs/server";
import Conversation from "@/models/Conversation";

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
    <div className="flex flex-col w-inherit">
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
            <Link key={conv.id} href={`/chat/conversations/${conv.id}`}>
              <div className="flex h-12 items-center opacity-80 hover:bg-[#7094a8] text-nowrap overflow-hidden">
                <span className="truncate p-2">{conv.title}</span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
