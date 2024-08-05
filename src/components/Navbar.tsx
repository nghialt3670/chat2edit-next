"use client";

import { useEffect, useState } from "react";

import { BotMessageSquare, Edit, Home, Menu, Sidebar } from "lucide-react";

import { usePathname } from "next/navigation";
import useLayoutStore from "@/stores/LayoutStore";
import { Divider, IconButton } from "@mui/material";

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

export default function Navbar() {
  const [currPath, setCurrPath] = useState<string>("/");
  const pathname = usePathname();
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.navbarExpanded ? "w-64" : "w-14";

  useEffect(() => {
    if (pathname.startsWith("/chat")) setCurrPath("/chat");
    else if (pathname.startsWith("/edit")) setCurrPath("/edit");
    else setCurrPath("/");
  }, [pathname]);

  return (
    <div
      className={`bg-gray-300 h-full ${widthStyle} p-2 transition-width duration-300 ease-in-out md:relative absolute z-10`}
    >
      <div>
        <IconButton onClick={layoutStore.toggleNavbar}>
          <Menu />
        </IconButton>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <nav className="flex flex-col w-inherit justify-center w-full">
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
      <div>
        {pathname.startsWith("/chat") && (
          <IconButton onClick={layoutStore.toggleConvBar}>
            <Sidebar />
          </IconButton>
        )}
      </div>
    </div>
  );
}
