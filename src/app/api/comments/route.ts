import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

/**
 * Comments.
 *
 *   GET  ?entityType=&entityId=   public — the thread for one page
 *   GET  ?all=true                admin  — every comment, for moderation
 *   POST                          public — leave a comment
 *
 * Editing and deleting live in /api/comments/[id] and require a session.
 */

const MAX_NAME = 80
const MAX_EMAIL = 160
const MAX_CONTENT = 4000
const MIN_CONTENT = 2

/** Cheap heuristics — enough to stop drive-by link spam without a service. */
function looksLikeSpam(content: string): boolean {
  const links = (content.match(/https?:\/\//gi) || []).length
  if (links > 3) return true
  if (/\b(viagra|casino|crypto giveaway|forex signals)\b/i.test(content)) return true
  // Long runs of one character, e.g. "aaaaaaaaaaaaaaaa".
  if (/(.)\1{25,}/.test(content)) return true
  return false
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Moderation view: the whole list, newest first.
    if (searchParams.get('all') === 'true') {
      const denied = await requirePermission(request, 'comments')
      if (denied) return denied
      const comments = await db.comment.findMany({ orderBy: { createdAt: 'desc' } })
      return NextResponse.json(comments)
    }

    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType and entityId are required' },
        { status: 400 }
      )
    }

    const comments = await db.comment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      // Commenter emails are collected for replies, not for publication.
      select: {
        id: true,
        name: true,
        content: true,
        entityType: true,
        entityId: true,
        createdAt: true,
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, content, entityType, entityId } = body

    if (!name?.trim() || !content?.trim() || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Name, content, entityType, and entityId are required' },
        { status: 400 }
      )
    }

    const cleanName = String(name).trim().slice(0, MAX_NAME)
    const cleanEmail = String(email || '').trim().slice(0, MAX_EMAIL)
    const cleanContent = String(content).trim()

    if (cleanContent.length < MIN_CONTENT) {
      return NextResponse.json({ error: 'Comment is too short' }, { status: 400 })
    }
    if (cleanContent.length > MAX_CONTENT) {
      return NextResponse.json(
        { error: `Comment must be ${MAX_CONTENT} characters or fewer` },
        { status: 400 }
      )
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Email address looks invalid' }, { status: 400 })
    }
    if (looksLikeSpam(cleanContent)) {
      return NextResponse.json(
        { error: 'That comment looks like spam. Please rephrase.' },
        { status: 422 }
      )
    }

    // Reject a comment attached to something that does not exist, so the
    // moderation queue cannot be filled with orphans.
    const exists = await entityExists(entityType, entityId)
    if (!exists) {
      return NextResponse.json({ error: 'Unknown content item' }, { status: 404 })
    }

    const comment = await db.comment.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        content: cleanContent,
        entityType,
        entityId,
      },
      select: {
        id: true,
        name: true,
        content: true,
        entityType: true,
        entityId: true,
        createdAt: true,
      },
    })

    await logOperation({
      action: 'comment.create',
      entityType: 'comment',
      entityId: comment.id,
      details: `New comment by ${cleanName} on ${entityType}/${entityId}`,
      actor: 'visitor',
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comment create error:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}

/** entityId is a slug for every commentable type. */
async function entityExists(entityType: string, entityId: string): Promise<boolean> {
  switch (entityType) {
    case 'blog':
      return !!(await db.blogPost.findUnique({ where: { slug: entityId }, select: { id: true } }))
    case 'project':
      return !!(await db.project.findUnique({ where: { slug: entityId }, select: { id: true } }))
    case 'course':
      return !!(await db.course.findUnique({ where: { slug: entityId }, select: { id: true } }))
    case 'snippet':
      return !!(await db.codeSnippet.findUnique({ where: { slug: entityId }, select: { id: true } }))
    default:
      return false
  }
}
