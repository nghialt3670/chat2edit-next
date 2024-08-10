import type, { Metadata } from "next";

import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat2Edit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="md:absolute w-14 h-full"></div>
          <Sidebar />
          <div className="w-1 bg-slate-400"></div>
          <div className="w-full">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
