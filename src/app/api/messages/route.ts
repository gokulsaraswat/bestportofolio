import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const existing = await db.contactMessage.findUnique({
      where: { id: body.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const message = await db.contactMessage.update({
      where: { id: body.id },
      data: { read: body.read ?? true },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// FIX: Add DELETE handler for messages
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const existing = await db.contactMessage.findUnique({
      where: { id: body.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    await db.contactMessage.delete({
      where: { id: body.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}