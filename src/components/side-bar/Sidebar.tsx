"use client";

import { ReactNode, useEffect, useState } from "react";

import { BotMessageSquare, Edit, Home } from "lucide-react";

import { usePathname } from "next/navigation";
import useLayoutStore from "@/stores/LayoutStore";
import { Button, Divider, IconButton, Stack } from "@mui/material";
import { Sidebar as SidebarIcon } from "lucide-react";

import NavButton from "./NavButton";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import useUserStore from "@/stores/UserStore";
import { readFileAsDataURL } from "@/utils/client/file";

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
  const [currPath, setCurrPath] = useState<string>(".");
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.sidebarExpanded ? "w-60" : "w-14";
  const pathname = usePathname();
  const user = useUser();
  const userStore = useUserStore();

  useEffect(() => {
    const updateUserStore = async () => {
      if (!user.isLoaded) return;
      if (!user.isSignedIn) {
        userStore.setUserId(null);
        userStore.setAvatarDataURL(null);
        return;
      }
      if (!user.user) return;

      const userId = user.user.id;
      userStore.setUserId(userId);

      const avatarURL = user.user.imageUrl;
      const response = await fetch(avatarURL);
      const blob = await response.blob();
      const dataURL = await readFileAsDataURL(blob);
      if (dataURL) userStore.setAvatarDataURL(dataURL.toString());
    };
    updateUserStore();
  }, [user.isSignedIn]);

  useEffect(() => {
    if (pathname.startsWith("/chat")) setCurrPath("/chat");
    else if (pathname.startsWith("/edit")) setCurrPath("/edit");
    else setCurrPath("/");
  }, [pathname]);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <aside
      className={`bg-[#9BABB8] flex flex-col ${widthStyle} h-full p-2 transition-width duration-200 ease-in-out md:relative absolute z-50`}
    >
      <div className="flex flex-row items-center">
        <IconButton onClick={layoutStore.toggleSidebar}>
          <SidebarIcon />
        </IconButton>
        <h1 className="w-inherit overflow-hidden ml-6 text-lg font-bold">
          Chat2Edit
        </h1>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <nav className="flex flex-col w-inherit justify-center">
        {NAV_ITEM_INFO.map(({ path, icon, text }) => (
          <NavButton
            key={path}
            path={path}
            icon={icon}
            text={text}
            isSelected={path === currPath}
            onClick={() => setCurrPath(path)}
          />
        ))}
      </nav>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <div className="flex flex-col mt-auto space-x-2">
        {layoutStore.sidebarExpanded && (
          <SignedOut>
            <Stack direction="column">
              <SignInButton mode="modal" fallbackRedirectUrl={base_url}>
                <Button color="primary" sx={{ textWrap: "nowrap" }}>
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl={base_url}>
                <Button color="inherit" sx={{ textWrap: "nowrap" }}>
                  Sign Up
                </Button>
              </SignUpButton>
            </Stack>
          </SignedOut>
        )}
      </div>
      <div className="m-2 mb-0">
        <SignedIn>
          <UserButton afterSignOutUrl={base_url} />
        </SignedIn>
      </div>
    </aside>
  );
}
