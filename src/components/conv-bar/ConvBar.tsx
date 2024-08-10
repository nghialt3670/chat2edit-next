"use client";

import { ReactNode } from "react";

import useLayoutStore from "@/stores/LayoutStore";
import { IconButton } from "@mui/material";
import { Menu, SquarePlus } from "lucide-react";
import Link from "next/link";

export default function ConvBar({ children }: { children: ReactNode }) {
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.convBarExpanded ? "w-64" : "w-0";

  return (
    <div
      className={`absolute left-0 h-full ${widthStyle} bg-[#7B8FA1] transition-width duration-200 z-10`}
    >
      <div className="m-2 w-inherit flex flex-row">
        <IconButton onClick={layoutStore.toggleConvBar}>
          <Menu />
        </IconButton>
        <Link href="/chat">
          <IconButton>
            <SquarePlus />
          </IconButton>
        </Link>
      </div>
      {children}
    </div>
  );
}
