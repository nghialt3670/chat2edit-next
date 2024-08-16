import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Conversation",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col h-full bg-[#BDCDD6]">
      <main className="flex flex-col h-[calc(100%-5rem)]">{children}</main>
    </div>
  );
}
