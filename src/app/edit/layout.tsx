import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
