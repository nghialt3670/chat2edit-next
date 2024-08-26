"use client";

import { ComponentProps, ReactNode } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SidebarNavigate({
  path,
  icon,
  text,
  className,
}: ComponentProps<"button"> & {
  path: string;
  icon: ReactNode;
  text: string;
}) {
  return (
    <Link href={path} className={className}>
      <Button
        className="w-full flex flex-row p-2 space-x-2 items-center justify-start rounded-md"
        variant={"ghost"}
      >
        {icon}
        <span>{text}</span>
      </Button>
    </Link>
  );
}
