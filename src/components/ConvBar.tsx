"use client";

import { ReactNode } from "react";

import useLayoutStore from "@/stores/LayoutStore";

export default function ConvBar({ children }: { children: ReactNode }) {
  const layoutStore = useLayoutStore();
  const widthStyle = layoutStore.convBarExpanded ? "w-64" : "w-0";

  return (
    <div
      className={`h-full ${widthStyle} bg-slate-500 transition-width md:relative md:rounded-none rounded-tl-xl rounded-bl-xl right-0 absolute duration-200 z-10`}
    >
      {children}
    </div>
  );
}
