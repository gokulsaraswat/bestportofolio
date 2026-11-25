import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation, logError } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

/**
 * Moderation endpoints for a single comment. Admin only — visitors can post
 * (POST /api/comments) but never edit or remove.
 */

interface RouteParams {
  params: Promise<{ id: string }>
}

/** PATCH /api/comments/[id] — edit the body, e.g. to redact something. */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const denied = await requirePermission(request, 'comments')
  if (denied) return denied

  const { id } = await params

  try {
    const { content } = await request.json()

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const existing = await db.comment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    const comment = await db.comment.update({
      where: { id },
      data: { content: content.trim() },
    })

    await logOperation({
      action: 'comment.update',
      entityType: 'comment',
      entityId: id,
      details: `Edited comment by ${existing.name} on ${existing.entityType}/${existing.entityId}`,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Update comment error:', error)
    await logError('comment.update', error, { entityType: 'comment', entityId: id })
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

/** DELETE /api/comments/[id] — remove a comment. */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const denied = await requirePermission(request, 'comments')
  if (denied) return denied

  const { id } = await params

  try {
    const existing = await db.comment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    await db.comment.delete({ where: { id } })

    await logOperation({
      action: 'comment.delete',
      entityType: 'comment',
      entityId: id,
      details: `Deleted comment by ${existing.name} on ${existing.entityType}/${existing.entityId}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    await logError('comment.delete', error, { entityType: 'comment', entityId: id })
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
