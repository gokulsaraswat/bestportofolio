import { db } from '@/lib/db'
import type { MetadataRoute } from 'next'

const BASE_URL = '[https://gokulsaraswat.com](https://gokulsaraswat.com)'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects, courses, snippets] = await Promise.all([
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.project.findMany({ select: { slug: true, updatedAt: true } }),
    db.course.findMany({ select: { slug: true, updatedAt: true } }),
    db.codeSnippet.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/courses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/snippets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogs.map(b => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const projectPages: MetadataRoute.Sitemap = projects.map(p => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const coursePages: MetadataRoute.Sitemap = courses.map(c => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const snippetPages: MetadataRoute.Sitemap = snippets.map(s => ({
    url: `${BASE_URL}/snippets?view=${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages, ...projectPages, ...coursePages, ...snippetPages]
}