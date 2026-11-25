import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logOperation, logError } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

const VALID_STATUSES = ['idea', 'drafting', 'review', 'published']
const VALID_PRIORITIES = ['low', 'medium', 'high']

export async function GET(request: NextRequest) {
  // Unpublished article ideas are a private content pipeline.
  const denied = await requirePermission(request, 'blog-ideas')
  if (denied) return denied

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    if (tag) {
      where.tags = { contains: tag }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { source: { contains: search } },
        { notes: { contains: search } },
      ]
    }

    const ideas = await db.blogIdea.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Get blog ideas error:', error)
    await logError('blog_ideas_list', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const denied = await requirePermission(request, 'blog-ideas')
  if (denied) return denied

  try {
    const body = await request.json()

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const status = VALID_STATUSES.includes(body.status) ? body.status : 'idea'
    const priority = VALID_PRIORITIES.includes(body.priority)
      ? body.priority
      : 'medium'

    const idea = await db.blogIdea.create({
      data: {
        title: body.title.trim(),
        description: body.description ?? '',
        tags:
          typeof body.tags === 'string'
            ? body.tags
            : Array.isArray(body.tags)
            ? body.tags.join(',')
            : '',
        status,
        priority,
        source: body.source ?? '',
        notes: body.notes ?? '',
      },
    })

    await logOperation({
      action: 'blog_idea_create',
      entityType: 'BlogIdea',
      entityId: idea.id,
      details: `Created blog idea "${idea.title}" (status=${idea.status}, priority=${idea.priority})`,
      actor: body.actor ?? 'admin',
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Create blog idea error:', error)
    await logError('blog_idea_create', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
