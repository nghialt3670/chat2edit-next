"use client";

import { ReactNode } from "react";

import useLayoutStore from "@/stores/LayoutStore";

export default function ConvBar({ children }: { children: ReactNode }) {
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.convBarExpanded ? "w-64" : "w-0";

  return (
    <div
      className={`h-full ${widthStyle} bg-slate-400 transition-width duration-300 md:relative absolute overflow-y-scroll z-10`}
    >
      {children}
    </div>
  );
}
