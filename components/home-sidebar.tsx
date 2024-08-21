"use client";

import { BotMessageSquare, Edit } from "lucide-react";

import Sidebar from "@/components/sidebar";
import SidebarNavigate from "@/components/sidebar-navigate";

export default function HomeSidebar() {
  return (
    <Sidebar>
      <nav className="p-2">
        <SidebarNavigate
          path="/chat"
          icon={<BotMessageSquare strokeWidth={2} size={20} />}
          text="Chat"
        />
        <SidebarNavigate
          path="/edit"
          icon={<Edit strokeWidth={2} size={20} />}
          text="Edit"
        />
      </nav>
    </Sidebar>
  );
}
