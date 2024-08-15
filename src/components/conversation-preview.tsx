'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ConversationOption from './conversation-option'

export default function ConversationPreview({
  id,
  title
}: {
  id: string
  title: string | null
}) {
  const pathname = usePathname()
  const isSelected = pathname.endsWith(id)

  return (
    <div
      className={`flex flex-row items-center hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150 ${isSelected ? `backdrop-brightness-150` : ``}`}
    >
      <Link className='' key={id} href={`/chat/${id}`}>
        <div className="flex items-center w-56 h-12 p-4 text-nowrap overflow-hidden mr-2">
          <span className="truncate">{title}</span>
        </div>
      </Link>
      <ConversationOption />
    </div>
  )
}
