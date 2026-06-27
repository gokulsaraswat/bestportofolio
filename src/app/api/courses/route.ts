import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const slug = body.slug || generateSlug(body.title)

    const course = await db.course.create({
      data: {
        title: body.title,
        slug,
        description: body.description ?? '',
        banner: body.banner ?? '',
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}