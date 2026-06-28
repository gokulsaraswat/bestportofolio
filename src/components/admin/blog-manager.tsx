'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, Search, X, CheckSquare, Square, EyeOff, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { EmbedUrlInput } from "@/components/embed-renderer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { SortBar, SortOption } from './sort-bar'
import { SeoPreview } from "@/components/admin/seo-preview"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string
  type: string
  embeds: string
  published: boolean
  writtenBy: string
  acceptedBy: string
  category: string
  scheduledAt: string
  createdAt: string
  updatedAt: string
}

interface BlogForm {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  tags: string
  type: string
  embeds: string
  published: boolean
  writtenBy: string
  acceptedBy: string
  category: string
  scheduledAt: string
}

const CATEGORY_SUGGESTIONS = ['Technology', 'Tutorial', 'Career', 'Personal', 'DevOps', 'System Design', 'Database', 'Open Source']

const emptyForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  type: 'article',
  embeds: '',
  published: false,
  writtenBy: '',
  acceptedBy: '',
  category: '',
  scheduledAt: '',
}

const blogSortOptions: SortOption[] = [
  { value: 'title:asc', label: 'Title A → Z' },
  { value: 'title:desc', label: 'Title Z → A' },
  { value: 'status:asc', label: 'Status Draft First' },
  { value: 'status:desc', label: 'Status Published First' },
  { value: 'date:desc', label: 'Date Newest' },
  { value: 'date:asc', label: 'Date Oldest' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatDatetimeLocal(isoString: string): string {
  const d = new Date(isoString)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function BlogManager() {
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date:desc')

  // Editor dialog
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [form, setForm] = useState<BlogForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Preview dialog
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null)

  // Active tab in editor
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit')

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        const res = await fetch(`/api/blogs?${params.toString()}`)
        if (!cancelled && res.ok) {
          const data = await res.json()
          setBlogs(data)
        }
      } catch {
        if (!cancelled) {
          toast({ title: 'Failed to fetch blogs', variant: 'destructive' })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [search, toast])

  const sortedBlogs = useMemo(() => {
    const [field, dir] = sortBy.split(':')
    const sorted = [...blogs].sort((a, b) => {
      let cmp = 0
      if (field === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (field === 'status') {
        const statusVal = (p: boolean) => (p ? 1 : 0)
        cmp = statusVal(a.published) - statusVal(b.published)
      } else if (field === 'date') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return dir === 'desc' ? -cmp : cmp
    })
    return sorted
  }, [blogs, sortBy])

  const openCreate = () => {
    setEditingBlog(null)
    setForm(emptyForm)
    setEditorTab('edit')
    setEditorOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      tags: blog.tags,
      type: blog.type,
      embeds: blog.embeds || '',
      published: blog.published,
      writtenBy: blog.writtenBy || '',
      acceptedBy: blog.acceptedBy || '',
      category: blog.category || '',
      scheduledAt: blog.scheduledAt ? formatDatetimeLocal(blog.scheduledAt) : '',
    })
    setEditorTab('edit')
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs'
      const method = editingBlog ? 'PUT' : 'POST'

      const body: Record<string, unknown> = { ...form }
      if (!editingBlog) {
        body.slug = form.slug || generateSlug(form.title)
      } else {
        if (form.title !== editingBlog.title) {
          body.slug = form.slug || generateSlug(form.title)
        }
      }

      // Convert scheduledAt from datetime-local to ISO string, or null
      if (form.scheduledAt) {
        body.scheduledAt = new Date(form.scheduledAt).toISOString()
      } else {
        body.scheduledAt = null
      }

      // Do NOT auto-publish when scheduling — API handles auto-publish at scheduled time

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      toast({
        title: editingBlog ? 'Blog updated' : 'Blog created',
        description: `"${form.title}" has been saved successfully.`,
      })
      setEditorOpen(false)
      void (async () => {
        try {
          const params = new URLSearchParams()
          if (search) params.set('search', search)
          const res = await fetch(`/api/blogs?${params.toString()}`)
          if (res.ok) {
            const data = await res.json()
            setBlogs(data)
          }
        } catch {
          toast({ title: 'Failed to fetch blogs', variant: 'destructive' })
        }
      })()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save blog',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/blogs/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Blog deleted', description: `"${deleteTarget.title}" has been removed.` })
      setDeleteTarget(null)
      void (async () => {
        try {
          const params = new URLSearchParams()
          if (search) params.set('search', search)
          const res = await fetch(`/api/blogs?${params.toString()}`)
          if (res.ok) {
            const data = await res.json()
            setBlogs(data)
          }
        } catch {
          toast({ title: 'Failed to fetch blogs', variant: 'destructive' })
        }
      })()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete blog', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  // ─── Bulk selection helpers ───────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === sortedBlogs.length) return new Set()
      return new Set(sortedBlogs.map((b) => b.id))
    })
  }, [sortedBlogs])

  const deselectAll = useCallback(() => setSelectedIds(new Set()), [])

  const isAllSelected = sortedBlogs.length > 0 && selectedIds.size === sortedBlogs.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < sortedBlogs.length

  // ─── Bulk actions ─────────────────────────────────────────
  const refreshBlogs = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      const res = await fetch(`/api/blogs?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
      }
    } catch {
      toast({ title: 'Failed to refresh blogs', variant: 'destructive' })
    }
  }, [search, toast])

  const bulkPublish = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    let success = 0
    let failed = 0
    const ids = [...selectedIds]
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: true }),
          })
          if (res.ok) success++
          else failed++
        } catch {
          failed++
        }
      })
    )
    setBulkLoading(false)
    setSelectedIds(new Set())
    toast({
      title: 'Bulk Publish Complete',
      description: `${success} published, ${failed} failed.`,
      variant: failed > 0 ? 'destructive' : 'default',
    })
    void refreshBlogs()
  }

  const bulkUnpublish = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    let success = 0
    let failed = 0
    const ids = [...selectedIds]
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: false }),
          })
          if (res.ok) success++
          else failed++
        } catch {
          failed++
        }
      })
    )
    setBulkLoading(false)
    setSelectedIds(new Set())
    toast({
      title: 'Bulk Unpublish Complete',
      description: `${success} unpublished, ${failed} failed.`,
      variant: failed > 0 ? 'destructive' : 'default',
    })
    void refreshBlogs()
  }

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    let success = 0
    let failed = 0
    const ids = [...selectedIds]
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
          if (res.ok) success++
          else failed++
        } catch {
          failed++
        }
      })
    )
    setBulkLoading(false)
    setBulkDeleteOpen(false)
    setSelectedIds(new Set())
    toast({
      title: 'Bulk Delete Complete',
      description: `${success} deleted, ${failed} failed.`,
      variant: failed > 0 ? 'destructive' : 'default',
    })
    void refreshBlogs()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 max-w-sm min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setLoading(true)
              }}
              className="pl-9"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSearch('')
                  setLoading(true)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <SortBar options={blogSortOptions} value={sortBy} onChange={setSortBy} />
        </div>
        <Button onClick={openCreate} size="sm" className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Blog
        </Button>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="sticky bottom-0 z-10 rounded-lg border bg-primary/5 backdrop-blur-sm p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span>{selectedIds.size} selected</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={bulkPublish}
                disabled={bulkLoading}
                className="text-xs"
              >
                {bulkLoading ? 'Publishing...' : 'Publish'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={bulkUnpublish}
                disabled={bulkLoading}
                className="text-xs"
              >
                {bulkLoading ? 'Unpublishing...' : 'Unpublish'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteOpen(true)}
                disabled={bulkLoading}
                className="text-xs"
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                className="text-xs"
              >
                Deselect All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">No blogs found.</p>
              <Button variant="link" className="mt-2" onClick={openCreate}>
                Create your first blog
              </Button>
            </div>
          ) : (
            <div className="max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] pl-4">
                      <Checkbox
                        checked={isAllSelected ? true : isIndeterminate ? 'indeterminate' : false}
                        onCheckedChange={toggleSelectAll}
                        className="h-4 w-4"
                      />
                    </TableHead>
                    <TableHead className="w-[40%]">Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBlogs.map((blog) => (
                    <TableRow key={blog.id} data-selected={selectedIds.has(blog.id) ? '' : undefined}>
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={selectedIds.has(blog.id)}
                          onCheckedChange={() => toggleSelect(blog.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{blog.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            /{blog.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="outline" className="text-xs capitalize">
                            {blog.type}
                          </Badge>
                          {blog.category && (
                            <Badge variant="secondary" className="text-[10px]">
                              {blog.category}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {blog.tags
                            .split(',')
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag.trim()}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={blog.published ? 'default' : 'secondary'}
                            className="text-xs w-fit"
                          >
                            {blog.published ? 'Published' : 'Draft'}
                          </Badge>
                          {blog.scheduledAt && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(blog.scheduledAt), 'MMM d, yyyy HH:mm')}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPreviewBlog(blog)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(blog)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(blog)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog — improved layout for laptop */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create Blog'}</DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Update the blog post details.' : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>

          {/* Tab toggle for edit/preview */}
          <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4">
            <button
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                editorTab === 'edit'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setEditorTab('edit')}
            >
              Edit
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                editorTab === 'preview'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setEditorTab('preview')}
            >
              Preview
            </button>
          </div>

          {editorTab === 'edit' ? (
            <div className="flex flex-col gap-4">
              {/* Row 1: Title + Slug + Type on one line on lg */}
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_160px]">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-title">Title *</Label>
                  <Input
                    id="blog-title"
                    placeholder="Blog post title"
                    value={form.title}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-slug">Slug</Label>
                  <Input
                    id="blog-slug"
                    placeholder="auto-generated-from-title"
                    value={form.slug}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-type">Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(val) => setForm((f) => ({ ...f, type: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="spotify">Spotify</SelectItem>
                      <SelectItem value="tweet">Tweet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Embeds (conditional) */}
              {form.type !== 'article' && (
                <div className="flex flex-col gap-2">
                  <Label>Embeds</Label>
                  <EmbedUrlInput
                    value={form.embeds}
                    onChange={(v) => setForm((f) => ({ ...f, embeds: v }))}
                  />
                </div>
              )}

              

              {/* Row 2: Excerpt + Cover Image side by side on lg */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-excerpt">Excerpt</Label>
                  <Textarea
                    id="blog-excerpt"
                    placeholder="Short description of the blog post"
                    value={form.excerpt}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-cover">Cover Image URL</Label>
                  <Input
                    id="blog-cover"
                    placeholder="https://..."
                    value={form.coverImage}
                    onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  />
                  <Label htmlFor="blog-tags" className="mt-2">Tags (comma-separated)</Label>
                  <Input
                    id="blog-tags"
                    placeholder="react, nextjs, typescript"
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  />
                  <Label htmlFor="blog-category" className="mt-2">Category</Label>
                  <Input
                    id="blog-category"
                    placeholder="e.g. Technology, Tutorial, Career"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {CATEGORY_SUGGESTIONS.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                          form.category === cat
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                        }`}
                        onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="blog-written-by">Written By (Maker)</Label>
                  <Input
                    id="blog-written-by"
                    placeholder="Author name"
                    value={form.writtenBy}
                    onChange={(e) => setForm((f) => ({ ...f, writtenBy: e.target.value }))}
                  />
                  <Label htmlFor="blog-accepted-by">Accepted By (Checker)</Label>
                  <Input
                    id="blog-accepted-by"
                    placeholder="Reviewer name"
                    value={form.acceptedBy}
                    onChange={(e) => setForm((f) => ({ ...f, acceptedBy: e.target.value }))}
                  />
                </div>
              </div>

              {/* SEO Preview */}
              <SeoPreview
                title={form.title}
                slug={form.slug}
                description={form.excerpt}
              />

              {/* Content — full width, taller on lg */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="blog-content">Content (Markdown)</Label>
                <Textarea
                  id="blog-content"
                  placeholder="Write your blog content in markdown..."
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={14}
                  className="font-mono text-sm lg:row-[20]"
                />
              </div>

              {/* Published toggle + Schedule */}
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(checked) => setForm((f) => ({ ...f, published: checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Published</Label>
                    {form.scheduledAt && !form.published && (
                      <Badge className="bg-amber-500 text-white border-amber-500 text-[10px]">Scheduled</Badge>
                    )}
                    {form.scheduledAt && form.published && (
                      <Badge className="bg-green-600 text-white border-green-600 text-[10px]">Published</Badge>
                    )}
                    {!form.scheduledAt && !form.published && (
                      <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                    )}
                    {!form.scheduledAt && form.published && (
                      <Badge variant="default" className="text-[10px]">Published</Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Make this blog visible to the public
                </p>
                <div className="flex flex-col gap-1.5 mt-1">
                  <Label htmlFor="blog-scheduled-at" className="text-sm font-medium">Schedule Publishing</Label>
                  <Input
                    id="blog-scheduled-at"
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                    className="max-w-xs"
                  />
                  {form.scheduledAt && !form.published && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Will auto-publish at the scheduled time. Keep published off.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[200px] rounded-lg border p-6 prose prose-sm dark:prose-invert max-w-none">
              {form.title && <h1 className="text-2xl font-bold mb-2">{form.title}</h1>}
              {form.excerpt && (
                <p className="text-muted-foreground mb-4 italic">{form.excerpt}</p>
              )}
              {form.content ? (
                <ReactMarkdown>{form.content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">No content to preview.</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingBlog ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog (from table) */}
      <Dialog open={!!previewBlog} onOpenChange={() => setPreviewBlog(null)}>
        <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewBlog?.title}</DialogTitle>
            <DialogDescription>
              {previewBlog && format(new Date(previewBlog.createdAt), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          {previewBlog && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {previewBlog.excerpt && (
                <p className="text-muted-foreground italic mb-4">{previewBlog.excerpt}</p>
              )}
              {previewBlog.content ? (
                <ReactMarkdown>{previewBlog.content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">No content.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Blogs?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.size} selected blog{selectedIds.size !== 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={bulkDelete}
              disabled={bulkLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkLoading ? 'Deleting...' : `Delete ${selectedIds.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
