"use client";

import { ComponentProps } from "react";

import { User } from "next-auth";
import { CreditCard, LogOut, User as UserIcon } from "lucide-react";

import { cn } from "@/utils/client/styling";
import { signOut } from "next-auth/react";
import Settings from "@/components/settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserOptions({
  className,
  user,
}: ComponentProps<"img"> & { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          className={cn("size-6 rounded-full hover:cursor-pointer", className)}
          src={user.image!}
          alt=""
          crossOrigin={"anonymous"}
          referrerPolicy={"no-referrer"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mr-4">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <CreditCard className="mr-2 size-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Settings />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={async () => signOut()}
        >
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
