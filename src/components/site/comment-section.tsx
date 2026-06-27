'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Comment {
  id: string
  name: string
  email: string
  content: string
  entityType: string
  entityId: string
  createdAt: string
}

export function CommentSection({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?entityType=${entityType}&entityId=${entityId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [entityType, entityId])

  useEffect(() => { fetchComments() }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) {
      toast({ title: 'Name and comment are required', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, entityType, entityId }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Comment posted!' })
      setForm({ name: '', email: '', content: '' })
      fetchComments()
    } catch {
      toast({ title: 'Failed to post comment', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 pt-8 border-t"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <Card className="mb-8">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`cmt-name-${entityId}`} className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Name *
                </Label>
                <Input
                  id={`cmt-name-${entityId}`}
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cmt-email-${entityId}`} className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email (optional)
                </Label>
                <Input
                  id={`cmt-email-${entityId}`}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cmt-content-${entityId}`}>Comment *</Label>
              <Textarea
                id={`cmt-content-${entityId}`}
                placeholder="Share your thoughts..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={3}
              />
            </div>
            <Button type="submit" disabled={submitting} size="sm" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i}><CardContent className="p-5 space-y-2">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              <div className="h-12 w-full rounded bg-muted animate-pulse mt-2" />
            </CardContent></Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No comments yet. Be the first!</p>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {comments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                layout
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{comment.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed ml-10">{comment.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}