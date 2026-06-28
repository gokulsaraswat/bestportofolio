import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation } from '@/lib/log-operation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const type = searchParams.get('type')
    const language = searchParams.get('language')
    const tag = searchParams.get('tag')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')

    // Auto-publish scheduled snippets whose time has come
    await db.codeSnippet.updateMany({
      where: {
        published: false,
        scheduledAt: { lte: new Date() },
      },
      data: { published: true },
    })

    const where: Record<string, unknown> = {}

    if (published !== null) {
      where.published = published === 'true'
    }
    if (type) {
      where.type = type
    }
    if (language) {
      where.language = language
    }
    if (tag) {
      where.tags = { contains: tag }
    }
    if (category) {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { content: { contains: search } },
        { category: { contains: search } },
      ]
    }

    const snippets = await db.codeSnippet.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(snippets)
  } catch (error) {
    console.error('Get snippets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const slug = body.slug || generateSlug(body.title)

    const snippet = await db.codeSnippet.create({
      data: {
        title: body.title,
        slug,
        description: body.description ?? '',
        type: body.type ?? 'code',
        language: body.language ?? '',
        tags: body.tags ?? '',
        category: body.category ?? '',
        content: body.content ?? '',
        tabs: body.tabs ?? '[]',
        comment: body.comment ?? '',
        demoType: body.demoType ?? '',
        demoUrl: body.demoUrl ?? '',
        demoOutput: body.demoOutput ?? '',
        published: body.published ?? false,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        includeInRag: body.includeInRag ?? false,
      },
    })

    await logOperation({ action: 'create', entityType: 'snippet', entityId: snippet.id, details: `Created snippet: ${snippet.title}`, actor: body.actor || 'admin' })

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error('Create snippet error:', error)
    await logOperation({ action: 'error', entityType: 'snippet', details: `Create snippet failed: ${error instanceof Error ? error.message : 'unknown'}` })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}