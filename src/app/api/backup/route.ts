import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // FIX: Support entity filtering via query param
    const { searchParams } = new URL(request.url)
    const entitiesParam = searchParams.get('entities')
    const entities = entitiesParam ? entitiesParam.split(',').map(e => e.trim()) : null

    // If no entities specified, export all
    const includeBlogs = !entities || entities.includes('blogs')
    const includeProjects = !entities || entities.includes('projects')
    const includeCourses = !entities || entities.includes('courses')
    const includeSnippets = !entities || entities.includes('snippets')
    const includeMessages = !entities || entities.includes('messages')
    const includeTodos = !entities || entities.includes('todos')
    const includeProfile = !entities || entities.includes('profile')
    const includeComments = !entities || entities.includes('comments')
    const includeUsers = !entities || entities.includes('users')

    const queries: Promise<[string, unknown]>[] = []
    if (includeProfile) queries.push(db.profile.findFirst().then(p => ['profile', p]))
    if (includeBlogs) queries.push(db.blogPost.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['blogs', p]))
    if (includeProjects) queries.push(db.project.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['projects', p]))
    if (includeCourses) queries.push(db.course.findMany({ orderBy: { createdAt: 'desc' }, include: { chapters: { orderBy: { order: 'asc' } } } }).then(p => ['courses', p]))
    if (includeSnippets) queries.push(db.codeSnippet.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['snippets', p]))
    if (includeMessages) queries.push(db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['messages', p]))
    if (includeTodos) queries.push(db.todo.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['todos', p]))
    if (includeComments) queries.push(db.comment.findMany({ orderBy: { createdAt: 'desc' } }).then(p => ['comments', p]))
    if (includeUsers) queries.push(db.adminUser.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, username: true, role: true, permissions: true, totpEnabled: true } }).then(p => ['users', p]))

    const results = await Promise.all(queries)

    const data: Record<string, unknown > = {}
    for (const [key, value] of results ) {
      data[key as string] = value
    }

    const backup = {
      exportedAt: new Date().toISOString(),
      version: 2,
      entities: entities || ['all'],
      data,
    }

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Support both JSON body and FormData
    let body: { data?: Record<string, unknown> }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      const text = await file.text()
      body = JSON.parse(text)
    } else {
      body = await request.json()
    }

    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'Invalid backup format: missing data' }, { status: 400 })
    }

    let restored: Record<string, number> = {}

    // Restore profile
    if (data.profile) {
      const existing = await db.profile.findFirst()
      if (existing) {
        const { id, createdAt, updatedAt, ...rest } = data.profile as Record<string, unknown>
        await db.profile.update({ where: { id: existing.id }, data: rest })
      } else {
        const { id, ...rest } = data.profile as Record<string, unknown>
        await db.profile.create({ data: rest as any })
      }
      restored.profile = 1
    }

    // Restore blogs
    if (Array.isArray(data.blogs)) {
      for (const blog of data.blogs) {
        const { id, createdAt, updatedAt, ...rest } = blog
        await db.blogPost.upsert({
          where: { slug: blog.slug },
          create: rest,
          update: rest,
        })
      }
      restored.blogs = data.blogs.length
    }

    // Restore projects
    if (Array.isArray(data.projects)) {
      for (const project of data.projects) {
        const { id, createdAt, updatedAt, ...rest } = project
        await db.project.upsert({
          where: { slug: project.slug },
          create: rest,
          update: rest,
        })
      }
      restored.projects = data.projects.length
    }

    // Restore courses with chapters
    if (Array.isArray(data.courses)) {
      for (const course of data.courses) {
        const { id, createdAt, updatedAt, chapters, ...courseRest } = course
        const existingCourse = await db.course.findUnique({ where: { slug: course.slug } })
        let resolvedCourseId: string | undefined

        if (existingCourse) {
          await db.course.update({ where: { slug: course.slug }, data: courseRest })
          await db.courseChapter.deleteMany({ where: { courseId: existingCourse.id } })
          resolvedCourseId = existingCourse.id
        } else {
          const created = await db.course.create({ data: courseRest })
          resolvedCourseId = created.id
        }

        if (Array.isArray(chapters) && resolvedCourseId) {
          for (const chapter of chapters) {
            const { id: cid, createdAt: cca, updatedAt: cua, parentId: cp, ...chRest } = chapter
            await db.courseChapter.create({ data: { ...chRest, courseId: resolvedCourseId } as any })
          }
        }
      }
      restored.courses = data.courses.length
    }

    // Restore snippets (v2 format)
    if (Array.isArray(data.snippets)) {
      for (const snippet of data.snippets) {
        const { id, createdAt, updatedAt, ...rest } = snippet
        await db.codeSnippet.upsert({
          where: { slug: snippet.slug },
          create: rest,
          update: rest,
        })
      }
      restored.snippets = data.snippets.length
    }

    // Restore todos
    if (Array.isArray(data.todos)) {
      for (const todo of data.todos) {
        const { id, createdAt, updatedAt, ...rest } = todo
        await db.todo.create({ data: rest })
      }
      restored.todos = data.todos.length
    }

    // Restore comments (v2 format)
    if (Array.isArray(data.comments)) {
      for (const comment of data.comments) {
        const { id, createdAt, updatedAt, ...rest } = comment
        await db.comment.create({ data: rest })
      }
      restored.comments = data.comments.length
    }

    // Messages are read-only (don't restore contact messages from backup)

    const parts = Object.entries(restored).filter(([, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(', ')
    return NextResponse.json({
      success: true,
      restored,
      message: `Restored: ${parts || 'nothing'}`,
    })
  } catch (error) {
    console.error('Restore failed:', error)
    return NextResponse.json({ error: 'Restore failed: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}