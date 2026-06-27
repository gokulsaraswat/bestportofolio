'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Mail, MailOpen, MailCheck, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { SortBar, SortOption } from './sort-bar'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

const messageSortOptions: SortOption[] = [
  { value: 'name:asc', label: 'Name A → Z' },
  { value: 'name:desc', label: 'Name Z → A' },
  { value: 'status:asc', label: 'Unread First' },
  { value: 'status:desc', label: 'Read First' },
  { value: 'date:desc', label: 'Date Newest' },
  { value: 'date:asc', label: 'Date Oldest' },
]

export function MessageManager() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [sortBy, setSortBy] = useState('date:desc')

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch {
      toast({ title: 'Failed to fetch messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sortedMessages = useMemo(() => {
    const [field, dir] = sortBy.split(':')
    const sorted = [...messages].sort((a, b) => {
      let cmp = 0
      if (field === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else if (field === 'status') {
        const statusVal = (r: boolean) => (r ? 1 : 0)
        cmp = statusVal(a.read) - statusVal(b.read)
      } else if (field === 'date') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return dir === 'desc' ? -cmp : cmp
    })
    return sorted
  }, [messages, sortBy])

  const markAsRead = async (message: Message) => {
    if (message.read) {
      setSelectedMessage(message)
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id, read: true }),
      })

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
        )
        setSelectedMessage({ ...message, read: true })
      }
    } catch {
      toast({ title: 'Failed to mark as read', variant: 'destructive' })
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {messages.length} total message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="text-xs">
            {unreadCount} unread
          </Badge>
        )}
        <div className="ml-auto">
          <SortBar options={messageSortOptions} value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MailOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No messages yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Messages from the contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="max-h-[520px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Status</TableHead>
                    <TableHead className="w-[20%]">From</TableHead>
                    <TableHead className="hidden sm:table-cell w-[30%]">Subject</TableHead>
                    <TableHead className="hidden md:table-cell w-[35%]">Preview</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMessages.map((msg) => (
                    <TableRow
                      key={msg.id}
                      className={`cursor-pointer ${!msg.read ? 'bg-primary/5' : ''}`}
                      onClick={() => markAsRead(msg)}
                    >
                      <TableCell>
                        {msg.read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <div className="relative">
                            <Mail className="h-4 w-4 text-primary" />
                            <Circle className="absolute -top-0.5 -right-0.5 h-2 w-2 fill-primary text-primary" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm ${
                              !msg.read ? 'font-semibold' : 'font-medium'
                            }`}
                          >
                            {msg.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{msg.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className={`truncate text-sm ${!msg.read ? 'font-medium' : ''}`}>
                          {msg.subject || <span className="italic text-muted-foreground">No subject</span>}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="truncate text-sm text-muted-foreground">
                          {msg.message.slice(0, 80)}...
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(msg)
                          }}
                        >
                          {msg.read ? 'View' : 'Read'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedMessage?.read ? (
                <MailOpen className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Mail className="h-5 w-5 text-primary" />
              )}
              <DialogTitle>{selectedMessage?.subject || 'No Subject'}</DialogTitle>
            </div>
            <DialogDescription>
              From{' '}
              <span className="font-medium text-foreground">
                {selectedMessage?.name}
              </span>{' '}
              ({selectedMessage?.email}) &middot;{' '}
              {selectedMessage &&
                format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy h:mm a')}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {selectedMessage && (
            <div className="max-h-[300px] overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {selectedMessage?.read ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MailCheck className="h-3.5 w-3.5" />
                Read
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <Circle className="h-2 w-2 fill-primary text-primary" />
                Unread
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}