'use client'

import useSidebarStore from '@/stores/sidebar-store'
import { ReactNode } from 'react'
import SettingButton from './open-settings-button'
import { Flex, Separator } from '@radix-ui/themes'

export default function Sidebar({ children }: { children: ReactNode }) {
  const { opened } = useSidebarStore()

  return (
    <aside
      className={`absolute ${opened ? 'left-0' : '-left-72'} w-72 h-[calc(100vh-3.5rem)] flex flex-row transition-width duration-300 ease-in-out bg-gray-300 dark:bg-[#171717] z-50`}
    >
      <div className='flex flex-col w-full'>
        {children}
        <SettingButton className='w-fit m-3 mt-auto' iconSize={20} />
      </div>
      <Separator className="ml-auto" orientation="vertical" />
    </aside>
  )
}
