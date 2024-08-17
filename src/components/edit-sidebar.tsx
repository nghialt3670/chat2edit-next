import React from 'react'
import Sidebar from './sidebar'
import NavButton from './nav-button'
import { Divider } from '@mui/material'
import { BotMessageSquare, Home, SquarePlus } from 'lucide-react'

export default function EditSidebar() {
  return (
    <Sidebar>
      <nav className="m-2">
        <NavButton
          path="/"
          icon={<Home strokeWidth={2} size={20} />}
          text="Home"
        />
        <NavButton
          path="/chat"
          icon={<BotMessageSquare strokeWidth={2} size={20} />}
          text="Chat"
        />
        <Divider
          sx={{ marginTop: 1, marginBottom: 1 }}
          orientation="horizontal"
        />
        <NavButton
          path="/edit/canvas"
          icon={<SquarePlus strokeWidth={2} size={20} />}
          text="New Canvas"
        />
      </nav>
    </Sidebar>
  )
}
