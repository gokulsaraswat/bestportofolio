'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldOff, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <motion.div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <ShieldOff className="h-10 w-10 text-destructive" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Access Restricted
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {error.message?.includes('auth') || error.message?.includes('login') || error.message?.includes('credential')
            ? 'You need to sign in to access the admin panel. Please authenticate to continue.'
            : 'Something went wrong in the admin panel. You can try again or head back to safety.'}
        </motion.p>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="outline" onClick={reset} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}