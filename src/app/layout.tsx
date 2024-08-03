import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ConvContainer from "@/components/ConvContainer";

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
          <Navbar />
          <div className="flex flex-col w-full">
            <AppBar />
            <main className="h-full">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
