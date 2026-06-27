import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [profile, blogs, projects, courses, messages, todos] = await Promise.all([
      db.profile.findFirst(),
      db.blogPost.findMany({ orderBy: { createdAt: 'desc' } }),
      db.project.findMany({ orderBy: { createdAt: 'desc' } }),
      db.course.findMany({ orderBy: { createdAt: 'desc' }, include: { chapters: { orderBy: { order: 'asc' } } } }),
      db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
      db.todo.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    const backup = {
      exportedAt: new Date().toISOString(),
      version: 1,
      data: { profile, blogs, projects, courses, messages, todos },
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'Invalid backup format: missing data' }, { status: 400 })
    }

    let restored = { profile: 0, blogs: 0, projects: 0, courses: 0, messages: 0, todos: 0 }

    // Restore profile
    if (data.profile) {
      const existing = await db.profile.findFirst()
      if (existing) {
        await db.profile.update({ where: { id: existing.id }, data: data.profile })
      } else {
        await db.profile.create({ data: { ...data.profile, id: undefined } })
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
          // Delete old chapters and re-create
          await db.courseChapter.deleteMany({ where: { courseId: existingCourse.id } })
          resolvedCourseId = existingCourse.id
        } else {
          const created = await db.course.create({ data: courseRest })
          resolvedCourseId = created.id
        }

        if (Array.isArray(chapters) && resolvedCourseId) {
          for (const chapter of chapters) {
            const { id: cid, createdAt: cca, updatedAt: cua, parentId: cp, ...chRest } = chapter
            // Remap parentId if needed
            await db.courseChapter.create({ data: { ...chRest, courseId: resolvedCourseId } })
          }
        }
      }
      restored.courses = data.courses.length
    }

    // Restore todos
    if (Array.isArray(data.todos)) {
      for (const todo of data.todos) {
        const { id, createdAt, updatedAt, ...rest } = todo
        await db.todo.create({ data: rest })
      }
      restored.todos = data.todos.length
    }

    // Messages are read-only (don't restore contact messages from backup)

    return NextResponse.json({
      success: true,
      restored,
      message: `Restored: ${restored.blogs} blogs, ${restored.projects} projects, ${restored.courses} courses, ${restored.todos} todos`,
    })
  } catch (error) {
    console.error('Restore failed:', error)
    return NextResponse.json({ error: 'Restore failed: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}