import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/require-admin'

export async function GET(request: NextRequest) {
  const denied = await requirePermission(request, 'rag-bot')
  if (denied) return denied

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.GEMINI_API_KEY
  )
  return NextResponse.json({ configured })
}
