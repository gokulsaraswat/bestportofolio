import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation, logError } from '@/lib/log-operation'
import { requireAdmin } from '@/lib/require-admin'

/**
 * Coerce a resourceLinks payload into a JSON string.
 * Accepts: a JS array of {label,url,description}, a JSON string, or undefined.
 * Always returns a string (default "[]").
 */
function normalizeResourceLinks(raw: unknown): string {
  if (raw == null) return '[]'
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return '[]'
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return JSON.stringify(parsed)
    } catch {
      return '[]'
    }
    return '[]'
  }
  if (Array.isArray(raw)) {
    try {
      return JSON.stringify(raw)
    } catch {
      return '[]'
    }
  }
  return '[]'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
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

    const isAdmin = !(await requireAdmin(request))

    // Feature #17: single-blog lookup by slug (used by course chapter linking)
    if (slug) {
      const blog = await db.blogPost.findUnique({ where: { slug } })
      if (!blog || (!blog.published && !isAdmin)) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      return NextResponse.json(blog)
    }

    const where: Record<string, unknown> = {}

    if (!isAdmin) {
      where.published = true
    } else if (published !== null) {
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
  const denied = await requireAdmin(request)
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
        embeds: body.embeds ?? '',
        resourceLinks: normalizeResourceLinks(body.resourceLinks),
        writtenBy: body.writtenBy ?? '',
        acceptedBy: body.acceptedBy ?? '',
        published: body.published ?? false,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    })

    await logOperation({
      action: 'blog.create',
      entityType: 'blog',
      entityId: blog.id,
      details: `Created blog "${blog.title}" (slug: ${blog.slug})`,
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    await logError('blog.create', error, { entityType: 'blog' })
    console.error('Create blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
