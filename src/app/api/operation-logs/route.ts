import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '1000', 10)

    const logs = await db.operationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 1000),
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Operation logs fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch operation logs' }, { status: 500 })
  }
}