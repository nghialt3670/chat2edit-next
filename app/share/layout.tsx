import type { Metadata } from "next";

import HomeSidebar from "@/components/home-sidebar";

export const metadata: Metadata = {
  title: "Shared Chat",
};

export default function SharedChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-row size-full">
      <HomeSidebar />
      {children}
    </main>
  );
}
