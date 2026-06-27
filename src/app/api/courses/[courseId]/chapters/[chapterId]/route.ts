import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const chapter = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Get chapter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const body = await request.json()

    const existing = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    const data: Record<string, unknown> = { ...body }

    if (body.title && body.title !== existing.title && !body.slug) {
      data.slug = generateSlug(body.title)
    }

    if (!body.slug) {
      delete data.slug
    }

    // Don't allow changing courseId
    delete data.courseId

    const chapter = await db.courseChapter.update({
      where: { id: chapterId },
      data,
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Update chapter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params

    const existing = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    await db.courseChapter.delete({ where: { id: chapterId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chapter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}