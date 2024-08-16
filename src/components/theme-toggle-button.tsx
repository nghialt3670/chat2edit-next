import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import IconButton from "./icon-button";

export default function ThemeToggleButton({
  className,
  iconSize,
}: ComponentProps<"button"> & { iconSize?: number }) {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    if (theme == "light") setTheme("dark");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      <Moon size={iconSize || 20} />
    ) : (
      <Sun size={iconSize || 20} />
    );

  return (
    <IconButton className={className} onClick={handleToggleTheme}>
      {icon}
    </IconButton>
  );
}
