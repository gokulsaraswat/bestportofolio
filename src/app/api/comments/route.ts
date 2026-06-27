import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 })
    }

    const comments = await db.comment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, content, entityType, entityId } = body

    if (!name?.trim() || !content?.trim() || !entityType || !entityId) {
      return NextResponse.json({ error: 'Name, content, entityType, and entityId are required' }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        name: name.trim(),
        email: email?.trim() || '',
        content: content.trim(),
        entityType,
        entityId,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comment create error:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}