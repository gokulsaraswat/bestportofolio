'use client'

import { useState, useEffect } from 'react'
import { ScrollText, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'

interface LogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  details: string
  actor: string
  createdAt: string
}

const actionColors: Record<string, string> = {
  created: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  updated: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  deleted: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  published: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  login: 'bg-sky-500/10 text-sky-500 border-sky-500/30',
  ingest: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  backup: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30',
  status_change: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
}

export function OperationLogsPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/operation-logs')
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [])

  const uniqueActions = [...new Set(logs.map(l => l.action))]

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.action.includes(search) || l.details.includes(search) || l.actor.includes(search) || l.entityType.includes(search)
    const matchAction = actionFilter === 'all' || l.action === actionFilter
    return matchSearch && matchAction
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Last {filtered.length} operations (max 1000 retained)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-xs" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Filter action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Time</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Action</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Entity</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Actor</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id} className={`border-b last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={`text-[10px] ${actionColors[log.action] || ''}`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{log.entityType}</span>
                        {log.entityId && <span className="text-muted-foreground truncate max-w-[100px]">{log.entityId}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{log.actor}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[300px] truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <ScrollText className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No operation logs yet.</p>
        </div>
      )}
    </div>
  )
}