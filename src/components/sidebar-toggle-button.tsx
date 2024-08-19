import { Menu, Sidebar } from "lucide-react";

import useSidebarStore from "@/stores/sidebar-store";
import { ComponentProps } from "react";
import IconButton from "./icon-button";

export default function SidebarToggleButton({
  className,
  iconSize,
}: ComponentProps<"button"> & { iconSize: number }) {
  const { toggle } = useSidebarStore();

  return (
    <IconButton className={className} color="inherit" onClick={toggle}>
      <Menu size={iconSize} />
    </IconButton>
  );
}
