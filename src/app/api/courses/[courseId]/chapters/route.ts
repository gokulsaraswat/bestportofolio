import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const chapters = await db.courseChapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Get chapters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const slug = body.slug || generateSlug(body.title)

    const chapter = await db.courseChapter.create({
      data: {
        title: body.title,
        slug,
        content: body.content ?? '',
        order: body.order ?? 0,
        sectionName: body.sectionName ?? '',
        chapterType: body.chapterType ?? 'content',
        courseId,
        parentId: body.parentId ?? null,
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Create chapter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}