import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const LIMITS = { name: 80, email: 160, subject: 200, message: 4000 } as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const subject = String(body.subject ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }
    for (const [field, value] of Object.entries({ name, email, subject, message })) {
      const max = LIMITS[field as keyof typeof LIMITS]
      if (value.length > max) {
        return NextResponse.json(
          { error: `${field[0].toUpperCase()}${field.slice(1)} must be ${max} characters or fewer` },
          { status: 400 }
        )
      }
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email address looks invalid' }, { status: 400 })
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
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