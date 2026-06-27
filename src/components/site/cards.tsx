'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Play, Music, MessageCircle, ArrowRight, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface Blog {
  id: string; title: string; slug: string; excerpt: string; coverImage: string
  tags: string; type: string; embedUrl: string; published: boolean; createdAt: string
  writtenBy: string; acceptedBy: string
}

interface Project {
  id: string; title: string; slug: string; shortDesc: string; banner: string
  website: string; repository: string; downloadLink: string; stack: string; videoUrl: string; featured: boolean; complexity?: number; createdAt: string
}

interface Course {
  id: string; title: string; slug: string; description: string; banner: string; _count?: { chapters: number }
}

const typeIcons: Record<string, React.ElementType> = {
  youtube: Play, spotify: Music, tweet: MessageCircle,
}

function TypeIcon({ type }: { type: string }) {
  const Icon = typeIcons[type] || null
  return Icon ? <Icon className="h-3.5 w-3.5" /> : null
}

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="block group">
    <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
      {blog.coverImage ? (
        <div className="aspect-video overflow-hidden bg-muted">
          <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-video overflow-hidden bg-muted">
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <Play className="h-8 w-8 text-muted-foreground/30" />
          </div>
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="gap-1 text-[10px]">
            <TypeIcon type={blog.type} />
            {blog.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <h3 className="font-semibold leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.excerpt}</p>
        {blog.tags && (
          <div className="flex flex-wrap gap-1 mb-2">
            {blog.tags.split(',').filter(Boolean).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag.trim()}</Badge>
            ))}
          </div>
        )}
        {(blog.writtenBy || blog.acceptedBy) && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1 border-t">
            {blog.writtenBy && <span>By <span className="font-medium text-foreground/80">{blog.writtenBy}</span></span>}
            {blog.acceptedBy && <span>· Accepted by <span className="font-medium text-foreground/80">{blog.acceptedBy}</span></span>}
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()
  const stack = project.stack ? JSON.parse(project.stack) : []

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click was directly on the card (not on a button/link)
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) return
    router.push(`/projects/${project.slug}`)
  }

  return (
    <div onClick={handleCardClick} className="block group cursor-pointer">
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
      <div className="aspect-video overflow-hidden bg-muted relative">
        {project.banner ? (
          <img src={project.banner} alt={project.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : project.videoUrl ? (
          <video
            src={project.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
            onMouseEnter={e => (e.target as HTMLVideoElement).play()}
            onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0 }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary/20">{project.title.charAt(0)}</span>
          </div>
        )}
        {project.featured && (
          <Badge className="absolute top-3 right-3">Featured</Badge>
        )}
        {project.videoUrl && !project.banner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-black/40 flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.shortDesc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {stack.slice(0, 5).map((s: string) => (
            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
          ))}
          {stack.length > 5 && <Badge variant="secondary" className="text-[10px]">+{stack.length - 5}</Badge>}
        </div>
        {project.complexity && project.complexity > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3].map((level) => (
              <svg key={level} className={`h-4 w-4 ${level <= project.complexity! ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/25 fill-muted-foreground/25'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              {project.complexity === 1 ? 'Simple' : project.complexity === 2 ? 'Medium' : 'Enterprise'}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium text-xs gap-1 h-8 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />Visit
            </a>
          )}
          {project.downloadLink && (
            <a
              href={project.downloadLink}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium text-xs gap-1 h-8 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-3 w-3" />Download
            </a>
          )}
          {project.repository && (
            <a
              href={project.repository}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium text-xs gap-1 h-8 px-3 rounded-md border border-input bg-background hover:bg-accent transition-colors"
            >
              <Github className="h-3 w-3" />Code
            </a>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block group">
    <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
      {course.banner ? (
        <div className="aspect-video overflow-hidden bg-muted">
          <img src={course.banner} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-video overflow-hidden bg-muted">
          <div className="h-full w-full bg-gradient-to-br from-violet-500/10 to-violet-500/5 flex items-center justify-center">
            <span className="text-3xl font-bold text-violet-500/20">{course.title.charAt(0)}</span>
          </div>
        </div>
      )}
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{course._count?.chapters || 0} chapters</span>
          <span className="text-xs font-medium text-primary group-hover:underline">Start Learning →</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}><CardContent className="p-5 space-y-3">
          <Skeleton className="h-32 w-full rounded" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent></Card>
      ))}
    </div>
  )
}