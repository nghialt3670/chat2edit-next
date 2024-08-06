"use client";

import { Trash2 } from "lucide-react";

import Link from "next/link";
import { IconButton } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { deleteConversation } from "@/actions/deleteConversation";

export default function ConvItem({
  convId,
  title,
}: {
  convId: string;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleRemoveClick = async () => {
    await deleteConversation(convId);
    if (pathname.endsWith(convId)) router.push("/chat");
  };

  const backgroundStyle = pathname.endsWith(convId) ? "#7a98a8" : "#11111";

  return (
    <div
      className={`flex flex-row items-center hover:bg-[#7a98a8] bg-[${backgroundStyle}]`}
    >
      <Link key={convId} href={`/chat/conversations/${convId}`}>
        <div className="flex w-44 h-12 items-center opacity-80 text-nowrap overflow-hidden">
          <span className="truncate p-4">{title}</span>
        </div>
      </Link>
      <div className="">
        <IconButton onClick={handleRemoveClick}>
          <Trash2 size={16} />
        </IconButton>
      </div>
    </div>
  );
}
