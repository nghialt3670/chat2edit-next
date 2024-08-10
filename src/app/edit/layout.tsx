import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit with AI",
};

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="size-full bg-[#BDCDD6]">{children}</div>;
}
