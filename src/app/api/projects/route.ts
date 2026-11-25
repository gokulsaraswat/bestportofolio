import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'
import { logOperation, logError } from '@/lib/log-operation'
import { requirePermission } from '@/lib/require-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}

    if (featured !== null) {
      where.featured = featured === 'true'
    }

    const projects = await db.project.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
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
    // Validate it parses; otherwise fall back to default
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

export async function POST(request: NextRequest) {
  const denied = await requirePermission(request, 'projects')
  if (denied) return denied

  try {
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!body.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const slug = body.slug || generateSlug(body.title)

    const project = await db.project.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        shortDesc: body.shortDesc ?? '',
        banner: body.banner ?? '',
        website: body.website ?? '',
        downloadLink: body.downloadLink ?? '',
        repository: body.repository ?? '',
        stack: normalizeJsonArrayField(body.stack, '[]'),
        screenshots: normalizeJsonArrayField(body.screenshots, '[]'),
        featured: body.featured ?? false,
        role: body.role ?? '',
        process: body.process ?? '',
        results: body.results ?? '',
        architectureDiagramUrl: body.architectureDiagramUrl ?? '',
        dbSchemaUrl: body.dbSchemaUrl ?? '',
        adrContent: body.adrContent ?? '',
        cicdSnippet: body.cicdSnippet ?? '',
        iacSnippet: body.iacSnippet ?? '',
        observabilityUrl: body.observabilityUrl ?? '',
        testCoverageUrl: body.testCoverageUrl ?? '',
        performanceMetrics: body.performanceMetrics ?? '',
        securityImplementation: body.securityImplementation ?? '',
        swaggerUrl: body.swaggerUrl ?? '',
        terminalSessionUrl: body.terminalSessionUrl ?? '',
        behindTheScenes: body.behindTheScenes ?? '',
        videoUrl: body.videoUrl ?? '',
        // Multi-diagram architecture gallery (JSON array of {title,url,description,type})
        architectureDiagrams: normalizeJsonArrayField(body.architectureDiagrams, '[]'),
        // Team / contributors
        contributors: normalizeJsonArrayField(body.contributors, '[]'),
        showTeam: body.showTeam ?? false,
        // Embeds (JSON array of URLs / custom embeds)
        embeds: normalizeJsonArrayField(body.embeds, '[]'),
      },
    })

    await logOperation({
      action: 'project.create',
      entityType: 'project',
      entityId: project.id,
      details: JSON.stringify({ title: project.title, slug: project.slug }),
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    await logError('project.create', error, { entityType: 'project' })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
