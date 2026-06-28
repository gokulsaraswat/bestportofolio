'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RelatedContentProps {
  entityType: 'blog' | 'project'
  currentSlug: string
  currentTags?: string[]
  limit?: number
}

interface RelatedItem {
  id: string
  title: string
  slug: string
  coverImage?: string
  banner?: string
  tags?: string
  stack?: string
  createdAt: string
}

const gradients = [
  'from-rose-500/20 via-orange-400/10 to-amber-500/20',
  'from-emerald-500/20 via-teal-400/10 to-cyan-500/20',
  'from-violet-500/20 via-purple-400/10 to-fuchsia-500/20',
  'from-sky-500/20 via-blue-400/10 to-indigo-500/20',
  'from-lime-500/20 via-green-400/10 to-emerald-500/20',
  'from-pink-500/20 via-rose-400/10 to-red-500/20',
]

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function parseTags(item: RelatedItem, entityType: 'blog' | 'project'): string[] {
  if (entityType === 'blog') {
    return item.tags ? item.tags.split(',').filter(Boolean).map(t => t.trim().toLowerCase()) : []
  }
  try {
    const parsed = item.stack ? JSON.parse(item.stack) : []
    return parsed.map((s: string) => s.trim().toLowerCase())
  } catch {
    return []
  }
}

function getRelevanceScore(item: RelatedItem, currentTags: string[], entityType: 'blog' | 'project'): number {
  const itemTags = parseTags(item, entityType)
  const current = currentTags.map(t => t.trim().toLowerCase())
  return itemTags.filter(tag => current.includes(tag)).length
}

export function RelatedContent({ entityType, currentSlug, currentTags = [], limit = 3 }: RelatedContentProps) {
  const [items, setItems] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = entityType === 'blog' ? '/api/blogs?published=true' : '/api/projects'
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [entityType])

  const relatedItems = useMemo(() => {
    if (!items.length || !currentTags.length) return []

    const scored = items
      .filter((item: RelatedItem) => item.slug !== currentSlug)
      .map((item: RelatedItem) => ({
        ...item,
        score: getRelevanceScore(item, currentTags, entityType),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

    return scored.slice(0, limit)
  }, [items, currentSlug, currentTags, entityType, limit])

  if (loading || relatedItems.length === 0) return null

  const basePath = entityType === 'blog' ? '/blog' : '/projects'

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold tracking-tight">You Might Also Like</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div
        className="
          flex overflow-x-auto gap-4 snap-x snap-mandatory pb-2
          sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:pb-0
          lg:grid-cols-3
          [&::-webkit-scrollbar]:h-1.5
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-muted
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20
          [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40
        "
      >
        {relatedItems.map((item, i) => {
          const tags = parseTags(item, entityType)
          const image = entityType === 'blog' ? item.coverImage : item.banner
          const gradient = gradients[i % gradients.length]

          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="min-w-[280px] snap-start sm:min-w-0"
            >
              <Link href={`${basePath}/${item.slug}`} className="block group">
                <Card className="overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] h-full py-0 gap-0">
                  {/* Image / placeholder */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {image ? (
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
                  </div>

                  <CardContent className="p-4 flex flex-col gap-3">
                    {/* Title */}
                    <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Tags / stack badges */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 3 && (
                          <Badge variant="outline" className="text-[10px] font-normal">
                            +{tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Date + arrow */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}