import React from 'react'
import Sidebar from './sidebar'
import NavButton from './nav-button'
import { Divider } from '@mui/material'
import { Edit, Home, SquarePlus } from 'lucide-react'
import ChatHistory from './chat-history'

export default function ChatSidebar() {
  return (
    <Sidebar>
      <nav className="m-2">
        <NavButton
          path="/"
          icon={<Home strokeWidth={2} size={20} />}
          text="Home"
        />
        <NavButton
          path="/edit"
          icon={<Edit strokeWidth={2} size={20} />}
          text="Edit"
        />
        <Divider
          sx={{ marginTop: 1, marginBottom: 1 }}
          orientation="horizontal"
        />
        <NavButton
          path="/chat"
          icon={<SquarePlus strokeWidth={2} size={20} />}
          text="New Conversation"
        />
      </nav>
      <ChatHistory />
    </Sidebar>
  )
}
