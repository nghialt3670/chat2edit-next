'use client'

import SidebarToggleButton from './sidebar-toggle-button'
import LoginSection from './login-section'
import { Separator } from '@radix-ui/themes'

export default function AppBar() {
  return (
    <header className="flex flex-row items-center p-2 h-14 bg-gray-200 dark:bg-[#282828]">
      <SidebarToggleButton iconSize={25} />
      <h1 className="m-3 font-extrabold text-xl">Chat2Edit</h1>
      <LoginSection className='ml-auto mr-2' />
    </header>
  )
}
