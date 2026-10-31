import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pickFields } from '@/lib/pick-fields'
import { Prisma } from '@prisma/client'
import { generateSlug } from '@/lib/slug'
import { logOperation, logError } from '@/lib/log-operation'
import { requireAdmin } from '@/lib/require-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await db.project.findUnique({ where: { id } })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/** Normalize a JSON-array-like field to a JSON string. Falls back to default. */
function normalizeJsonArrayField(
  value: unknown,
  defaultValue = '[]'
): string {
  if (value == null || value === '') return defaultValue
  if (typeof value === 'string') {
    try {
      JSON.parse(value)
      return value
    } catch {
      return defaultValue
    }
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return defaultValue
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

    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const data = pickFields(body, Prisma.ProjectScalarFieldEnum)

    // If title changed and no explicit slug provided, regenerate slug
    if (body.title && body.title !== existing.title && !body.slug) {
      data.slug = generateSlug(body.title)
    }

    if (!body.slug) {
      delete data.slug
    }

    // Handle JSON string fields — accept either an array or a JSON string
    if (body.stack !== undefined) {
      data.stack = normalizeJsonArrayField(body.stack, '[]')
    }
    if (body.screenshots !== undefined) {
      data.screenshots = normalizeJsonArrayField(body.screenshots, '[]')
    }
    if (body.architectureDiagrams !== undefined) {
      data.architectureDiagrams = normalizeJsonArrayField(body.architectureDiagrams, '[]')
    }
    if (body.contributors !== undefined) {
      data.contributors = normalizeJsonArrayField(body.contributors, '[]')
    }
    if (body.embeds !== undefined) {
      data.embeds = normalizeJsonArrayField(body.embeds, '[]')
    }
    if (body.showTeam !== undefined) {
      data.showTeam = Boolean(body.showTeam)
    }

    const project = await db.project.update({
      where: { id },
      data,
    })

    await logOperation({
      action: 'project.update',
      entityType: 'project',
      entityId: project.id,
      details: JSON.stringify({
        title: project.title,
        slug: project.slug,
        fields: Object.keys(body),
      }),
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Update project error:', error)
    await logError('project.update', error, { entityType: 'project' })
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

  // Resolved outside the try so the catch block can still report which
  // project failed — it previously referenced an out-of-scope `id`.
  const { id } = await params

  try {
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await db.project.delete({ where: { id } })

    await logOperation({
      action: 'project.delete',
      entityType: 'project',
      entityId: id,
      details: JSON.stringify({ title: existing.title, slug: existing.slug }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    await logError('project.delete', error, { entityType: 'project', entityId: id })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
