"use client"

import React from "react";
import MessageAvatar from "./MessageAvatar";

export default function Message({
  type,
  text,
  fileIds,
}: {
  type: "Request" | "Response";
  text: string;
  fileIds: string[];
}) {
  return (
    <div className="flex flex-row md:w-1/2 w-5/6 h-10">
      <div className="w-1/12 flex justify-center items-center">
        <MessageAvatar type={type} />
      </div>
      <div className="w-11/12 mt-2">
        <div className="">
          <p>{text}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
}
