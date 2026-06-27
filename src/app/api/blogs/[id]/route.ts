import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blog = await db.blogPost.findUnique({ where: { id } })

    if (!blog) {
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

    const data: Record<string, unknown> = { ...body }

    // If title changed and no explicit slug provided, regenerate slug
    if (body.title && body.title !== existing.title && !body.slug) {
      data.slug = generateSlug(body.title)
    }

    // Remove slug from data if not explicitly provided (to avoid overwriting)
    if (!body.slug) {
      delete data.slug
    }

    const blog = await db.blogPost.update({
      where: { id },
      data,
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Update blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}