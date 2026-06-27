import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

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

export async function POST(request: NextRequest) {
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
        stack: typeof body.stack === 'object' ? JSON.stringify(body.stack) : (body.stack ?? '[]'),
        screenshots: typeof body.screenshots === 'object' ? JSON.stringify(body.screenshots) : (body.screenshots ?? '[]'),
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
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}