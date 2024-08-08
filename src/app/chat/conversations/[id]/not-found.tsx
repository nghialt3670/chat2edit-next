import { Button } from "@mui/material";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ConversationNotFound() {
  return (
    <div className="flex flex-col justify-center items-center size-full">
      <span>Conversation Not Found</span>
      <Link href="/chat">
        <Button size="large" startIcon={<CirclePlus />}>
          Create New Conversation
        </Button>
      </Link>
    </div>
  );
}
