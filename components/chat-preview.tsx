"use client";

import Link from "next/link";
import { cn } from "@/utils/client/styling";
import { usePathname } from "next/navigation";
import ChatOptions from "@/components/chat-options";

export default function ChatPreview({
  id,
  title,
}: {
  id: string;
  title: string | null;
}) {
  const pathname = usePathname();
  const isSelected = pathname.endsWith(id);

  return (
    <div
      className={cn(
        "flex flex-row items-center rounded hover:bg-accent hover:text-accent-foreground group h-10",
        isSelected && "bg-accent text-accent-foreground",
      )}
    >
      <Link className="" key={id} href={`/chat/${id}`}>
        <div className="flex items-center w-56 p-4 text-nowrap overflow-hidden">
          <span className="truncate md:text-sm">{title}</span>
        </div>
      </Link>
      <ChatOptions
        className={cn(
          "ml-auto opacity-0 group-hover:opacity-100",
          isSelected && "opacity-100",
        )}
        id={id}
      />
    </div>
  );
}
