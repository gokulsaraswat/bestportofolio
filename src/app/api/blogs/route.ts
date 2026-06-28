import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

// Auto-publish scheduled posts whose time has come

    await db.blogPost.updateMany({
      where: {
        published: false,
        scheduledAt: { lte: new Date() },
      },
      data: { published: true },
    })

    const where: Record<string, unknown> = {}

    if (published !== null) {
      where.published = published === 'true'
    }

    if (type) {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (tag) {
      where.tags = { contains: tag }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { tags: { contains: search } },
        { category: { contains: search } },
      ]
    }

    const blogs = await db.blogPost.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Get blogs error:', error)
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

    const blog = await db.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt ?? '',
        content: body.content ?? '',
        coverImage: body.coverImage ?? '',
        tags: body.tags ?? '',
        category: body.category ?? '',
        type: body.type ?? 'article',
        embedUrl: body.embedUrl ?? '',
        writtenBy: body.writtenBy ?? '',
        acceptedBy: body.acceptedBy ?? '',
        published: body.published ?? false,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}