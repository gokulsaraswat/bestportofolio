// Sample content for checking the public pages. Every slug starts with "sample-".
// The blog post is an unpublished draft. Projects and courses have no published flag, so they are public until removed.
// Seed:   npm run db:seed
// Remove: npm run db:seed -- --clean
import { PrismaClient } from '@prisma/client'

const PREFIX = 'sample-'
const db = new PrismaClient()

async function clean() {
  const where = { slug: { startsWith: PREFIX } }
  const [blogs, projects, courses] = await Promise.all([
    db.blogPost.deleteMany({ where }),
    db.project.deleteMany({ where }),
    db.course.deleteMany({ where }),
  ])
  console.table({ blogs: blogs.count, projects: projects.count, courses: courses.count })
}

async function seed() {
  await db.blogPost.upsert({
    where: { slug: 'sample-blog' },
    update: {},
    create: {
      title: 'Sample Blog Post',
      slug: 'sample-blog',
      excerpt: 'Placeholder post for page checks.',
      content: '# Sample Blog Post\n\nPlaceholder text.\n\n## Code\n\n```ts\nconsole.log("hello")\n```',
      tags: 'sample',
      category: 'Sample',
      published: false,
    },
  })

  await db.project.upsert({
    where: { slug: 'sample-project' },
    update: {},
    create: {
      title: 'Sample Project',
      slug: 'sample-project',
      description: 'Placeholder project for page checks.',
      shortDesc: 'Placeholder project',
      stack: JSON.stringify(['TypeScript', 'Next.js']),
      process: '1. Plan\n2. Build\n3. Ship',
      results: 'Placeholder results.',
    },
  })

  const course = await db.course.upsert({
    where: { slug: 'sample-course' },
    update: {},
    create: { title: 'Sample Course', slug: 'sample-course', description: 'Placeholder course for page checks.' },
  })
  const chapters = [
    { title: 'Sample Chapter One', slug: 'sample-chapter-one', content: '# Chapter One\n\nPlaceholder text.', order: 0, sectionName: 'Basics' },
    { title: 'Sample Chapter Two', slug: 'sample-chapter-two', content: '# Chapter Two\n\nPlaceholder text.', order: 1, sectionName: 'Basics' },
  ]
  for (const ch of chapters) {
    const exists = await db.courseChapter.findFirst({ where: { courseId: course.id, slug: ch.slug } })
    if (!exists) await db.courseChapter.create({ data: { ...ch, courseId: course.id } })
  }

  console.log('Seeded sample-blog (draft), sample-project, sample-course (2 chapters)')
}

try {
  await (process.argv.includes('--clean') ? clean() : seed())
} catch (e) {
  console.error('SEED FAILED:', e.message)
  process.exitCode = 1
} finally {
  await db.$disconnect()
}
