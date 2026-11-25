import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { courseId, chapterId } = await params
    const chapter = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Get chapter error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const denied = await requirePermission(request, 'courses')
  if (denied) return denied

  try {
    const { courseId, chapterId } = await params
    const body = await request.json()

    const existing = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Build a safe update payload — only persist known/whitelisted fields.
    const data: Record<string, unknown> = {}

    if (typeof body.title === 'string') {
      data.title = body.title
      // Regenerate slug only if title changed and no explicit slug provided
      if (body.title !== existing.title && !body.slug) {
        data.slug = generateSlug(body.title)
      }
    }
    if (typeof body.slug === 'string' && body.slug) {
      data.slug = body.slug
    }
    if (typeof body.content === 'string') data.content = body.content
    if (typeof body.sectionName === 'string') data.sectionName = body.sectionName
    if (typeof body.chapterType === 'string') data.chapterType = body.chapterType
    if (typeof body.order === 'number') data.order = body.order
    if (body.parentId === null || typeof body.parentId === 'string') data.parentId = body.parentId

    // Feature #17: linked blog/snippet + title override
    if (typeof body.linkedBlogSlug === 'string') data.linkedBlogSlug = body.linkedBlogSlug
    if (typeof body.linkedSnippetSlug === 'string') data.linkedSnippetSlug = body.linkedSnippetSlug
    if (typeof body.titleOverride === 'string') data.titleOverride = body.titleOverride

    const chapter = await db.courseChapter.update({
      where: { id: chapterId },
      data,
    })

    await logOperation({
      action: 'chapter.update',
      entityType: 'course_chapter',
      entityId: chapter.id,
      details: `Updated chapter "${chapter.title}"${
        typeof body.linkedBlogSlug === 'string' || typeof body.linkedSnippetSlug === 'string'
          ? ` (linkedBlog=${body.linkedBlogSlug ?? existing.linkedBlogSlug}, linkedSnippet=${body.linkedSnippetSlug ?? existing.linkedSnippetSlug})`
          : ''
      }`,
      actor: body.actor || 'admin',
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Update chapter error:', error)
    await logOperation({
      action: 'error:chapter.update',
      entityType: 'course_chapter',
      entityId: (await params).chapterId,
      details: `Update chapter failed: ${error instanceof Error ? error.message : 'unknown'}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {

  const denied = await requirePermission(request, 'courses')
  if (denied) return denied
  try {
    const { courseId, chapterId } = await params

    const existing = await db.courseChapter.findFirst({
      where: { id: chapterId, courseId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    await db.courseChapter.delete({ where: { id: chapterId } })

    await logOperation({
      action: 'chapter.delete',
      entityType: 'course_chapter',
      entityId: chapterId,
      details: `Deleted chapter "${existing.title}"`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chapter error:', error)
    await logOperation({
      action: 'error:chapter.delete',
      entityType: 'course_chapter',
      details: `Delete chapter failed: ${error instanceof Error ? error.message : 'unknown'}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
