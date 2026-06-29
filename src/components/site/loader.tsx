'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/*
  SiteLoader — toggleable loading animation.
  
  USAGE:
    Set SHOW_LOADER = true  → loader plays on every page navigation
    Set SHOW_LOADER = false → loader is completely hidden

  To replace the animation, swap the <LoaderVisual /> return value.
  Everything else (routing, timing, fade-in/out) stays the same.
*/

const SHOW_LOADER = false
const LOADER_DURATION_MS = 1200

function LoaderVisual() {
  /* ── REPLACE THIS with any GIF / Lottie / SVG / CSS animation ── */
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative h-12 w-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-muted" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary/50" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </motion.div>
      <motion.p
        className="text-sm font-medium text-muted-foreground tracking-wider uppercase"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Loading
      </motion.p>
    </div>
  )
  /* ── END REPLACE ── */
}

export function SiteLoader({ isLoading }: { isLoading: boolean }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!SHOW_LOADER) return
    if (isLoading) {
      // Use transition to avoid direct setState in effect body
      const id = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(id)
    } else {
      const t = setTimeout(() => setShow(false), 300)
      return () => clearTimeout(t)
    }
  }, [isLoading])

  if (!SHOW_LOADER) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="site-loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <LoaderVisual />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* Hook: returns isLoading flag that auto-resets after LOADER_DURATION_MS */
export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [key, setKey] = useState(0)

  const trigger = () => {
    if (!SHOW_LOADER) return
    setIsLoading(true)
    setKey(k => k + 1)
    setTimeout(() => setIsLoading(false), LOADER_DURATION_MS)
  }

  return { isLoading, trigger, key }
}