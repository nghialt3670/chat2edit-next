import type { Metadata } from "next";

import EditSidebar from "@/components/edit-sidebar";

export const metadata: Metadata = {
  title: "Edit with AI",
};

export default function EditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative w-full h-[calc(100vh-3.5rem)]">
      <EditSidebar />
      {children}
    </main>
  );
}
