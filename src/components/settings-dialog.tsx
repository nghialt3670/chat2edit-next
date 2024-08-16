import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ThemeToggleButton from "./theme-toggle-button";
import { ComponentProps } from "react";
import { Settings } from "lucide-react";
import IconButton from "./icon-button";

export default function SettingsDialog({
  className,
  iconSize,
}: ComponentProps<"button"> & { iconSize?: number }) {
  return (
    <Dialog>
      <DialogTrigger className={className}>
        <Settings size={iconSize || 20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center space-x-2">
          <p>Theme:</p>
          <ThemeToggleButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
