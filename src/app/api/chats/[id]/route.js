import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Chat from '@/models/Chat'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const chat = await Chat.findOne({ 
    _id: params.id, 
    userId: session.user.id 
  })

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
  }

  return NextResponse.json(chat)
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messages, summary, title } = await req.json()
  
  await dbConnect()
  
  const updateData = { lastActivity: new Date() }
  if (messages) updateData.messages = messages
  if (summary) updateData.summary = summary
  if (title) updateData.title = title

  const chat = await Chat.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    updateData,
    { new: true }
  )

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
  }

  return NextResponse.json(chat)
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const chat = await Chat.findOneAndDelete({ 
    _id: params.id, 
    userId: session.user.id 
  })

  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Chat deleted successfully' })
}