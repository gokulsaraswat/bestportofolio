import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation } from '@/lib/log-operation'
import { requireAdmin } from '@/lib/require-admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/messages/[id]
 * Body: { read?: boolean, replied?: boolean, replyNote?: string }
 *
 * Feature #18:
 *  - Toggle read/unread.
 *  - Mark as replied (sets replied=true and repliedAt=now).
 *  - Mark as unreplied (sets replied=false and repliedAt=null).
 *  - Update the internal replyNote.
 *
 * If `replied` is true and `repliedAt` is not provided, it defaults to now.
 * If `replied` is false, `repliedAt` is cleared.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { id } = await params

    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const body = await request.json().catch(() => ({}))

    const data: {
      read?: boolean
      replied?: boolean
      repliedAt?: Date | null
      replyNote?: string
    } = {}

    if (typeof body.read === 'boolean') data.read = body.read

    if (typeof body.replied === 'boolean') {
      data.replied = body.replied
      if (body.replied) {
        data.repliedAt = body.repliedAt ? new Date(body.repliedAt) : new Date()
      } else {
        data.repliedAt = null
      }
    } else if (
      typeof body.repliedAt !== 'undefined' &&
      body.repliedAt === null
    ) {
      data.repliedAt = null
      data.replied = false
    }

    if (typeof body.replyNote === 'string') data.replyNote = body.replyNote

    const message = await db.contactMessage.update({
      where: { id },
      data,
    })

    // Log meaningful state transitions
    if (typeof body.replied === 'boolean') {
      await logOperation({
        action: body.replied ? 'message.mark_replied' : 'message.unmark_replied',
        entityType: 'ContactMessage',
        entityId: id,
        details: `${body.replied ? 'Marked' : 'Unmarked'} reply for message from "${existing.name}" <${existing.email}>.`,
      })
    }
    if (typeof body.read === 'boolean') {
      await logOperation({
        action: body.read ? 'message.mark_read' : 'message.mark_unread',
        entityType: 'ContactMessage',
        entityId: id,
        details: `${body.read ? 'Marked' : 'Unmarked'} read for message from "${existing.name}" <${existing.email}>.`,
      })
    }
    if (typeof body.replyNote === 'string') {
      await logOperation({
        action: 'message.update_reply_note',
        entityType: 'ContactMessage',
        entityId: id,
        details: `Updated reply note for message from "${existing.name}" <${existing.email}>.`,
      })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('PATCH message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/messages/[id]
 * Immediate delete of a single message. Logs the action.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {

  const denied = await requireAdmin(request)
  if (denied) return denied
  try {
    const { id } = await params

    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    await db.contactMessage.delete({ where: { id } })

    await logOperation({
      action: 'message.delete',
      entityType: 'ContactMessage',
      entityId: id,
      details: `Deleted message from "${existing.name}" <${existing.email}> — subject: "${existing.subject || '(none)'}".`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/messages/[id]
 * Convenience single-message fetch.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  try {
    const { id } = await params
    const message = await db.contactMessage.findUnique({ where: { id } })
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(message)
  } catch (error) {
    console.error('Get message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
