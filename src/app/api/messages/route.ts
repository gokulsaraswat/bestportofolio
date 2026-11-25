import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

/**
 * GET /api/messages
 * Optional query params:
 *   - retentionDays: number (default 90). Messages older than this many days are auto-deleted before the list is returned.
 *
 * Feature #18: Auto-cleanup of messages older than the retention window. Logs the deletion count.
 */
export async function GET(request: NextRequest) {
  // Contact messages are private correspondence — admin only.
  const denied = await requirePermission(request, 'messages')
  if (denied) return denied

  try {
    // --- Auto-cleanup of old messages -------------------------------------
    // Deliberately opt-in via ?cleanup=true. This used to run on every GET,
    // which meant a plain read could destroy data — and with retentionDays=1
    // an unauthenticated caller could wipe the inbox. A GET must be safe by
    // default, and the retention floor guards against fat-fingered values.
    const wantsCleanup = request.nextUrl.searchParams.get('cleanup') === 'true'
    let deletedCount = 0

    if (wantsCleanup) {
      const MIN_RETENTION_DAYS = 30
      const retentionParam = request.nextUrl.searchParams.get('retentionDays')
      const parsed = retentionParam ? parseInt(retentionParam, 10) : NaN
      const retentionDays = Math.max(
        MIN_RETENTION_DAYS,
        Number.isFinite(parsed) ? parsed : 90
      )
      const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

      try {
        const result = await db.contactMessage.deleteMany({
          where: { createdAt: { lt: cutoff } },
        })
        deletedCount = result.count
        if (deletedCount > 0) {
          console.log(
            `[messages] Cleanup: deleted ${deletedCount} message(s) older than ${retentionDays} day(s).`
          )
          await logOperation({
            action: 'message.auto_cleanup',
            entityType: 'ContactMessage',
            details: `Deleted ${deletedCount} message(s) older than ${retentionDays} day(s) (cutoff ${cutoff.toISOString()}).`,
          })
        }
      } catch (cleanupErr) {
        // Cleanup is best-effort — never block the list response on it.
        console.error('[messages] Cleanup failed:', cleanupErr)
      }
    }

    // --- Return remaining messages ---------------------------------------
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/messages
 * Body: { id: string, read?: boolean, replied?: boolean, replyNote?: string }
 * Legacy bulk-update endpoint — kept for backwards compatibility. Prefer PATCH /api/messages/[id].
 */
export async function PUT(request: NextRequest) {
  const denied = await requirePermission(request, 'messages')
  if (denied) return denied

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const existing = await db.contactMessage.findUnique({
      where: { id: body.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const data: {
      read?: boolean
      replied?: boolean
      repliedAt?: Date | null
      replyNote?: string
    } = {}
    if (typeof body.read === 'boolean') data.read = body.read
    if (typeof body.replied === 'boolean') {
      data.replied = body.replied
      data.repliedAt = body.replied ? new Date() : null
    }
    if (typeof body.replyNote === 'string') data.replyNote = body.replyNote

    const message = await db.contactMessage.update({
      where: { id: body.id },
      data,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/messages
 *
 * Single-message delete:
 *   Body: { id: string }
 *
 * Bulk "delete all read messages" (Feature #18):
 *   Body: { bulk: 'read' }
 *
 * Bulk delete by ids:
 *   Body: { ids: string[] }
 */
export async function DELETE(request: NextRequest) {
  const denied = await requirePermission(request, 'messages')
  if (denied) return denied

  try {
    const body = await request.json().catch(() => ({}))

    // --- Bulk: delete all read messages ---------------------------------
    if (body?.bulk === 'read') {
      const result = await db.contactMessage.deleteMany({
        where: { read: true },
      })
      await logOperation({
        action: 'message.bulk_delete_read',
        entityType: 'ContactMessage',
        details: `Bulk-deleted ${result.count} read message(s).`,
      })
      console.log(
        `[messages] Bulk delete read: removed ${result.count} message(s).`
      )
      return NextResponse.json({ success: true, deletedCount: result.count })
    }

    // --- Bulk: delete by ids --------------------------------------------
    if (Array.isArray(body?.ids) && body.ids.length > 0) {
      const result = await db.contactMessage.deleteMany({
        where: { id: { in: body.ids } },
      })
      await logOperation({
        action: 'message.bulk_delete',
        entityType: 'ContactMessage',
        details: `Bulk-deleted ${result.count} message(s) by id.`,
      })
      return NextResponse.json({ success: true, deletedCount: result.count })
    }

    // --- Single delete --------------------------------------------------
    if (!body?.id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const existing = await db.contactMessage.findUnique({
      where: { id: body.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    await db.contactMessage.delete({
      where: { id: body.id },
    })

    await logOperation({
      action: 'message.delete',
      entityType: 'ContactMessage',
      entityId: body.id,
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
