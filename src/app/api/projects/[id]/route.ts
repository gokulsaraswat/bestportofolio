import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/slug'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const data: Record<string, unknown> = { ...body }

    // If title changed and no explicit slug provided, regenerate slug
    if (body.title && body.title !== existing.title && !body.slug) {
      data.slug = generateSlug(body.title)
    }

    if (!body.slug) {
      delete data.slug
    }

    // Handle JSON string fields
    if (body.stack && typeof body.stack === 'object') {
      data.stack = JSON.stringify(body.stack)
    }
    if (body.screenshots && typeof body.screenshots === 'object') {
      data.screenshots = JSON.stringify(body.screenshots)
    }

    const project = await db.project.update({
      where: { id },
      data,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await db.project.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}