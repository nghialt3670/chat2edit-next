"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { IconButton, Typography } from "@mui/material";

export default function NavItem({
  currPath,
  path,
  icon,
  text,
  onClick,
}: {
  currPath: string;
  path: string;
  icon: ReactNode;
  text: string;
  onClick: (path: string) => void;
}) {
  const isSelected = currPath === path;
  const color = isSelected ? "primary" : "inherit";

  return (
    <Link href={path} onClick={() => onClick(path)}>
      <div className="flex flex-row items-center rounded hover:bg-[#bbbbbb]">
        <IconButton color={color} disableRipple>
          {icon}
        </IconButton>
        {
          <Typography
            color={color}
            sx={{ overflow: "hidden", width: "inherit" }}
          >
            {text}
          </Typography>
        }
      </div>
    </Link>
  );
}
