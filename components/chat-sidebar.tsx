import { Edit, Home, SquarePlus } from "lucide-react";

import Sidebar from "@/components/sidebar";
import ChatHistory from "@/components/chat-history";
import { Separator } from "@/components/ui/separator";
import SidebarNavigate from "@/components/sidebar-navigate";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function ChatSidebar() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <Sidebar>
        <SidebarNavigate
          path="/"
          icon={<Home strokeWidth={2} size={20} />}
          text="Home"
        />
        <SidebarNavigate
          path="/edit"
          icon={<Edit strokeWidth={2} size={20} />}
          text="Edit"
        />
        <Separator className="my-2" />
        <div className="size-full flex justify-center items-center">
          <span>Log in to view chat history</span>
        </div>
      </Sidebar>
    );
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <Sidebar>
      <SidebarNavigate
        path="/"
        icon={<Home strokeWidth={2} size={20} />}
        text="Home"
      />
      <SidebarNavigate
        path="/edit"
        icon={<Edit strokeWidth={2} size={20} />}
        text="Edit"
      />
      <Separator className="my-2" />
      <SidebarNavigate
        path="/chat"
        icon={<SquarePlus strokeWidth={2} size={20} />}
        text="New chat"
      />
      <Separator className="my-2" />
      <ChatHistory chats={chats} />
    </Sidebar>
  );
}
