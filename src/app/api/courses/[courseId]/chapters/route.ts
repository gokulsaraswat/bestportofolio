import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const chapters = await db.courseChapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Get chapters error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const denied = await requirePermission(request, 'courses')
  if (denied) return denied

  try {
    const { courseId } = await params
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const slug = body.slug || generateSlug(body.title)

    // Feature #17: persist linked blog/snippet slugs + optional title override
    const linkedBlogSlug = typeof body.linkedBlogSlug === 'string' ? body.linkedBlogSlug : ''
    const linkedSnippetSlug = typeof body.linkedSnippetSlug === 'string' ? body.linkedSnippetSlug : ''
    const titleOverride = typeof body.titleOverride === 'string' ? body.titleOverride : ''

    const chapter = await db.courseChapter.create({
      data: {
        title: body.title,
        slug,
        content: body.content ?? '',
        order: body.order ?? 0,
        sectionName: body.sectionName ?? '',
        chapterType: body.chapterType ?? 'content',
        courseId,
        parentId: body.parentId ?? null,
        linkedBlogSlug,
        linkedSnippetSlug,
        titleOverride,
      },
    })

    await logOperation({
      action: 'chapter.create',
      entityType: 'course_chapter',
      entityId: chapter.id,
      details: `Created chapter "${chapter.title}" in course "${course.title}"${
        linkedBlogSlug ? ` (linked blog: ${linkedBlogSlug})` : ''
      }${linkedSnippetSlug ? ` (linked snippet: ${linkedSnippetSlug})` : ''}`,
      actor: body.actor || 'admin',
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Create chapter error:', error)
    await logOperation({
      action: 'error:chapter.create',
      entityType: 'course_chapter',
      details: `Create chapter failed: ${error instanceof Error ? error.message : 'unknown'}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
