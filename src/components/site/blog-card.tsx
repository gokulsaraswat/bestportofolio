'use client'

import { motion } from 'framer-motion'
import { FileText, Youtube, Music, MessageCircle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BlogCardProps {
  blog: {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string
    type: string
    createdAt: string
    tags: string
  }
  index?: number
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  article: { icon: FileText, label: 'Article', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  youtube: { icon: Youtube, label: 'Video', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  spotify: { icon: Music, label: 'Podcast', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  tweet: { icon: MessageCircle, label: 'Tweet', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const config = typeConfig[blog.type] || typeConfig.article
  const TypeIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="aspect-[16/9] relative overflow-hidden">
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url(${blog.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className={`text-xs ${config.color}`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
          </div>
          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </CardTitle>
          {!blog.coverImage && (
            <Badge variant="outline" className={`text-xs w-fit ${config.color}`}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="mt-auto">
          {blog.excerpt && (
            <CardDescription className="text-sm line-clamp-3">
              {blog.excerpt}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}