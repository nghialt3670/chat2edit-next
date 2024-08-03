"use client";

import useConvBarStore from "@/stores/ConvBarStore";
import React, { ReactNode } from "react";

export default function ConvBar({ children }: { children: ReactNode }) {
  const convBarStore = useConvBarStore();
  const widthStyle = convBarStore.expanded ? "w-64" : "w-0";
  return (
    <div
      className={`h-full ${widthStyle} bg-slate-400 transition-width duration-300 md:relative absolute`}
    >
      {convBarStore.expanded && children}
    </div>
  );
}
