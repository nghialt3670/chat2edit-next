"use client";

import { Menu } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSidebarStore from "@/stores/sidebar-store";
import LogInSection from "@/components/log-in-section";

export default function AppBar() {
  const { toggle } = useSidebarStore();

  return (
    <header className="flex flex-row items-center p-1 h-12">
      <Button size={"icon"} variant={"ghost"} onClick={toggle}>
        <Menu size={20} />
      </Button>
      <Link href={"/"}>
        <h1 className="m-3 font-extrabold text-xl">Chat2Edit</h1>
      </Link>
      <LogInSection className="ml-auto mr-1" />
    </header>
  );
}
