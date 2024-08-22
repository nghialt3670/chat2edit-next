"use client";

import ReactMarkdown from "react-markdown";
import { AlertCircle, BotMessageSquare } from "lucide-react";

import IMessage from "@/types/Message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MessageFile from "@/components/message-file";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BotMessage({
  message,
  onRetry,
}: {
  message: IMessage | null | undefined;
  onRetry?: () => void;
}) {
  const renderContent = () => {
    if (message)
      return (
        <>
          <ReactMarkdown>{message.text}</ReactMarkdown>
          {message.fileIds.length !== 0 && (
            <div className="flex flex-col w-fit mt-4">
              {message.fileIds.map((id) => (
                <MessageFile
                  className="flex-row-reverse"
                  key={id}
                  fileId={id}
                />
              ))}
            </div>
          )}
        </>
      );

    if (message === undefined)
      return (
        <div className="w-full space-y-3">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
        </div>
      );

    return (
      <Alert variant="destructive">
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
    <li className="flex flex-row w-5/6 max-w-2xl md:ml-3.5 min-w-64 my-5">
      <BotMessageSquare className="size-7" />
      <div className="w-full ml-4 mt-0.5">{renderContent()}</div>
    </li>
  );
}
