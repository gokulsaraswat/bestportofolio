import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pickFields } from '@/lib/pick-fields'
import { Prisma } from '@prisma/client'
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blog = await db.blogPost.findUnique({ where: { id } })

    if (!blog || (!blog.published && await requireAdmin(request))) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    const data = pickFields(body, Prisma.BlogPostScalarFieldEnum)

    // If title changed and no explicit slug provided, regenerate slug
    if (body.title && body.title !== existing.title && !body.slug) {
      data.slug = generateSlug(body.title)
    }

    // Remove slug from data if not explicitly provided (to avoid overwriting)
    if (!body.slug) {
      delete data.slug
    }

    // Feature #16: always normalize resourceLinks into a JSON string
    // (handles both JS arrays and JSON strings; falls back to existing value).
    if ('resourceLinks' in body) {
      data.resourceLinks = normalizeResourceLinks(body.resourceLinks)
    }

    // Defensive: ensure embeds is always a string when provided
    if ('embeds' in body && typeof body.embeds !== 'string') {
      data.embeds = Array.isArray(body.embeds)
        ? body.embeds.join('\n')
        : String(body.embeds ?? '')
    }

    // Track which fields actually changed for the operation log
    const changedFields: string[] = []
    for (const key of Object.keys(data)) {
      if (data[key] !== (existing as Record<string, unknown>)[key]) {
        changedFields.push(key)
      }
    }

    const blog = await db.blogPost.update({
      where: { id },
      data,
    })

    await logOperation({
      action: 'blog.update',
      entityType: 'blog',
      entityId: blog.id,
      details:
        changedFields.length > 0
          ? `Updated blog "${blog.title}" — changed: ${changedFields.join(', ')}`
          : `Updated blog "${blog.title}" (no field changes detected)`,
    })

    return NextResponse.json(blog)
  } catch (error) {
    await logError('blog.update', error, {
      entityType: 'blog',
      entityId: (await params).id,
    })
    console.error('Update blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const { id } = await params
    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    await db.blogPost.delete({ where: { id } })

    await logOperation({
      action: 'blog.delete',
      entityType: 'blog',
      entityId: id,
      details: `Deleted blog "${existing.title}" (slug: ${existing.slug})`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    await logError('blog.delete', error, {
      entityType: 'blog',
      entityId: (await params).id,
    })
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
