import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const body = await request.json()

    const existing = await db.course.findUnique({ where: { id: courseId } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Course not found' },
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

    const course = await db.course.update({
      where: { id: courseId },
      data,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const existing = await db.course.findUnique({ where: { id: courseId } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    await db.course.delete({ where: { id: courseId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}