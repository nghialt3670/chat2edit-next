import type { Metadata } from "next";

import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import ConvBar from "@/components/conv-bar/ConvBar";
import ConvList from "@/components/conv-bar/ConvList";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { Menu, SquarePlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Chat with AI",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col h-full bg-[#BDCDD6]">
      <ConvBar>
        <ConvList />
      </ConvBar>
      <AppBar>
        <IconButton>
            <Menu />
          </IconButton>
          <Link href="/chat">
            <IconButton>
              <SquarePlus />
            </IconButton>
          </Link>
      </AppBar>
      <main className="flex flex-col h-[calc(100%-5rem)]">{children}</main>
      <Footer />
    </div>
  );
}
