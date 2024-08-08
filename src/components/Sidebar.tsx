"use client";

import { ReactNode, useEffect, useState } from "react";

import { BotMessageSquare, Edit, Home } from "lucide-react";

import { usePathname } from "next/navigation";
import useLayoutStore from "@/stores/LayoutStore";
import { Divider, IconButton } from "@mui/material";
import { Sidebar as SidebarIcon } from "lucide-react";

import NavItem from "./NavItem";

const NAV_ITEM_INFO = [
  {
    path: "/",
    icon: <Home />,
    text: "Home",
  },
  {
    path: "/chat",
    icon: <BotMessageSquare />,
    text: "Chat",
  },
  {
    path: "/edit",
    icon: <Edit />,
    text: "Edit",
  },
];

export default function Sidebar() {
  const [currPath, setCurrPath] = useState<string>("/");
  const pathname = usePathname();
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.sidebarExpanded ? "w-72" : "w-14";

  useEffect(() => {
    if (pathname.startsWith("/chat")) setCurrPath("/chat");
    else if (pathname.startsWith("/edit")) setCurrPath("/edit");
    else setCurrPath("/");
  }, [pathname]);

  return (
    <aside
      className={`bg-slate-400 h-full ${widthStyle} p-2 transition-width duration-200 ease-in-out md:relative absolute z-50`}
    >
      <div>
        <IconButton onClick={layoutStore.toggleSidebar}>
          <SidebarIcon />
        </IconButton>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <nav className="flex flex-col w-inherit justify-center">
        {NAV_ITEM_INFO.map(({ path, icon, text }) => (
          <NavItem
            currPath={currPath}
            key={path}
            path={path}
            icon={icon}
            text={text}
            onClick={setCurrPath}
          />
        ))}
      </nav>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
    </aside>
  );
}
