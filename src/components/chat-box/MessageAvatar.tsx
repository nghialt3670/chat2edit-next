"use client";

import { CircleUserRound } from "lucide-react";

import useUserStore from "@/stores/UserStore";

import Logo from "../../../public/logo.svg";

export default function MessageAvatar({
  type,
}: {
  type: "Request" | "Response";
}) {
  const userStore = useUserStore();
  const src = type === "Request" ? userStore.avatarDataURL : Logo.src;
  return (
    <div>
      {src ? (
        <img className="size-7 rounded-full" src={src} />
      ) : (
        <CircleUserRound className="size-7" />
      )}
    </div>
  );
}
