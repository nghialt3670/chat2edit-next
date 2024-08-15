import Message from '@/models/Message'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await Message.create({
    conversationId: '66b62ef52200e8b520186d61',
    text: 'hahahahahahahahahahahahahaha',
    fileIds: []
  })
  await new Promise(resolve => setTimeout(resolve, 3000))
  console.log('hhsdfksd')
  revalidatePath('/chat')
  return NextResponse.json({})
}
