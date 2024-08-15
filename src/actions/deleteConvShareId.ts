'use server'

import User from '@/models/User'
import connectToDatabase from '@/lib/mongo'
import { auth } from '@clerk/nextjs/server'
import Conversation from '@/models/Conversation'

export default async function delelteConvShareId(
  conversationId: string
): Promise<boolean> {
  try {
    const { userId } = auth()

    if (!userId) return false

    await connectToDatabase()

    const user = await User.findOne({ clerkId: userId })
    if (!user) return false

    const conv = await Conversation.findById(conversationId)
    if (!conv || String(conv.userId) !== user.id) return false

    await conv.updateOne({ shareId: null })
    return true
  } catch (error) {
    return false
  }
}
