import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { requirePermission } from '@/lib/require-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // Single course by slug (includes chapters for the detail page)
    if (slug) {
      const course = await db.course.findUnique({
        where: { slug },
        include: {
          chapters: { orderBy: { order: 'asc' } },
          _count: { select: { chapters: true } },
        },
      })
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
      return NextResponse.json(course)
    }

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
  const denied = await requirePermission(request, 'courses')
  if (denied) return denied

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