import { Spinner } from '@radix-ui/themes'
import React from 'react'

export default function ConversationLoading() {
  return (
    <div className="size-full flex justify-center items-center">
      <Spinner size="3" />
    </div>
  )
}
