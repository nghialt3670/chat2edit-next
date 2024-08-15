import { Button, Popover } from '@radix-ui/themes'
import { EllipsisIcon, EllipsisVertical } from 'lucide-react'
import React from 'react'

export default function ConversationOption() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">
          <EllipsisVertical size={20}/>
        </Button>
      </Popover.Trigger>
      <Popover.Content width="360px" height="fit">
        
      </Popover.Content>
    </Popover.Root>
  )
}
