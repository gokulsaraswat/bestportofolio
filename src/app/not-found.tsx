'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Floating background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated ghost icon */}
        <motion.div
          className="mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Ghost className="h-16 w-16 text-muted-foreground/30" />
        </motion.div>

        {/* Big 404 */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-[8rem] sm:text-[10rem] font-black leading-none text-primary/10 select-none">
            404
          </span>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Lost?
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-2xl font-bold mt-4 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </motion.p>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button asChild size="lg">
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}