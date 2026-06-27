'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { ThemedCodeBlock } from '@/components/site/themed-code-block'
import { ArrowLeft, Calendar, Tag, Play, Music, MessageCircle, Share2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar, Footer } from '@/components/site/navbar'
import { CommentSection } from '@/components/site/comment-section'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { EmbedList } from "@/components/embed-renderer"

const typeIcons: Record<string, React.ElementType> = {
  youtube: Play, spotify: Music, tweet: MessageCircle, article: FileText,
}

interface Blog {
  id: string; title: string; slug: string; excerpt: string; content: string
  coverImage: string; tags: string; type: string; embedUrl: string; embeds: string
  behindTheScenes: string; published: boolean; createdAt: string
}
export default function BlogDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/blogs?published=true`)
      .then(r => r.json())
      .then(data => {
        const found = data.find((b: Blog) => b.slug === params.slug)
        if (found) setBlog(found)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: 'Link copied!' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 px-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-8 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
            <div className="h-64 w-full rounded-xl bg-muted animate-pulse mt-6" />
          </div>
        </main>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 px-4 text-center">
          <p className="text-muted-foreground mb-4">Post not found</p>
          <Button asChild variant="outline"><Link href="/blog" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Blog</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  const TypeIcon = typeIcons[blog.type] || FileText

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <motion.article
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/blog"><ArrowLeft className="h-4 w-4" />Back to Blog</Link>
          </Button>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="gap-1 text-xs">
                <TypeIcon className="h-3 w-3" />
                {blog.type}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{blog.title}</h1>
            {blog.excerpt && (
              <p className="mt-3 text-lg text-muted-foreground">{blog.excerpt}</p>
            )}
            {blog.tags && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {blog.tags.split(',').filter(Boolean).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs gap-1">
                    <Tag className="h-3 w-3" />{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </motion.header>

          {/* Cover Image */}
          {blog.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 aspect-video rounded-xl overflow-hidden bg-muted"
            >
              <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
            </motion.div>
          )}

          {/* Embed (YouTube/Spotify/Tweet) */}
          {(blog.type === 'youtube' || blog.type === 'spotify' || blog.type === 'tweet') && blog.embedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              {blog.type === 'youtube' && (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={blog.embedUrl.replace('watch?v=', 'embed/')}
                    className="h-full w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}
              {blog.type === 'spotify' && (
                <iframe
                  src={blog.embedUrl}
                  className="w-full rounded-xl"
                  style={{ minHeight: 352 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              )}
              {blog.type === 'tweet' && (
                <div className="rounded-xl border p-4">
                  <blockquote className="text-sm">{blog.content || blog.excerpt}</blockquote>
                  <a href={blog.embedUrl} target="_blank" rel="noreferrer" className="text-xs text-primary mt-2 inline-block hover:underline">
                    View on X.com
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Content (markdown) */}
          {blog.content && blog.type === 'article' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-transparent prose-pre:p-0
                prose-img:rounded-xl
                mb-8"
            >
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const inline = !match
                    return inline ? (
                      <code className={className} {...props}>{children}</code>
                    ) : (
                      <ThemedCodeBlock language={match[1]}>{String(children)}</ThemedCodeBlock>
                    )
                  },
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </motion.div>
          )}

          {/* Behind the Scenes */}
          {blog.behindTheScenes && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 rounded-xl border border-dashed p-6"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Behind the Scenes</h3>
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown>{blog.behindTheScenes}</ReactMarkdown>
              </div>
            </motion.div>
          )}
                    {/* Embeds */}
          {blog.embeds && <EmbedList urls={blog.embeds} />}
          
          {/* Share */}
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog" className="gap-1.5"><ArrowLeft className="h-4 w-4" />All Posts</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" />Share
            </Button>
          </div>
          {/* Comments */}
          <CommentSection entityType="blog" entityId={blog.slug} />
        </motion.article>
      </main>
      <Footer />
    </div>
  )
}