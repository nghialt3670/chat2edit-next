"use client";

import { useEffect, useState } from "react";

import {
  BotMessageSquare,
  CirclePlus,
  Edit,
  Home,
  Menu,
  Sidebar,
} from "lucide-react";

import Link from "next/link";
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
      <div className="w-inherit overflow-hidden">
        {currPath.startsWith("/chat") && (
          <div>
            <div className="flex flex-row items-center w-inherit">
              <IconButton onClick={layoutStore.toggleConvBar}>
                <Sidebar />
              </IconButton>
              <span className="w-inherit text-nowrap">Chat History</span>
            </div>
            <div className="flex flex-row items-center w-inherit">
              <Link href="/chat">
                <IconButton>
                  <CirclePlus />
                </IconButton>
              </Link>
              <div className="w-inherit text-nowrap">New Conversation</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
