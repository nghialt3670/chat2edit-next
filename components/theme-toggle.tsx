"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { ComponentProps } from "react";
import { Button } from "./ui/button";

export default function ThemeToggle({
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
    <Button
      className={className}
      size={"icon"}
      variant={"ghost"}
      onClick={handleToggleTheme}
    >
      {icon}
    </Button>
  );
}
