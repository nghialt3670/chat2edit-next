"use client";

import { Trash2 } from "lucide-react";

import Link from "next/link";
import { IconButton } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { deleteConversation } from "@/actions/deleteConversation";
import useConvListStore from "@/stores/ConvListStore";

export default function ConvItem({
  convId,
  title,
}: {
  convId: string;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const convListStore = useConvListStore();

  const handleRemoveClick = async () => {
    await deleteConversation(convId);
    convListStore.removeConv(convId);
    if (pathname.endsWith(convId)) router.push("/chat");
  };

  const isSelected = pathname.endsWith(convId);
  return (
    <div
      className={`flex flex-row items-center hover:backdrop-brightness-95 ${isSelected ? `backdrop-brightness-95` : ``}`}
    >
      <div>
        <IconButton onClick={handleRemoveClick}>
          <Trash2 size={16} />
        </IconButton>
      </div>
      <Link key={convId} href={`/chat/conversations/${convId}`}>
        <div className="flex w-44 h-12 items-center opacity-80 text-nowrap overflow-hidden">
          <span className="truncate p-2">{title}</span>
        </div>
      </Link>
    </div>
  );
}
