'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface ShortcutItem {
  keys: string[]
  description: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'K'], description: 'Open search' },
  { keys: ['/'], description: 'Focus search (when available)' },
  { keys: ['Esc'], description: 'Close modal / dialog' },
  { keys: ['j'], description: 'Navigate down' },
  { keys: ['k'], description: 'Navigate up' },
  { keys: ['t'], description: 'Toggle theme' },
  { keys: ['?'], description: 'Show this shortcuts overlay' },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-foreground shadow-[0_1px_0_1px_hsl(var(--border))">
      {children}
    </kbd>
  )
}

export function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }

      // Theme toggle
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const themeBtn = document.querySelector<HTMLButtonElement>(
          '[data-theme-toggle]'
        )
        if (themeBtn) {
          themeBtn.click()
        }
      }

      // Close on Escape
      if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate and interact with the site faster using these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid gap-3 py-1">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm text-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={key} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-muted-foreground text-xs">+</span>
                    )}
                    <Kbd>{key}</Kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <p className="text-[11px] text-muted-foreground text-center">
          Press <Kbd>?</Kbd> to toggle &middot; <Kbd>Esc</Kbd> to close
        </p>
      </DialogContent>
    </Dialog>
  )
}