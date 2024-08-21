import type { Metadata } from "next";

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
    <main className="flex flex-row size-full">
      <ChatSidebar />
      <div className="w-full flex flex-col">
        {children}
        <div className="relative flex justify-center items-center h-40 mt-auto">
          <MessageForm />
        </div>
      </div>
    </main>
  );
}
