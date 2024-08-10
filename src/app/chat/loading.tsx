import { CircularProgress } from "@mui/material";
import React from "react";

export default function ConversationLoading() {
  return (
    <div className="size-full flex justify-center items-center">
      <CircularProgress disableShrink />
    </div>
  );
}
