import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const history = await db.todoHistory.findMany({
      where: { todoId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Todo history fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}