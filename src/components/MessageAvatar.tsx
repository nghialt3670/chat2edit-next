"use client";

import React from "react";
import Logo from "../../public/logo.svg";
import useUserStore from "@/stores/useUserStore";

export default function MessageAvatar({
  type,
}: {
  type: "Request" | "Response";
}) {
  const userStore = useUserStore();
  const src = type === "Request" ? userStore.avatarDataURL : Logo.src;
  return (
    <div>
      <img className="size-7 rounded-full" src={src} />
    </div>
  );
}
