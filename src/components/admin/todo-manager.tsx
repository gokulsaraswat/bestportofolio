'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, CheckCircle2, Circle, Clock, AlertCircle,
  Edit3, Save, X, User, FileText, History, ChevronDown,
  ArrowRight, Archive, Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { SortBar, SortOption } from './sort-bar'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Todo {
  id: string
  title: string
  description: string
  status: string
  priority: string
  entityType: string
  entityId: string
  assignee: string
  remarks: string
  completedAt: string | null
  archived: boolean
  dueDate: string
  createdAt: string
  updatedAt: string
}

interface TodoForm {
  title: string
  description: string
  status: string
  priority: string
  entityType: string
  entityId: string
  assignee: string
  dueDate: string
}

interface HistoryEntry {
  id: string
  action: string
  field: string
  oldValue: string
  newValue: string
  actor: string
  createdAt: string
}

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:       { label: 'Draft',       color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30',       icon: Circle },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',   icon: Clock },
  review:      { label: 'Review',      color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',    icon: AlertCircle },
  done:        { label: 'Completed',   color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30', icon: CheckCircle2 },
}

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  low:    { label: 'Low',    color: 'text-sky-500',   dot: 'bg-sky-400' },
  medium: { label: 'Medium', color: 'text-amber-500', dot: 'bg-amber-400' },
  high:   { label: 'High',   color: 'text-rose-500',  dot: 'bg-rose-400' },
}

const entityTypeOptions = [
  { value: 'general', label: 'General' },
  { value: 'blog',    label: 'Blog Post' },
  { value: 'project', label: 'Project' },
  { value: 'course',  label: 'Course' },
  { value: 'profile', label: 'Profile' },
  { value: 'media',   label: 'Media / Screenshot' },
  { value: 'content', label: 'Content / Copy' },
]

const todoSortOptions: SortOption[] = [
  { value: 'title:asc',  label: 'Title A → Z' },
  { value: 'title:desc', label: 'Title Z → A' },
  { value: 'status:asc',  label: 'Status Draft First' },
  { value: 'status:desc', label: 'Status Completed First' },
  { value: 'priority:desc', label: 'Priority High First' },
  { value: 'priority:asc',  label: 'Priority Low First' },
  { value: 'date:desc',   label: 'Date Newest' },
  { value: 'date:asc',    label: 'Date Oldest' },
]

const completedSortOptions: SortOption[] = [
  { value: 'completedAt:desc', label: 'Recently Completed' },
  { value: 'completedAt:asc',  label: 'Completed Long Ago' },
  { value: 'title:asc',        label: 'Title A → Z' },
  { value: 'title:desc',       label: 'Title Z → A' },
]

const emptyForm: TodoForm = {
  title: '',
  description: '',
  status: 'draft',
  priority: 'medium',
  entityType: 'general',
  entityId: '',
  assignee: '',
  dueDate: '',
}

const statusOrder: Record<string, number> = { draft: 0, 'in-progress': 1, review: 2, done: 3 }
const priorityOrder: Record<string, number> = { high: 2, medium: 1, low: 0 }

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TodoManager() {
  const { toast } = useToast()

  /* ---- data ---- */
  const [activeTodos, setActiveTodos] = useState<Todo[]>([])
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [completedLoading, setCompletedLoading] = useState(false)
  const [completedLoaded, setCompletedLoaded] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [search, setSearch] = useState('')

  /* ---- sort ---- */
  const [sortBy, setSortBy] = useState('date:desc')
  const [completedSortBy, setCompletedSortBy] = useState('completedAt:desc')

  /* ---- filter ---- */
  const [statusFilter, setStatusFilter] = useState('all')

  /* ---- editor dialog ---- */
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [form, setForm] = useState<TodoForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  /* ---- complete dialog ---- */
  const [completeTarget, setCompleteTarget] = useState<Todo | null>(null)
  const [completeRemarks, setCompleteRemarks] = useState('')
  const [completing, setCompleting] = useState(false)

  /* ---- history dialog ---- */
  const [historyTodo, setHistoryTodo] = useState<Todo | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  /* ---- delete ---- */
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null)
  const [deleting, setDeleting] = useState(false)

  /* ================================================================ */
  /*  Data fetching                                                     */
  /* ================================================================ */

  const fetchActiveTodos = async () => {
  try {
    const params = new URLSearchParams()
    params.set('includeArchived', 'false')
    const res = await fetch(`/api/todos?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      setActiveTodos(data.filter((t: Todo) => t.status !== 'done'))
    }
  } catch {
    toast({ title: 'Failed to fetch todos', variant: 'destructive' })
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  let cancelled = false
  void (async () => {
    try {
      const params = new URLSearchParams()
      params.set('includeArchived', 'false')
      const res = await fetch(`/api/todos?${params.toString()}`)
      if (!cancelled && res.ok) {
        const data = await res.json()
        setActiveTodos(data.filter((t: Todo) => t.status !== 'done'))
      }
    } catch {
      if (!cancelled) toast({ title: 'Failed to fetch todos', variant: 'destructive' })
    } finally {
      if (!cancelled) setLoading(false)
    }
  })()
  return () => { cancelled = true }
}, [toast])

  const fetchCompletedTodos = useCallback(async () => {
    setCompletedLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('includeArchived', 'true')
      params.set('status', 'done')
      const res = await fetch(`/api/todos?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCompletedTodos(data)
        setCompletedLoaded(true)
      }
    } catch {
      toast({ title: 'Failed to fetch completed todos', variant: 'destructive' })
    } finally {
      setCompletedLoading(false)
    }
  }, [toast])

 

  /* ================================================================ */
  /*  Sorting & filtering                                               */
  /* ================================================================ */

  const sortTodos = useCallback((items: Todo[], sortKey: string) => {
    const [field, dir] = sortKey.split(':')
    return [...items].sort((a, b) => {
      let cmp = 0
      if (field === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else if (field === 'status') {
        cmp = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
      } else if (field === 'priority') {
        cmp = (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0)
      } else if (field === 'date') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (field === 'completedAt') {
        const at = a.completedAt ? new Date(a.completedAt).getTime() : 0
        const bt = b.completedAt ? new Date(b.completedAt).getTime() : 0
        cmp = at - bt
      }
      return dir === 'desc' ? -cmp : cmp
    })
  }, [])

  const filteredActive = useMemo(() => {
    let items = activeTodos
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      items = items.filter(t => t.status === statusFilter)
    }
    return sortTodos(items, sortBy)
  }, [activeTodos, search, statusFilter, sortBy, sortTodos])

  const sortedCompleted = useMemo(() => {
    return sortTodos(completedTodos, completedSortBy)
  }, [completedTodos, completedSortBy, sortTodos])

  /* ================================================================ */
  /*  CRUD                                                              */
  /* ================================================================ */

  const resetForm = () => {
    setForm(emptyForm)
    setEditingTodo(null)
  }

  const openCreate = () => {
    resetForm()
    setEditorOpen(true)
  }

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setForm({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      entityType: todo.entityType,
      entityId: todo.entityId,
      assignee: todo.assignee,
      dueDate: todo.dueDate,
    })
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editingTodo ? `/api/todos/${editingTodo.id}` : '/api/todos'
      const method = editingTodo ? 'PUT' : 'POST'
      const body: Record<string, unknown> = { ...form, actor: 'admin' }
      if (editingTodo && editingTodo.archived) {
        // Post-completion edit — unarchive first so API processes the update
        body.archived = false
      }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      const saved = await res.json()

      toast({ title: editingTodo ? 'Todo updated' : 'Todo created' })
      setEditorOpen(false)
      resetForm()

      // Refresh the appropriate list
      if (saved.archived) {
        if (completedLoaded) fetchCompletedTodos()
      } else {
        fetchActiveTodos()
      }
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/todos/${deleteTarget.id}`, { method: 'DELETE' })
      toast({ title: 'Todo deleted' })
      setDeleteTarget(null)
      if (deleteTarget.archived) {
        setCompletedTodos(prev => prev.filter(t => t.id !== deleteTarget.id))
      } else {
        setActiveTodos(prev => prev.filter(t => t.id !== deleteTarget.id))
      }
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (todo: Todo, newStatus: string) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actor: 'admin' }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()

      if (newStatus === 'done') {
        // Move from active to completed
        setActiveTodos(prev => prev.filter(t => t.id !== todo.id))
        if (completedLoaded) {
          setCompletedTodos(prev => [updated, ...prev])
        }
        toast({ title: 'Todo completed', description: `"${todo.title}" moved to completed.` })
      } else {
        setActiveTodos(prev => prev.map(t => t.id === todo.id ? updated : t))
        toast({ title: `Status changed to ${statusConfig[newStatus]?.label || newStatus}` })
      }
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' })
    }
  }

  const handleComplete = async () => {
    if (!completeTarget) return
    setCompleting(true)
    try {
      const res = await fetch(`/api/todos/${completeTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'done',
          remarks: completeRemarks,
          actor: 'admin',
        }),
      })
      if (!res.ok) throw new Error()

      setActiveTodos(prev => prev.filter(t => t.id !== completeTarget.id))
      if (completedLoaded) {
        const updated = await res.json()
        setCompletedTodos(prev => [updated, ...prev])
      }

      toast({ title: 'Todo completed', description: `"${completeTarget.title}" moved to completed.` })
      setCompleteTarget(null)
      setCompleteRemarks('')
    } catch {
      toast({ title: 'Failed to complete', variant: 'destructive' })
    } finally {
      setCompleting(false)
    }
  }

  /* ---- History (loaded on demand) ---- */
  const openHistory = async (todo: Todo) => {
    setHistoryTodo(todo)
    setHistory([])
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/todos/${todo.id}/history`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch {
      toast({ title: 'Failed to load history', variant: 'destructive' })
    } finally {
      setHistoryLoading(false)
    }
  }

  /* ================================================================ */
  /*  Status counts                                                     */
  /* ================================================================ */

  const statusCounts = useMemo(() => {
    const counts = { all: activeTodos.length, draft: 0, 'in-progress': 0, review: 0 }
    activeTodos.forEach(t => {
      if (t.status in counts) (counts as Record<string, number>)[t.status]++
    })
    return counts
  }, [activeTodos])

  /* ================================================================ */
  /*  Render                                                            */
  /* ================================================================ */

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><div className="h-4 w-3/4 rounded bg-muted animate-pulse" /></CardContent></Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ---- Toolbar ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Status filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'draft', 'in-progress', 'review'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('-', ' ')}
                <span className="ml-1 opacity-60">{statusCounts[s]}</span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative min-w-[160px] max-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <SortBar options={todoSortOptions} value={sortBy} onChange={setSortBy} />
        </div>
        <Button size="sm" onClick={openCreate} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {/* ---- Active Todos Table ---- */}
      <Card>
        <CardContent className="p-0">
          {filteredActive.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">
                {search || statusFilter !== 'all' ? 'No matching todos.' : 'No active todos. Create one to get started.'}
              </p>
            </div>
          ) : (
            <div className="max-h-[520px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="hidden md:table-cell">Assignee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Priority</TableHead>
                    <TableHead className="hidden lg:table-cell">Due</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredActive.map(todo => {
                      const sc = statusConfig[todo.status] || statusConfig.draft
                      const pc = priorityConfig[todo.priority] || priorityConfig.medium
                      const StatusIcon = sc.icon
                      const typeLabel = entityTypeOptions.find(o => o.value === todo.entityType)?.label

                      return (
                        <motion.tr
                          key={todo.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group border-b transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStatusChange(todo, todo.status === 'draft' ? 'in-progress' : todo.status === 'in-progress' ? 'review' : 'draft')}
                                  className="shrink-0 transition-transform hover:scale-110"
                                  title="Cycle status"
                                >
                                  <StatusIcon className={`h-4 w-4 ${todo.status === 'in-progress' ? 'text-blue-500' : todo.status === 'review' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                                </button>
                                <p className="truncate font-medium text-sm">{todo.title}</p>
                              </div>
                              {todo.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 ml-6">{todo.description}</p>
                              )}
                              {typeLabel && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-6 mt-1">{typeLabel}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {todo.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{todo.assignee}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select value={todo.status} onValueChange={v => handleStatusChange(todo, v)}>
                              <SelectTrigger className={`h-7 w-[120px] text-[11px] ${sc.color} border`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).filter(([k]) => k !== 'done').map(([key, val]) => (
                                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${pc.dot}`} />
                              <span className={`text-xs font-medium ${pc.color}`}>{pc.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {todo.dueDate ? (
                              <span className={`text-xs ${!todo.dueDate || new Date(todo.dueDate) < new Date() ? 'text-rose-500' : 'text-muted-foreground'}`}>
                                {format(new Date(todo.dueDate), 'MMM d')}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {format(new Date(todo.createdAt), 'MMM d')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                onClick={() => { setCompleteTarget(todo); setCompleteRemarks('') }}
                                title="Mark Complete"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => openEdit(todo)}
                                title="Edit"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeleteTarget(todo)}
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Completed Section (loaded on demand) ---- */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => {
            const next = !showCompleted
            setShowCompleted(next)
            if (next && !completedLoaded) fetchCompletedTodos()
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Completed</span>
            <Badge variant="secondary" className="text-[10px]">
              {completedLoaded ? completedTodos.length : '...'}
            </Badge>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showCompleted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t">
                {completedLoading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : sortedCompleted.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">No completed todos yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2 flex items-center justify-between bg-muted/20">
                      <span className="text-xs text-muted-foreground">{sortedCompleted.length} completed task{sortedCompleted.length !== 1 ? 's' : ''}</span>
                      <SortBar options={completedSortOptions} value={completedSortBy} onChange={setCompletedSortBy} />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[35%]">Title</TableHead>
                            <TableHead className="hidden md:table-cell">Assignee</TableHead>
                            <TableHead className="hidden sm:table-cell">Priority</TableHead>
                            <TableHead className="hidden lg:table-cell">Completed</TableHead>
                            <TableHead className="hidden lg:table-cell">Remarks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedCompleted.map(todo => {
                            const pc = priorityConfig[todo.priority] || priorityConfig.medium
                            return (
                              <TableRow key={todo.id} className="opacity-75">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium line-through">{todo.title}</p>
                                      {todo.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">{todo.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {todo.assignee ? (
                                    <div className="flex items-center gap-1.5">
                                      <User className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs">{todo.assignee}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${pc.dot}`} />
                                    <span className={`text-xs ${pc.color}`}>{pc.label}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                                  {todo.completedAt ? format(new Date(todo.completedAt), 'MMM d, yyyy') : '—'}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[150px] truncate">
                                  {todo.remarks || '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-0.5">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => openEdit(todo)}
                                      title="Edit"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => openHistory(todo)}
                                      title="View History"
                                    >
                                      <History className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                      onClick={() => setDeleteTarget(todo)}
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================================================================ */}
      {/*  Create / Edit Dialog                                             */}
      {/* ================================================================ */}
      <Dialog open={editorOpen} onOpenChange={(open) => { setEditorOpen(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
            <DialogDescription>
              {editingTodo
                ? editingTodo.archived
                  ? 'This todo is completed. Edits will be saved as logs.'
                  : 'Update the todo details.'
                : 'Add a new task to track.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {editingTodo?.archived && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                This todo is already completed. Any changes will be logged in the history.
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="todo-title">Title *</Label>
              <Input
                id="todo-title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="What needs to be done?"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="todo-desc">Description</Label>
              <Textarea
                id="todo-desc"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Additional details..."
                rows={2}
              />
            </div>

            <div className="grid gap-3 grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <Select value={form.entityType} onValueChange={v => setForm(f => ({ ...f, entityType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {entityTypeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="todo-assignee">Assignee</Label>
                <Input
                  id="todo-assignee"
                  value={form.assignee}
                  onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                  placeholder="Name of the person"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="todo-due">Due Date</Label>
                <Input
                  id="todo-due"
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditorOpen(false); resetForm() }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingTodo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================ */}
      {/*  Complete Dialog                                                   */}
      {/* ================================================================ */}
      <Dialog open={!!completeTarget} onOpenChange={() => { setCompleteTarget(null); setCompleteRemarks('') }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Complete</DialogTitle>
            <DialogDescription>
              Move &quot;{completeTarget?.title}&quot; to completed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {completeTarget?.assignee && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Assigned to: <span className="font-medium">{completeTarget.assignee}</span></span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="complete-remarks">Remarks (optional)</Label>
              <Textarea
                id="complete-remarks"
                value={completeRemarks}
                onChange={e => setCompleteRemarks(e.target.value)}
                placeholder="Add completion notes, summary of work done..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Any remarks here will be saved with the todo and visible in the completed section.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setCompleteTarget(null); setCompleteRemarks('') }}>Cancel</Button>
            <Button onClick={handleComplete} disabled={completing} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              {completing ? 'Completing...' : <><CheckCircle2 className="h-4 w-4" /> Complete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================ */}
      {/*  History Dialog (loaded on demand — NOT on page render)            */}
      {/* ================================================================ */}
      <Dialog open={!!historyTodo} onOpenChange={() => { setHistoryTodo(null); setHistory([]) }}>
        <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Change History
            </DialogTitle>
            <DialogDescription>
              {historyTodo?.title}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {historyLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No history recorded for this todo.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-lg border px-3 py-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {entry.action}
                    </Badge>
                    <span className="text-muted-foreground">
                      {format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {entry.field && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-muted-foreground font-medium min-w-[50px]">{entry.field}:</span>
                      {entry.oldValue && (
                        <span className="text-rose-500 line-through bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded">
                          {entry.oldValue.length > 40 ? entry.oldValue.slice(0, 40) + '...' : entry.oldValue}
                        </span>
                      )}
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      {entry.newValue && (
                        <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                          {entry.newValue.length > 40 ? entry.newValue.slice(0, 40) + '...' : entry.newValue}
                        </span>
                      )}
                    </div>
                  )}
                  {entry.actor && (
                    <div className="text-muted-foreground mt-1">by {entry.actor}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================================================================ */}
      {/*  Delete Confirmation                                              */}
      {/* ================================================================ */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
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
    </motion.div>
  )
}