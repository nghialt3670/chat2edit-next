"use client";

import MessageAvatar from "./MessageAvatar";
import { Skeleton } from "@mui/material";
import MessageFile from "./MessageFile";

export default function Message({
  type,
  text,
  fileIds,
  isResponding,
  isError,
}: {
  type: "Request" | "Response";
  text?: string;
  fileIds?: string[];
  isResponding?: boolean;
  isError?: boolean;
}) {
  return (
    <div className="flex flex-row md:w-1/2 w-5/6 mb-6">
      <div className="size-10">
        <MessageAvatar type={type} />
      </div>
      <div className="w-11/12 mt-0.5">
        {isResponding ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{text}</p>
            <div>
              {fileIds!.map((fileId) => (
                <MessageFile key={fileId} fileId={fileId} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
