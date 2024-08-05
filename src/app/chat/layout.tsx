import ChatForm from "@/components/ChatForm";
import ConvBar from "@/components/ConvBar";
import ConvList from "@/components/ConvList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row size-full">
      <ConvBar>
        <ConvList />
      </ConvBar>
      <div className="flex flex-col size-full">
        {children}
        <div className="relative flex justify-center items-center h-20 mt-auto">
          <ChatForm />
        </div>
      </div>
    </div>
  );
}
