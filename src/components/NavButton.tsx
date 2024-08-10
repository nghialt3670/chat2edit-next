"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { Button, IconButton, Typography } from "@mui/material";

export default function NavButton({
  path,
  icon,
  text,
  isSelected,
  onClick,
}: {
  path: string;
  icon: ReactNode;
  text: string;
  isSelected: boolean;
  onClick: (path: string) => void;
}) {
  const hoverColor = "backdrop-brightness-95";
  const bgColor = isSelected ? "backdrop-brightness-95" : "";

  return (
    <Link href={path} onClick={() => onClick(path)}>
      <div
        className={`flex flex-row items-center rounded hover:${hoverColor} ${bgColor}`}
      >
        <IconButton disableRipple>{icon}</IconButton>
        <span className="overflow-hidden opacity-60 font-semibold">{text}</span>
      </div>
    </Link>
  );
}
