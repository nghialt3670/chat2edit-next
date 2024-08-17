import type { Metadata } from "next";

import { Divider } from "@mui/material";
import { Edit, Home, SquarePlus } from "lucide-react";
import Sidebar from "@/components/sidebar";
import NavButton from "@/components/nav-button";
import ChatHistory from "@/components/chat-history";
import MessageForm from "@/components/message-form";
import ChatSidebar from "@/components/chat-sidebar";

export const metadata: Metadata = {
  title: "Chat with AI",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative w-full h-[calc(100vh-3.5rem)]">
      <ChatSidebar />
      <div className="absolute h-[calc(100vh-3.5rem)] w-full flex flex-col">
        {children}
        <div className="flex justify-center items-center h-28 mt-auto">
          <MessageForm />
        </div>
      </div>
    </main>
  );
}
