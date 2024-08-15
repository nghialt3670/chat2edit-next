import { Moon, Sun } from 'lucide-react'

import { IconButton } from '@mui/material'
import { useTheme } from 'next-themes'
import { ComponentProps } from 'react'

export default function ThemeToggleButton({
  className,
  iconSize
}: ComponentProps<'button'> & { iconSize: number }) {
  const { theme, setTheme } = useTheme()

  const handleToggleTheme = () => {
    if (theme == 'light') setTheme('dark')
    else setTheme('light')
  }

  const icon =
    theme === 'dark' ? <Moon size={iconSize} /> : <Sun size={iconSize} />

  return (
    <IconButton
      className={className}
      color="inherit"
      onClick={handleToggleTheme}
    >
      {icon}
    </IconButton>
  )
}
