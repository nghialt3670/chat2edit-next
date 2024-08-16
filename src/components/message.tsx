"use client";

import ReactMarkdown from "react-markdown";

import IMessage from "@/types/Message";
import MessageFilePreview from "./message-file-preview";
import useUserStore from "@/stores/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { BotMessageSquare, CircleUserRound } from "lucide-react";

export default function Message({
  type,
  message,
}: {
  type: "Request" | "Response" | "Anonymous";
  message: IMessage | null | undefined;
}) {
  const { avatarDataURL } = useUserStore();

  const renderAvatar = () => {
    if (type === "Request" && avatarDataURL)
      return <img className="size-7 rounded-full" src={avatarDataURL} alt="" />;

    if (type === "Response") return <BotMessageSquare className="size-7" />;

    return <CircleUserRound className="size-7" />;
  };

  const renderContent = () => {
    if (message)
      return (
        <div className="w-11/12 ml-4 mt-0.5">
          <ReactMarkdown>{message.text}</ReactMarkdown>
          <div>
            {message.fileIds.map((id) => (
              <MessageFilePreview key={id} fileId={id} />
            ))}
          </div>
        </div>
      );

    if (message === undefined)
      return (
        <div className="w-11/12 ml-4 mt-0.5 space-y-3">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
        </div>
      );

    return null;
  };

  return (
    <li className="flex flex-row md:w-1/2 w-11/12 mt-5 mb-5">
      {renderAvatar()}
      {renderContent()}
    </li>
  );
}
