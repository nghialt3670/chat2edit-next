import { Edit, Home, SquarePlus } from "lucide-react";

import Sidebar from "@/components/sidebar";
import ChatHistory from "@/components/chat-history";
import { Separator } from "@/components/ui/separator";
import SidebarNavigate from "@/components/sidebar-navigate";

export default function ChatSidebar() {
  return (
    <Sidebar>
      <div className="flex flex-col size-full p-2">
        <nav>
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
        </nav>
        <ChatHistory />
      </div>
    </Sidebar>
  );
}
