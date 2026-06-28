import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation } from '@/lib/log-operation'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const snippet = await db.codeSnippet.findUnique({ where: { id } })
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }
    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Get snippet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.codeSnippet.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.type !== undefined) data.type = body.type
    if (body.language !== undefined) data.language = body.language
    if (body.tags !== undefined) data.tags = body.tags
    if (body.content !== undefined) data.content = body.content
    if (body.tabs !== undefined) data.tabs = body.tabs
    if (body.category !== undefined) data.category = body.category
    if (body.comment !== undefined) data.comment = body.comment
    if (body.demoType !== undefined) data.demoType = body.demoType
    if (body.demoUrl !== undefined) data.demoUrl = body.demoUrl
    if (body.demoOutput !== undefined) data.demoOutput = body.demoOutput
    if (body.published !== undefined) data.published = body.published
    if (body.includeInRag !== undefined) data.includeInRag = body.includeInRag

    if (body.title && body.title !== existing.title) {
      data.slug = body.slug || generateSlug(body.title)
    }

    const snippet = await db.codeSnippet.update({ where: { id }, data })
    await logOperation({ action: 'update', entityType: 'snippet', entityId: id, details: `Updated snippet: ${snippet.title}`, actor: body.actor || 'admin' })
    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Update snippet error:', error)
    await logOperation({ action: 'error', entityType: 'snippet', details: `Update snippet failed: ${error instanceof Error ? error.message : 'unknown'}` })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.codeSnippet.findUnique({ where: { id }, select: { title: true } })
    await db.codeSnippet.delete({ where: { id } })
    await logOperation({ action: 'delete', entityType: 'snippet', entityId: id, details: `Deleted snippet: ${existing?.title || id}` })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete snippet error:', error)
    await logOperation({ action: 'error', entityType: 'snippet', details: `Delete snippet failed: ${error instanceof Error ? error.message : 'unknown'}` })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}