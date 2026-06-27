'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroCarouselProps {
  images: string[]
  intervalMs?: number
}

export function HeroCarousel({ images, intervalMs = 3000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(next, intervalMs)
    return () => clearInterval(timer)
  }, [next, intervalMs, images.length])

  if (!images.length || images.every(img => !img)) return null

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={images[current]}
            alt={`Carousel image ${current + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
        </motion.div>
      </AnimatePresence>
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}