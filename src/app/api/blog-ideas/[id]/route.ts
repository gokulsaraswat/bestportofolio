import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation, logError } from '@/lib/log-operation'
import { requireAdmin } from '@/lib/require-admin'

const VALID_STATUSES = ['idea', 'drafting', 'review', 'published']
const VALID_PRIORITIES = ['low', 'medium', 'high']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { id } = await params
    const idea = await db.blogIdea.findUnique({ where: { id } })

    if (!idea) {
      return NextResponse.json(
        { error: 'Blog idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Get blog idea error:', error)
    await logError('blog_idea_get', error)
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

    const existing = await db.blogIdea.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog idea not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      updateData.title = body.title.trim()
    }
    if (body.description !== undefined) updateData.description = body.description
    if (body.tags !== undefined) {
      updateData.tags =
        typeof body.tags === 'string'
          ? body.tags
          : Array.isArray(body.tags)
          ? body.tags.join(',')
          : ''
    }
    if (body.status !== undefined) {
      updateData.status = VALID_STATUSES.includes(body.status)
        ? body.status
        : existing.status
    }
    if (body.priority !== undefined) {
      updateData.priority = VALID_PRIORITIES.includes(body.priority)
        ? body.priority
        : existing.priority
    }
    if (body.source !== undefined) updateData.source = body.source
    if (body.notes !== undefined) updateData.notes = body.notes

    const idea = await db.blogIdea.update({
      where: { id },
      data: updateData,
    })

    const statusChanged =
      body.status !== undefined && body.status !== existing.status

    await logOperation({
      action: statusChanged ? 'blog_idea_status_change' : 'blog_idea_update',
      entityType: 'BlogIdea',
      entityId: idea.id,
      details: statusChanged
        ? `Status changed from "${existing.status}" to "${idea.status}" for "${idea.title}"`
        : `Updated blog idea "${idea.title}"`,
      actor: body.actor ?? 'admin',
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Update blog idea error:', error)
    const { id } = await params
    await logError('blog_idea_update', error, { entityId: id })
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
    const existing = await db.blogIdea.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog idea not found' },
        { status: 404 }
      )
    }

    await db.blogIdea.delete({ where: { id } })

    await logOperation({
      action: 'blog_idea_delete',
      entityType: 'BlogIdea',
      entityId: id,
      details: `Deleted blog idea "${existing.title}"`,
      actor: 'admin',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete blog idea error:', error)
    const { id } = await params
    await logError('blog_idea_delete', error, { entityId: id })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
