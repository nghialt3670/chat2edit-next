import { cn } from "@/lib/utils";
import useMessageListStore from "@/stores/message-list-store";
import { IconButton } from "@mui/material";
import { ArrowDown } from "lucide-react";
import React, { ComponentProps } from "react";

export default function ScrollToBottomButton({
  className,
  iconSize,
}: ComponentProps<"button"> & { iconSize?: number }) {
  const { scrollToBottom } = useMessageListStore();

  return (
    <IconButton className={className} color="inherit" onClick={scrollToBottom}>
      <ArrowDown size={iconSize} />
    </IconButton>
  );
}
