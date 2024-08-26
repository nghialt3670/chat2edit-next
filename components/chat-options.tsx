"use client";

import { ComponentProps } from "react";

import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import ShareChat from "@/components/share-chat";
import DeleteChat from "@/components/delete-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatOptions({
  className,
  chatId,
}: ComponentProps<"button"> & { chatId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} size={"icon"} variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 mr-4">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteChat chatId={chatId} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <ShareChat chatId={chatId} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
