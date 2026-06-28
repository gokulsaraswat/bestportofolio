'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function ensureHeadingIds(container: HTMLElement | null): Heading[] {
  if (!container) return []

  const headings = container.querySelectorAll('h2, h3')
  const items: Heading[] = []

  headings.forEach((heading) => {
    const el = heading as HTMLElement
    if (!el.id) {
      el.id = slugify(el.textContent || `heading-${items.length}`)
    }
    // Ensure id is unique
    const baseId = el.id
    let counter = 1
    while (document.getElementById(el.id)) {
      if (el.id === baseId) {
        counter = 1
      }
      el.id = `${baseId}-${counter}`
      counter++
    }
    items.push({
      id: el.id,
      text: el.textContent || 'Heading',
      level: el.tagName === 'H2' ? 2 : 3,
    })
  })

  return items
}

export function TableOfContents({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const mutationRef = useRef<MutationObserver | null>(null)

  const updateHeadings = useCallback(() => {
    const items = ensureHeadingIds(containerRef.current)
    setHeadings(items)
  }, [containerRef])

  // Set up MutationObserver to detect when headings are added/removed
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    updateHeadings()

    mutationRef.current = new MutationObserver(() => {
      updateHeadings()
    })

    mutationRef.current.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationRef.current?.disconnect()
    }
  }, [containerRef, updateHeadings])

  // Set up IntersectionObserver to track active heading
  useEffect(() => {
    if (headings.length === 0) return

    // Clean up previous observer
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Sort by top position, pick the one closest to top
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          setActiveId(sorted[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    )

    observerRef.current = observer

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setMobileOpen(false)
    }
  }

  if (headings.length === 0) return null

  const tocContent = (
    <nav aria-label="Table of contents">
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => handleClick(h.id)}
              className={cn(
                'block w-full text-left text-sm leading-relaxed transition-colors hover:text-foreground',
                h.level === 3 ? 'pl-4' : 'pl-0',
                activeId === h.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
              aria-current={activeId === h.id ? 'true' : undefined}
            >
              <span
                className={cn(
                  'inline-block transition-transform',
                  h.level === 3 && 'before:mr-1.5 before:content-[""] before:inline-block before:w-1 before:h-1 before:rounded-full before:bg-current before:align-middle'
                )}
              >
                {h.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block" aria-label="Table of contents">
        <div className="sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            On this page
          </p>
          <ScrollArea className="max-h-[calc(100vh-8rem)]">
            <div className="pr-4">{tocContent}</div>
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile: drawer trigger button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              aria-label="Table of contents"
            >
              <List className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Table of Contents</DrawerTitle>
              <DrawerDescription>Jump to a section</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ScrollArea className="max-h-[60vh]">
                {tocContent}
              </ScrollArea>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" className="mx-4 mb-4 w-[calc(100%-2rem)]">
                Close
              </Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}