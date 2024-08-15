'use server'

import User from '@/models/User'
import Message from '@/models/Message'
import connectToDatabase from '@/lib/mongo'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import Conversation from '@/models/Conversation'
import SendMessageRequest from '@/types/SendMessageRequest'
import { GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME } from '@/config/db'
import IMessage from '@/types/Message'
import mongoose from 'mongoose'

interface ChatResponse {
  text: string
  file_ids: string[]
}

export async function sendMessage(
  request: SendMessageRequest
): Promise<IMessage | null> {
  await connectToDatabase()

  const { userId } = auth()
  const { conversationId, text, fileIds } = request

  const user = await User.findOne({ clerkId: userId })
  if (!user) throw new Error('User not created')

  const conv = await Conversation.findOne({
    _id: conversationId,
    userId: user.id
  })
  if (!conv) throw new Error('Conversation not created')

  const bucketName = GRIDFS_FOR_MESSAGE_FILES_BUCKET_NAME
  const endpoint = `${process.env.CHAT_SERVICE_BASE_URL}/api/v1/chat`
  const reqBody = JSON.stringify({
    conversation_id: conversationId,
    text,
    file_ids: fileIds,
    bucket_name: bucketName
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: reqBody
  })

  if (!response.ok) {
    await conv.updateOne({ isError: true })
    revalidatePath(`/chat/${conversationId}`)
    return null
  }

  const payload = (await response.json()) as ChatResponse

  const resMessage = await Message.create({
    conversationId: conv.id,
    text: payload.text,
    fileIds: payload.file_ids
  })

  await conv.updateOne({
    title: payload.text,
    lastModified: Date.now()
  })

  revalidatePath(`/chat/${conversationId}`)

  return {
    id: resMessage.id,
    type: 'Response',
    text: resMessage.text,
    fileIds: resMessage.fileIds.map(id => String(id))
  }
}
