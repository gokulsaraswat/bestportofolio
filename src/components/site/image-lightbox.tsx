'use client'

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* -------------------------------------------------------------------------- */
/*  ImageLightbox (standalone fullscreen overlay)                             */
/* -------------------------------------------------------------------------- */

interface ImageLightboxProps {
  images: string[]
  alt?: string
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({
  images,
  alt = '',
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0) // -1 left, 1 right, 0 initial
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen])

  const goTo = useCallback(
    (index: number, dir: number) => {
      const len = images.length
      const next = ((index % len) + len) % len
      setCurrentIndex(next)
      setDirection(dir)
    },
    [images.length],
  )

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    goTo(currentIndex + 1, 1)
  }, [currentIndex, goTo, images.length])

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    goTo(currentIndex - 1, -1)
  }, [currentIndex, goTo, images.length])

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: globalThis.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goPrev()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, goNext, goPrev, onClose])

  // Touch / swipe handlers
  const handleTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    },
    [],
  )

  const handleTouchEnd = useCallback(
    (e: ReactTouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return
      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = e.changedTouches[0].clientY - touchStartY.current
      // Only handle horizontal swipes (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) goNext()
        else goPrev()
      }
      touchStartX.current = null
      touchStartY.current = null
    },
    [goNext, goPrev],
  )

  // Handle swipe via framer-motion drag
const handleDragEnd = useCallback(
  (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -60) {
      goNext()
    } else if (info.offset.x > 60) {
      goPrev()
    }
  },
  [goNext, goPrev],
)

  // Click backdrop to close
  const handleBackdropClick = useCallback(
  (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  },
  [onClose],
)

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  if (images.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/30"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Previous button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/30"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/30"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Image */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={alt ? `${alt} — ${currentIndex + 1} of ${images.length}` : `Image ${currentIndex + 1} of ${images.length}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="max-h-[85vh] max-w-[90vw] select-none rounded-lg object-contain"
              draggable={false}
            />
          </AnimatePresence>

          {/* Counter */}
          {images.length > 1 && (
            <motion.div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white/90 tabular-nums backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */
/*  ImageGallery (clickable grid that opens the lightbox)                      */
/* -------------------------------------------------------------------------- */

interface ImageGalleryProps {
  images: string[]
  alt?: string
  /** Number of columns on larger screens. Default '2'. */
  columns?: '1' | '2' | '3' | '4'
}

export function ImageGallery({ images, alt = '', columns = '2' }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  if (images.length === 0) return null

  // Column grid classes — first image always spans full width
  const colsClass: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <>
      <div className={`grid gap-3 ${colsClass[columns]}`}>
        {images.map((src, i) => {
          const isFirst = i === 0 && images.length > 1
          const colSpan = isFirst
            ? columns === '1'
              ? ''
              : 'sm:col-span-2'
            : ''

          return (
            <div
              key={i}
              className={`group relative cursor-pointer overflow-hidden rounded-xl bg-muted aspect-video ${colSpan}`}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: ReactKeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openLightbox(i)
                }
              }}
              aria-label={alt ? `View ${alt} — image ${i + 1}` : `View image ${i + 1}`}
            >
              <img
                src={src}
                alt={alt ? `${alt} — ${i + 1}` : `Image ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                draggable={false}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </div>
            </div>
          )
        })}
      </div>

      <ImageLightbox
        key={selectedIndex}
        images={images}
        alt={alt}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  )
}