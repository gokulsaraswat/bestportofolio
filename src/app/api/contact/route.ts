import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject ?? '',
        message: body.message,
      },
    })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error('Create contact message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}