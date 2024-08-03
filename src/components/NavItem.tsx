"use client";

import { IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavItem({
  path,
  icon,
  text,
  showText,
  textWidth,
}: {
  path: string;
  icon: ReactNode;
  text: string;
  showText: boolean;
  textWidth: number;
}) {
  const pathname = usePathname();
  const isSelected = pathname === path;
  const color = isSelected ? "primary" : "inherit";

  return (
    <Link href={path}>
      <div className="flex flex-row items-center rounded hover:bg-slate-400">
        <IconButton color={color} disableRipple>
          {icon}
        </IconButton>
        {showText && (
          <Typography color={color} width={textWidth}>
            {text}
          </Typography>
        )}
      </div>
    </Link>
  );
}
