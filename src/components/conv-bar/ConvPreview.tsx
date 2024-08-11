"use client";

import { useTransition } from "react";

import { Trash2 } from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress, IconButton } from "@mui/material";
import { deleteConversation } from "@/actions/deleteConversation";

export default function ConvPreview({
  convId,
  title,
}: {
  convId: string;
  title: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, startDeleting] = useTransition();

  const handleRemoveClick = async () => {
    startDeleting(async () => {
      await deleteConversation(convId);
    });
    if (pathname.endsWith(convId)) router.push("/chat");
  };

  const isSelected = pathname.endsWith(convId);

  return (
    <div
      className={`flex flex-row items-center hover:backdrop-brightness-95 ${isSelected ? `backdrop-brightness-95` : ``}`}
    >
      <div className="w-10 flex justify-center items-center">
        {isDeleting ? (
          <CircularProgress
            size={16}
            color="inherit"
            sx={{ opacity: 50 }}
            disableShrink
          />
        ) : (
          <IconButton onClick={handleRemoveClick}>
            <Trash2 size={16} />
          </IconButton>
        )}
      </div>
      <Link key={convId} href={`/chat/conversations/${convId}`}>
        <div className="flex w-52 h-12 items-center opacity-80 text-nowrap overflow-hidden">
          <span className="truncate p-2">{title}</span>
        </div>
      </Link>
    </div>
  );
}
