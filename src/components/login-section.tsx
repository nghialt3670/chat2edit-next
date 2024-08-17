import { Button, Stack } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect } from "react";
import { readFileAsDataURL } from "@/utils/client/file";
import useUserStore from "@/stores/user-store";
import { usePathname } from "next/navigation";

export default function LoginSection({ className }: ComponentProps<"section">) {
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

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const redirectURL = baseURL;

  return (
    <section className={cn("flex justify-center items-center", className)}>
      <SignedOut>
        <Stack direction="row">
          <SignInButton mode="modal" fallbackRedirectUrl={redirectURL}>
            <Button color="primary" sx={{ textWrap: "nowrap" }}>
              Log In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl={redirectURL}>
            <Button color="inherit" sx={{ textWrap: "nowrap" }}>
              Sign Up
            </Button>
          </SignUpButton>
        </Stack>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl={redirectURL} />
      </SignedIn>
    </section>
  );
}
