"use client";

import { Button, Stack } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { BASE_URL } from "@/config/endpoints";
import { useEffect } from "react";
import { readFileAsDataURL } from "@/utils/client/file";
import useUserStore from "@/stores/useUserStore";

export default function AppBar() {
  const { isSignedIn, user } = useUser();
  const userStore = useUserStore();

  useEffect(() => {
    const updateUserStore = async () => {
      const avatarURL = user?.imageUrl;
      if (!avatarURL) return;
      const response = await fetch(avatarURL);
      const dataURL = await readFileAsDataURL(await response.blob());
      console.log(dataURL);
      if (dataURL) userStore.setAvatarDataURL(dataURL.toString());
    };
    if (isSignedIn) updateUserStore();
  }, [isSignedIn]);
  return (
    <header className="h-14 flex flex-row items-center justify-between pl-16 pr-4 md:pl-4">
      <div className="flex flex-row justify-center items-center space-x-2">
        <h1 className="font-bold text-xl">Chat2Edit</h1>
      </div>
      <SignedOut>
        <Stack direction="row">
          <SignInButton mode="modal" fallbackRedirectUrl={BASE_URL}>
            <Button color="primary">Log In</Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl={BASE_URL}>
            <Button color="inherit">Sign Up</Button>
          </SignUpButton>
        </Stack>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl={BASE_URL} />
      </SignedIn>
    </header>
  );
}
