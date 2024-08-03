"use client";

import useNavbarStore from "@/stores/NavbarStore";
import { CssBaseline, Divider, IconButton } from "@mui/material";
import {
  Menu,
  Home,
  BotMessageSquare,
  PencilRuler,
  PanelRight,
  PanelLeft,
  Sidebar,
} from "lucide-react";
import NavItem from "./NavItem";
import { usePathname } from "next/navigation";
import useConvBarStore from "@/stores/ConvBarStore";

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
    icon: <PencilRuler />,
    text: "Edit",
  },
];
const NAV_ITEM_TEXT_WIDTH = 200;

export default function Navbar() {
  const navbarStore = useNavbarStore();
  const convBarStore = useConvBarStore();
  const pathname = usePathname();
  const widthStyle1 = navbarStore.expanded ? "w-64" : "w-14";
  const widthStyle2 = navbarStore.expanded ? "w-64" : "w-0";

  return (
    <div
      className={`bg-gray-300 h-full ${widthStyle1} p-2 transition-width duration-300 ease-in-out md:relative absolute`}
    >
      <div>
        <IconButton onClick={navbarStore.toggle}>
          <Menu />
        </IconButton>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <nav className="flex flex-col w-inherit justify-center w-full">
        {NAV_ITEM_INFO.map(({ path, icon, text }) => (
          <NavItem
            key={path}
            path={path}
            icon={icon}
            text={text}
            showText={navbarStore.expanded}
            textWidth={NAV_ITEM_TEXT_WIDTH}
          />
        ))}
      </nav>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <div>
        {pathname.startsWith("/chat") && (
          <IconButton onClick={convBarStore.toggle}>
            <Sidebar />
          </IconButton>
        )}
      </div>
    </div>
  );
}
