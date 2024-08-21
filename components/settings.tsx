"use client";

import { Settings as SettingsIcon } from "lucide-react";

import ThemeToggle from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row items-center">
        <SettingsIcon className="mr-2 size-4" />
        <span>Settings</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center space-x-2">
          <p>Theme:</p>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
