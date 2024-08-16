import type { Metadata } from "next";

import { Divider, IconButton } from "@mui/material";
import Link from "next/link";
import { Edit, Home, Menu, SquarePlus } from "lucide-react";
import Sidebar from "@/components/sidebar";
import NavButton from "@/components/nav-button";
import ChatHistory from "@/components/chat-history";
import { Separator } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Chat with AI",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative size-full z-10">
      <Sidebar>
        <nav className="m-2">
          <NavButton
            path="/"
            icon={<Home strokeWidth={2} size={20} />}
            text="Home"
          />
          <NavButton
            path="/edit"
            icon={<Edit strokeWidth={2} size={20} />}
            text="Edit"
          />
          <Divider
            sx={{ marginTop: 1, marginBottom: 1 }}
            orientation="horizontal"
          />
          <NavButton
            path="/chat"
            icon={<SquarePlus strokeWidth={2} size={20} />}
            text="New Conversation"
          />
        </nav>
        <ChatHistory />
      </Sidebar>
      {children}
    </main>
  );
}
