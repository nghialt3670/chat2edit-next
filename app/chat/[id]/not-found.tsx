import React from "react";

import { CirclePlus } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function chatNotFound() {
  return (
    <div className="flex flex-col justify-center items-center size-full space-y-4">
      <span className="font-bold">Chat not found</span>
      <Link href="/chat">
        <Button variant={"ghost"}>
          <CirclePlus className="mr-2" />
          Create new chat
        </Button>
      </Link>
    </div>
  );
}
