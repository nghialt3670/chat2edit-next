import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import ConvList from "@/components/ConvList";
import { Divider } from "@mui/material";
import ConvBar from "@/components/ConvBar";

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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
