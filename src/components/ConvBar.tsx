"use client";

import { ReactNode } from "react";

import useLayoutStore from "@/stores/LayoutStore";

export default function ConvBar({ children }: { children: ReactNode }) {
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.convBarExpanded ? "w-64" : "w-0";

  return (
    <div
      className={`h-[calc(100%-5rem)] ${widthStyle} bg-slate-400 transition-width duration-300 md:relative absolute z-10`}
    >
      {children}
    </div>
  );
}
