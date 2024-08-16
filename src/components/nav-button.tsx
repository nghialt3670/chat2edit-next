"use client";

import { ComponentProps, ReactNode } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@radix-ui/themes";

export default function NavButton({
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
      <Button className="w-full flex flex-row space-x-2 justify-start rounded p-2 hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150">
        {icon}
        <p>{text}</p>
      </Button>
    </Link>
  );
}
