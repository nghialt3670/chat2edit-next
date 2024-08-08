import AppBar from "@/components/AppBar";
import ChatForm from "@/components/ChatForm";
import ConvBar from "@/components/ConvBar";
import ConvList from "@/components/ConvList";
import Footer from "@/components/Footer";
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
    <div className="relative flex flex-col size-full bg-slate-300">
      <ConvBar>
        <ConvList />
      </ConvBar>
      <AppBar />
      <main className="flex flex-col h-[calc(100%-5rem)]">
        {children}
        <div className="flex justify-center items-center h-20 mt-auto">
          <ChatForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
