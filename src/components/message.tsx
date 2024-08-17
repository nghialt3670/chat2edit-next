"use client";

import ReactMarkdown from "react-markdown";

import IMessage from "@/types/Message";
import MessageFilePreview from "./message-file-preview";
import useUserStore from "@/stores/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BotMessageSquare, CircleUserRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import IconButton from "./icon-button";
import { Button } from "./ui/button";

export default function Message({
  message,
  onRetry,
}: {
  message: IMessage | null | undefined;
  onRetry?: () => void;
}) {
  const { avatarDataURL } = useUserStore();

  const renderAvatar = () => {
    if (!message) return <BotMessageSquare className="size-7" />;

    if (message.type === "Request")
      return avatarDataURL ? (
        <img className="size-7 rounded-full" src={avatarDataURL} alt="" />
      ) : (
        <CircleUserRound className="size-7" />
      );

    return <BotMessageSquare className="size-7" />;
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

    return (
      <Alert className="ml-4" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong while processing your request.
        </AlertDescription>
        <div>
          <Button className="p-2" variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <li className="flex flex-row md:w-1/2 w-11/12 mt-5 mb-5">
      {renderAvatar()}
      {renderContent()}
    </li>
  );
}
