"use client";

import { ReactNode, useEffect } from "react";

import { Menu, SquarePlus } from "lucide-react";

import Link from "next/link";
import useUserStore from "@/stores/UserStore";
import useLayoutStore from "@/stores/LayoutStore";
import { readFileAsDataURL } from "@/utils/client/file";
import { Button, IconButton, Stack } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function AppBar() {
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

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <header className="h-14 flex flex-row items-center justify-between pl-2 pr-4">
    </header>
  );
}
