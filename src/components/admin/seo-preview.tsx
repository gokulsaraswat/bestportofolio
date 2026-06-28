'use client'

import { useMemo } from 'react'
import { Eye, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SeoPreviewProps {
  title: string
  slug?: string
  description?: string
  siteUrl?: string
}

function truncate(text: string, maxLen: number): string {
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

export function SeoPreview({
  title,
  slug,
  description,
  siteUrl = 'gokulsaraswat.com',
}: SeoPreviewProps) {
  const displayUrl = useMemo(() => {
    if (!slug) return `https://${siteUrl}`
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug
    return `https://${siteUrl}/${cleanSlug}`
  }, [slug, siteUrl])

  const displayTitle = useMemo(() => truncate(title || 'Untitled Page', 60), [title])
  const displayDescription = useMemo(() => truncate(description || '', 155), [description])

  const hasContent = title || slug || description

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Eye className="h-3.5 w-3.5" />
        SEO Preview
      </label>

      <Card className="max-w-xl border border-border/60 bg-background">
        <CardContent className="p-4">
          {hasContent ? (
            <div className="space-y-1">
              {/* Favicon + URL row */}
              <div className="flex items-center gap-2 text-xs">
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-[#006621] dark:text-green-500/70">
                  {displayUrl}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[18px] leading-snug font-normal text-[#1a0dab] dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {displayTitle}
              </h3>

              {/* Description */}
              {displayDescription && (
                <p className="text-[14px] leading-[20px] font-normal text-[#4d5156] dark:text-muted-foreground line-clamp-2">
                  {displayDescription}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Start typing to see a live Google search preview...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Character count hints */}
      {hasContent && (
        <div className="flex gap-4 text-[11px] text-muted-foreground">
          <span className={title.length > 60 ? 'text-amber-500' : ''}>
            Title: {title.length}/60
          </span>
          {description !== undefined && (
            <span className={description.length > 155 ? 'text-amber-500' : ''}>
              Description: {description.length}/155
            </span>
          )}
        </div>
      )}
    </div>
  )
}