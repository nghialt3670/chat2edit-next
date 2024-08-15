'use server'

import { v4 } from 'uuid'

import User from '@/models/User'
import connectToDatabase from '@/lib/mongo'
import { auth } from '@clerk/nextjs/server'
import Conversation from '@/models/Conversation'

export default async function getConvShareId(
  conversationId: string
): Promise<string | null> {
  try {
    const { userId } = auth()

    if (!userId) return null

    await connectToDatabase()

    const user = await User.findOne({ clerkId: userId })
    if (!user) return null

    const conv = await Conversation.findById(conversationId)
    if (!conv || String(conv.userId) !== user.id) return null

    return conv.shareId
  } catch (error) {
    return null
  }
}
