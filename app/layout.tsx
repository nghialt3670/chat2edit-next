import type { Metadata } from "next";

import { Inter } from "next/font/google";
import AppBar from "@/components/app-bar";
import { Providers } from "@/components/providers";

import "@/app/globals.css";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat2Edit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class">
          <AppBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
