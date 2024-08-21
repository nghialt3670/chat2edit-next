"use client";

import ReactMarkdown from "react-markdown";

import Message from "@/types/Message";
import MessageFile from "@/components/message-file";

export default function UserMessage({
  message,
  status,
}: {
  message: Message;
  status?: "sending" | "error";
}) {
  return (
    <li className="w-5/6 max-w-2xl min-w-64 mt-5 mb-5 md:ml-3.5">
      <div className="flex flex-col w-fit float-right">
        <span className="">
          {status && (status === "sending" ? "Sending" : "Error")}
        </span>
        <ReactMarkdown
          className={"w-fit ml-auto rounded-full py-2 px-4 bg-accent"}
        >
          {message.text}
        </ReactMarkdown>
        {message.fileIds.length !== 0 && (
          <div className="ml-auto mt-4">
            {message.fileIds.map((id) => (
              <MessageFile key={id} fileId={id} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
