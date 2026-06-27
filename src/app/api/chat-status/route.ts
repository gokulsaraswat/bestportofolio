import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/chat-status — Returns whether the chat widget is visible
export async function GET() {
  try {
    const profile = await db.profile.findFirst({
      select: { chatBotEnabled: true },
    })
    const enabled = (profile as Record<string, unknown>)?.chatBotEnabled === true
    return NextResponse.json({ enabled })
  } catch {
    return NextResponse.json({ enabled: false })
  }
}