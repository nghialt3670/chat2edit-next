import React, { ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";

export default function IconButton({
  children,
  ...props
}: { children: ReactNode } & ButtonProps) {
  return (
    <Button size="icon" variant="ghost" {...props}>
      {children}
    </Button>
  );
}
