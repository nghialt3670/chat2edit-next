"use client";

import { ReactNode } from "react";

import useLayoutStore from "@/stores/LayoutStore";
import { IconButton } from "@mui/material";
import { CirclePlus, Menu } from "lucide-react";
import Link from "next/link";

export default function ConvBar({ children }: { children: ReactNode }) {
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.convBarExpanded ? "w-64" : "w-0";

  return (
    <div
      className={`absolute left-0 h-full ${widthStyle} bg-slate-500 transition-width duration-200 z-10`}
    >
      <div className="m-2 w-inherit flex flex-row">
        <IconButton onClick={layoutStore.toggleConvBar}>
          <Menu />
        </IconButton>
        <IconButton>
          <Link href="/chat">
            <CirclePlus />
          </Link>
        </IconButton>
      </div>
      {children}
    </div>
  );
}
