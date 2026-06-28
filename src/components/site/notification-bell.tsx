'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)

  const unreadMessages = messages.filter((m) => !m.read)
  const unreadCount = unreadMessages.length

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data: ContactMessage[] = await res.json()
        setMessages(data)
      }
    } catch {
      // Silently fail — notifications are non-critical
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Refresh when popover opens
  useEffect(() => {
    if (open) {
      fetchMessages()
    }
  }, [open, fetchMessages])

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      )
    } catch {
      // Silently fail
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)
      const unread = messages.filter((m) => !m.read)
      await Promise.all(
        unread.map((m) =>
          fetch('/api/messages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: m.id, read: true }),
          })
        )
      )
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
    } catch {
      // Silently fail
    } finally {
      setMarkingAll(false)
    }
  }

  const displayMessages = unreadMessages.length > 0
    ? unreadMessages
    : messages.slice(0, 5)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
              disabled={markingAll}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {markingAll ? 'Marking...' : 'Mark all read'}
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-80">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
              <Mail className="h-8 w-8 opacity-40" />
              <span>No messages yet</span>
            </div>
          ) : (
            <div className="divide-y">
              {displayMessages.map((msg) => (
                <button
                  key={msg.id}
                  className={cn(
                    'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-accent/50',
                    !msg.read && 'bg-accent/20'
                  )}
                  onClick={() => {
                    if (!msg.read) markAsRead(msg.id)
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">
                      {msg.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {msg.subject || msg.message.slice(0, 60)}
                  </p>
                  {!msg.read && (
                    <span className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-destructive" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {messages.length > 0 && (
          <div className="border-t px-4 py-2.5">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              View all messages
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}