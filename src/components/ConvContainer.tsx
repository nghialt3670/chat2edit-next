import connectToDatabase from "@/lib/mongo";
import Conversation from "@/models/Conversation";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

export default async function ConvContainer() {
  await connectToDatabase();
  const { userId } = auth();
  const user = await User.findOne({ clerkId: userId });
  const conversations = (await Conversation.find({ userId: user?.id })).reverse();
  return (
    <div className="flex flex-col p-2 space-y-2 w-inherit">
      {conversations.map((conv) => (
        <Link key={conv.id} href={`/chat/conversations/${conv.id}`}>
          <div className="items-center p-2 rounded hover:bg-gray-300 text-nowrap overflow-hidden">
            <span className="truncate">{conv.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
