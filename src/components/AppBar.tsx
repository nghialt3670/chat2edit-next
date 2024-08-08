"use client";

import { useEffect } from "react";

import { Button, IconButton, Stack } from "@mui/material";
import useUserStore from "@/stores/UserStore";
import { readFileAsDataURL } from "@/utils/client/file";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { CirclePlus, Menu } from "lucide-react";
import useLayoutStore from "@/stores/LayoutStore";
import Link from "next/link";

export default function AppBar() {
  const user = useUser();
  const userStore = useUserStore();
  const layoutStore = useLayoutStore();

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

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <header className="h-14 flex flex-row items-center justify-between pl-2 pr-4">
      <div>
        <IconButton onClick={layoutStore.toggleConvBar}>
          <Menu />
        </IconButton>
        <IconButton onClick={layoutStore.toggleConvBar}>
          <Link href="/chat">
            <CirclePlus />
          </Link>
        </IconButton>
      </div>
      <div className="flex flex-row justify-center items-center space-x-2">
        <h1 className="font-bold text-xl">Chat2Edit</h1>
      </div>
      <SignedOut>
        <Stack direction="row">
          <SignInButton mode="modal" fallbackRedirectUrl={base_url}>
            <Button color="primary">Log In</Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl={base_url}>
            <Button color="inherit">Sign Up</Button>
          </SignUpButton>
        </Stack>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl={base_url} />
      </SignedIn>
    </header>
  );
}
