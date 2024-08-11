"use client";

import { ReactNode, useEffect, useState } from "react";

import { Forward, Menu, SquarePlus } from "lucide-react";

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
import ShareConvDialog from "./dialogs/ShareConvDialog";
import { usePathname } from "next/navigation";

export default function AppBar() {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isInConversation = pathname.startsWith("/chat/conversations/")

  return (
    <header className="h-14 flex flex-row items-center justify-end pl-2 pr-4">
      {isInConversation && (
        <>        
          <IconButton onClick={handleClickOpen}>
            <Forward />
          </IconButton>
          <ShareConvDialog open={open} handleClose={handleClose} />
        </>
      )}
    </header>
  );
}
