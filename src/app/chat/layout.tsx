import ChatForm from "@/components/ChatForm";
import ConvBar from "@/components/ConvBar";
import ConvContainer from "@/components/ConvContainer";
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
        <ConvContainer />
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
