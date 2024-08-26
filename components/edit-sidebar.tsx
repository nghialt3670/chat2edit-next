"use client";

import { BotMessageSquare, Home, SquarePlus } from "lucide-react";

import { Divider } from "@mui/material";
import Sidebar from "@/components/sidebar";
import SidebarNavigate from "@/components/sidebar-navigate";

export default function EditSidebar() {
  return (
    <Sidebar>
      <nav>
        <SidebarNavigate
          path="/"
          icon={<Home strokeWidth={2} size={20} />}
          text="Home"
        />
        <SidebarNavigate
          path="/chat"
          icon={<BotMessageSquare strokeWidth={2} size={20} />}
          text="Chat"
        />
        <Divider
          sx={{ marginTop: 1, marginBottom: 1 }}
          orientation="horizontal"
        />
        <SidebarNavigate
          path="/edit/canvas"
          icon={<SquarePlus strokeWidth={2} size={20} />}
          text="New canvas"
        />
      </nav>
    </Sidebar>
  );
}
