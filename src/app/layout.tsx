import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ConvList from "@/components/ConvList";

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
          <div className="md:absolute relative w-14 h-full bg-slate-600"></div>
          <Navbar />
          <div className="flex flex-col h-full w-full">
            <AppBar />
            <main className="h-full flex flex-row">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
