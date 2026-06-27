'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmbedUrlInput } from "@/components/embed-renderer" 
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { SortBar, SortOption } from './sort-bar'

interface Chapter {
  id: string
  title: string
  slug: string
  content: string
  order: number
  sectionName: string
  chapterType: string
  courseId: string
  parentId: string | null
  createdAt: string
  children?: Chapter[]
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  banner: string
  createdAt: string
  updatedAt: string
  _count?: { chapters: number }
}

interface CourseForm {
  title: string
  slug: string
  description: string
  banner: string
}

interface ChapterForm {
  title: string
  slug: string
  content: string
  sectionName: string
  chapterType: string
  order: number
  parentId: string | null
  embeds: string[] // Add this line
}

const emptyCourseForm: CourseForm = {
  title: '',
  slug: '',
  description: '',
  banner: '',
}

const emptyChapterForm: ChapterForm = {
  title: '',
  slug: '',
  content: '',
  sectionName: '',
  chapterType: 'content',
  order: 0,
  parentId: null,
  embeds: [], // Add this line
}

const courseSortOptions: SortOption[] = [
  { value: 'title:asc', label: 'Title A → Z' },
  { value: 'title:desc', label: 'Title Z → A' },
  { value: 'date:desc', label: 'Date Newest' },
  { value: 'date:asc', label: 'Date Oldest' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function ChapterTreeItem({
  chapter,
  onEdit,
  onDelete,
  onAddChild,
  depth = 0,
}: {
  chapter: Chapter
  onEdit: (ch: Chapter) => void
  onDelete: (ch: Chapter) => void
  onAddChild: (ch: Chapter) => void
  depth?: number
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = chapter.children && chapter.children.length > 0

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="flex-1 truncate text-sm">{chapter.title}</span>
        {chapter.sectionName && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
            {chapter.sectionName}
          </Badge>
        )}
        <span className="text-[10px] text-muted-foreground shrink-0">
          #{chapter.order}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onAddChild(chapter)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onEdit(chapter)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => onDelete(chapter)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {chapter.children!.map((child) => (
            <ChapterTreeItem
              key={child.id}
              chapter={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CourseManager() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [sortBy, setSortBy] = useState('date:desc')
  const [chapters, setChapters] = useState<Chapter[]>([])

  // Course dialog
  const [courseDialogOpen, setCourseDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourseForm)
  const [savingCourse, setSavingCourse] = useState(false)

  // Chapter dialog
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [chapterForm, setChapterForm] = useState<ChapterForm>(emptyChapterForm)
  const [savingChapter, setSavingChapter] = useState(false)
  const [chapterTab, setChapterTab] = useState<'edit' | 'preview'>('edit')

  // Delete dialogs
  const [deleteCourseTarget, setDeleteCourseTarget] = useState<Course | null>(null)
  const [deleteChapterTarget, setDeleteChapterTarget] = useState<Chapter | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Chapter preview
  const [previewChapter, setPreviewChapter] = useState<Chapter | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch {
      toast({ title: 'Failed to fetch courses', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchChapters = useCallback(
    async (courseId: string) => {
      try {
        const res = await fetch(`/api/courses/${courseId}/chapters`)
        if (res.ok) {
          const data = await res.json()
          setChapters(data)
        }
      } catch {
        toast({ title: 'Failed to fetch chapters', variant: 'destructive' })
      }
    },
    [toast]
  )

  const sortedCourses = useMemo(() => {
    const [field, dir] = sortBy.split(':')
    return [...courses].sort((a, b) => {
      let cmp = 0
      if (field === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (field === 'date') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return dir === 'desc' ? -cmp : cmp
    })
  }, [courses, sortBy])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const selectCourse = (course: Course) => {
    setSelectedCourse(course)
    fetchChapters(course.id)
  }

  // Course CRUD
  const openCreateCourse = () => {
    setEditingCourse(null)
    setCourseForm(emptyCourseForm)
    setCourseDialogOpen(true)
  }

  const openEditCourse = (course: Course) => {
    setEditingCourse(course)
    setCourseForm({
      title: course.title,
      slug: course.slug,
      description: course.description,
      banner: course.banner,
    })
    setCourseDialogOpen(true)
  }

  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }
    setSavingCourse(true)
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses'
      const method = editingCourse ? 'PUT' : 'POST'
      const body: Record<string, unknown> = { ...courseForm }
      if (!editingCourse) {
        body.slug = courseForm.slug || generateSlug(courseForm.title)
      }

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
        title: editingCourse ? 'Course updated' : 'Course created',
        description: `"${courseForm.title}" has been saved.`,
      })
      setCourseDialogOpen(false)
      fetchCourses()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save course',
        variant: 'destructive',
      })
    } finally {
      setSavingCourse(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!deleteCourseTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/courses/${deleteCourseTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Course deleted' })
      setDeleteCourseTarget(null)
      if (selectedCourse?.id === deleteCourseTarget.id) {
        setSelectedCourse(null)
        setChapters([])
      }
      fetchCourses()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  // Chapter CRUD
  const openCreateChapter = (parentId?: string) => {
    setEditingChapter(null)
    const maxOrder = chapters.length > 0
      ? Math.max(...chapters.map((c) => c.order), 0) + 1
      : 1
    setChapterForm({
      ...emptyChapterForm,
      order: maxOrder,
      parentId: parentId || null,
    })
    setChapterTab('edit')
    setChapterDialogOpen(true)
  }

  const openEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setChapterForm({
      title: chapter.title,
      slug: chapter.slug,
      content: chapter.content,
      sectionName: chapter.sectionName,
      chapterType: chapter.chapterType || 'content',
      order: chapter.order,
      parentId: chapter.parentId,
    })
    setChapterTab('edit')
    setChapterDialogOpen(true)
  }

  const handleSaveChapter = async () => {
    if (!chapterForm.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }
    if (!selectedCourse) return

    setSavingChapter(true)
    try {
      const url = editingChapter
        ? `/api/courses/${selectedCourse.id}/chapters/${editingChapter.id}`
        : `/api/courses/${selectedCourse.id}/chapters`
      const method = editingChapter ? 'PUT' : 'POST'

      const body: Record<string, unknown> = { ...chapterForm }

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
        title: editingChapter ? 'Chapter updated' : 'Chapter created',
        description: `"${chapterForm.title}" has been saved.`,
      })
      setChapterDialogOpen(false)
      fetchChapters(selectedCourse.id)
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save chapter',
        variant: 'destructive',
      })
    } finally {
      setSavingChapter(false)
    }
  }

  const handleDeleteChapter = async () => {
    if (!deleteChapterTarget || !selectedCourse) return
    setDeleting(true)
    try {
      const res = await fetch(
        `/api/courses/${selectedCourse.id}/chapters/${deleteChapterTarget.id}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: 'Chapter deleted' })
      setDeleteChapterTarget(null)
      fetchChapters(selectedCourse.id)
    } catch {
      toast({ title: 'Error', description: 'Failed to delete chapter', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <SortBar options={courseSortOptions} value={sortBy} onChange={setSortBy} />
        <Button onClick={openCreateCourse} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Course
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Course List */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <Card>
              <CardContent className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          ) : sortedCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No courses yet.</p>
                <Button variant="link" className="mt-1" onClick={openCreateCourse}>
                  Create your first course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="max-h-[520px] overflow-y-auto space-y-2">
              {sortedCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCourse?.id === course.id
                      ? 'ring-2 ring-primary shadow-md'
                      : ''
                  }`}
                  onClick={() => selectCourse(course)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{course.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {course._count?.chapters ?? 0} chapters
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditCourse(course)
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteCourseTarget(course)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Chapters Panel */}
        <Card>
          {selectedCourse ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {selectedCourse.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Created {format(new Date(selectedCourse.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <Button size="sm" onClick={() => openCreateChapter()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {chapters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No chapters yet.</p>
                    <Button
                      variant="link"
                      className="mt-1"
                      onClick={() => openCreateChapter()}
                    >
                      Add your first chapter
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    <div className="flex flex-col gap-0.5">
                      {chapters
                        .filter((c) => !c.parentId)
                        .map((chapter) => (
                          <ChapterTreeItem
                            key={chapter.id}
                            chapter={chapter}
                            onEdit={openEditChapter}
                            onDelete={setDeleteChapterTarget}
                            onAddChild={(ch) => openCreateChapter(ch.id)}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Layers className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Select a course to view its chapters</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</DialogTitle>
            <DialogDescription>
              {editingCourse
                ? 'Update course details.'
                : 'Fill in the details to create a new course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-title">Title *</Label>
              <Input
                id="course-title"
                placeholder="Course title"
                value={courseForm.title}
                onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-slug">Slug</Label>
              <Input
                id="course-slug"
                placeholder="auto-generated"
                value={courseForm.slug}
                onChange={(e) => setCourseForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-desc">Description</Label>
              <Textarea
                id="course-desc"
                placeholder="Course description"
                value={courseForm.description}
                onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-banner">Banner URL</Label>
              <Input
                id="course-banner"
                placeholder="https://..."
                value={courseForm.banner}
                onChange={(e) => setCourseForm((f) => ({ ...f, banner: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCourse} disabled={savingCourse}>
              {savingCourse ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chapter Dialog */}
      <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
            <DialogDescription>
              {editingChapter
                ? 'Update chapter details.'
                : 'Fill in the details for the new chapter.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4">
            <button
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                chapterTab === 'edit'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setChapterTab('edit')}
            >
              Edit
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                chapterTab === 'preview'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setChapterTab('preview')}
            >
              Preview
            </button>
          </div>

          {chapterTab === 'edit' ? (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ch-title">Title *</Label>
                  <Input
                    id="ch-title"
                    placeholder="Chapter title"
                    value={chapterForm.title}
                    onChange={(e) =>
                      setChapterForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ch-section">Section Name</Label>
                  <Input
                    id="ch-section"
                    placeholder="e.g., Getting Started"
                    value={chapterForm.sectionName}
                    onChange={(e) =>
                      setChapterForm((f) => ({ ...f, sectionName: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Chapter Type</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: 'content', label: 'Content' },
                      { value: 'hld', label: 'HLD' },
                      { value: 'lld', label: 'LLD' },
                      { value: 'api-design', label: 'API Design' },
                      { value: 'code', label: 'Code Block' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setChapterForm(f => ({ ...f, chapterType: opt.value }))}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          chapterForm.chapterType === opt.value
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'hover:border-primary/50 text-muted-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ch-slug">Slug</Label>
                <Input
                  id="ch-slug"
                  placeholder="auto-generated"
                  value={chapterForm.slug}
                  onChange={(e) =>
                    setChapterForm((f) => ({ ...f, slug: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ch-order">Order Number</Label>
                <Input
                  id="ch-order"
                  type="number"
                  min={0}
                  value={chapterForm.order}
                  onChange={(e) =>
                    setChapterForm((f) => ({
                      ...f,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              {/* ADD THIS BLOCK HERE */}
              <div className="flex flex-col gap-2">
                <Label>Embeds</Label>
                <EmbedUrlInput 
                  value={chapterForm.embeds} 
                  onChange={(v) => setChapterForm((f) => ({ ...f, embeds: v }))} 
                />
              </div>
              {/* END OF ADDITION */}

              
              <div className="flex flex-col gap-2">
                <Label htmlFor="ch-content">Content (Markdown)</Label>
                <Textarea
                  id="ch-content"
                  placeholder="Chapter content in markdown..."
                  value={chapterForm.content}
                  onChange={(e) =>
                    setChapterForm((f) => ({ ...f, content: e.target.value }))
                  }
                  rows={14}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="min-h-[200px] rounded-lg border p-6 prose prose-sm dark:prose-invert max-w-none">
              {chapterForm.title && (
                <h2 className="text-xl font-bold mb-2">{chapterForm.title}</h2>
              )}
              {chapterForm.content ? (
                <ReactMarkdown>{chapterForm.content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">No content to preview.</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setChapterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChapter} disabled={savingChapter}>
              {savingChapter ? 'Saving...' : editingChapter ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chapter Preview (from tree) */}
      <Dialog open={!!previewChapter} onOpenChange={() => setPreviewChapter(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewChapter?.title}</DialogTitle>
            {previewChapter?.sectionName && (
              <DialogDescription>Section: {previewChapter.sectionName}</DialogDescription>
            )}
          </DialogHeader>
          {previewChapter && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {previewChapter.content ? (
                <ReactMarkdown>{previewChapter.content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">No content.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation */}
      <AlertDialog open={!!deleteCourseTarget} onOpenChange={() => setDeleteCourseTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteCourseTarget?.title}&quot;? All
              chapters will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chapter Confirmation */}
      <AlertDialog open={!!deleteChapterTarget} onOpenChange={() => setDeleteChapterTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteChapterTarget?.title}&quot;? Child
              chapters will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChapter}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}