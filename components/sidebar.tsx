"use client";

import { ReactNode } from "react";

import useSidebarStore from "@/stores/sidebar-store";

export default function Sidebar({ children }: { children: ReactNode }) {
  const { opened } = useSidebarStore();

  return (
    <>
      <aside
        className={`absolute ${opened ? "left-0" : "-left-72"} w-72 h-full transition-width duration-200 ease-in-out z-50 bg-sidebar shadow-sm`}
      >
        {children}
      </aside>
      <div
        className={`relative ${opened ? "md:w-72 w-0" : "w-0"} h-full transition-width duration-200 ease-in-out -z-50`}
      />
    </>
  );
}
