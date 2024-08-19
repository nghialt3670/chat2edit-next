"use client";

import useSidebarStore from "@/stores/sidebar-store";
import { ReactNode } from "react";
import { Separator } from "@radix-ui/themes";
import SettingsDialog from "./settings-dialog";

export default function Sidebar({ children }: { children: ReactNode }) {
  const { opened } = useSidebarStore();

  return (
    <aside
      className={`absolute ${opened ? "left-0" : "-left-60"} w-60 h-[calc(100vh-3.5rem)] flex flex-row transition-width duration-300 ease-in-out z-50 bg-sidebar`}
    >
      <div className="flex flex-col w-full">
        {children}
        <div className="mt-auto p-3 pl-4">
          <SettingsDialog />
        </div>
      </div>
      <Separator className="ml-auto" orientation="vertical" />
    </aside>
  );
}
